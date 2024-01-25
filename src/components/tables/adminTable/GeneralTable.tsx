import { ColumnDef, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, RowData, createColumnHelper, getSortedRowModel, VisibilityState } from '@tanstack/react-table'
import { ChangeEvent, useEffect, useState } from 'react'
import dataService from '../../../services/handleRequests'
import '../styles/tableStyles.css'
import handleFilterRequest from '../../../services/handleFilterRequest'
import handleRequests from '../../../services/handleRequests'

// Celdas editables:
import TableCell from './tableCell/TableCell'
import EditCell from './adminEdit/EditCell'
import EditAdminCell from './superAdminEdit/EditAdminCell'

// Iconos:
import { BiSolidChevronsLeft } from "react-icons/bi"
import { BiSolidChevronLeft } from "react-icons/bi"
import { BiSolidChevronRight } from "react-icons/bi"
import { BiSolidChevronsRight } from "react-icons/bi"
import { Message } from '../message/Message'
import { BiSolidUserPlus } from "react-icons/bi";
import CreateUser from '../../highAdmin/createUser/createUser'

// Revisar esta declaración de módulo:
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void,
        newRows: any,
        setNewRows: any,
        revertData: any,
        removeRow: any,
        makeAdmin: any
    }
}

// Forma de la fila:
type Employee = {
    rut: string,
    nombres: string,
    apellidos: string,
    email: string,
    rol: string,
    dependencias: string,
    direcciones: string,
    numMunicipal: string,
    anexoMunicipal: number
}

// Editar info en una celda:
const defaultColumn: Partial<ColumnDef<Employee>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue()
        const [value, setValue] = useState(initialValue)

        const blur = () => {
            table.options.meta?.updateData(index, id, value)
        }

        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
            <input 
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={blur}
            />
        )
    }
}

const columnhelper = createColumnHelper<Employee>()

interface adminTable {
    rol: string
}

// Componente principal:
const GeneralTable: React.FC<adminTable> = ({ rol }) => {
    // Info de la tabla:
    const [data, setData] = useState<Employee[]>([])
    const [cancelChange, setCancelChange] = useState<Employee[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Funcionamiento de la tabla:
    const [newRows, setNewRows] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ 'edit': false })

    // Valores para los filtros:
    const [searchValue, setSearchValue] = useState('')
    const [searchColumn, setSearchColumn] = useState('')
    const [filterOrder, setFilterOrder] = useState('normal')
    const [showMessage, setShowMessage] = useState(false)
    
    const rerender = () => {
        dataService.getUsers(pageSize, page)
            .then(data => {
                setData(data.content)
                setCancelChange(data.content)
            })
    }

    useEffect(() => {
        dataService.getUsers(page, pageSize)
            .then(data => {
                setData(data.content)
                setCancelChange(data.content)
                setTotal(data.totalData)
            })
        rol !== 'user' ? setColumnVisibility({ 'edit': true }) : ''
    }, [])
    
    const columns = [
        columnhelper.group({
            id: 'Persona',
            header: () => <span>Persona</span>,
            columns: [
                columnhelper.accessor('rut', {
                    header: 'Rut',
                    cell: TableCell,
                    meta: {
                        type: "text"
                    }
                }),
                columnhelper.accessor('nombres', {
                    header: 'Nombres',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('apellidos', {
                    header: 'Apellidos',
                    cell: TableCell,
                    meta: {
                        type: "text"
                    }
                }),
                columnhelper.accessor('email', {
                    header: 'Correo',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                })
            ]
        }),
        columnhelper.group({
            id: 'Muni info',
            header: () => <span>Muni info</span>,
            columns: [
                columnhelper.accessor('rol', {
                    header: 'Rol',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('dependencias', {
                    header: 'Dependencias',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('direcciones',{
                    header: 'Dirección',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('numMunicipal',{
                    header: 'N° Municipal',
                    cell: TableCell,
                    meta: {
                        type: 'text'
                    }
                }),
                columnhelper.accessor('anexoMunicipal',{
                    header: 'Anexo Municipal',
                    cell: TableCell,
                    meta: {
                        type: 'number'
                    }
                })
            ]
        }),
        columnhelper.display({
            header: 'Acciones',
            id: "edit",
            cell: rol === 'superAdmin'
                ? EditAdminCell
                : rol === 'admin' ? EditCell : ''
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        state: {
            columnVisibility
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            newRows,
            setNewRows,
            revertData: (rowIndex: number, revert: boolean) => {
                if (revert) {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowIndex ? cancelChange[rowIndex] : row
                        )
                    );
                } else {
                    setCancelChange((old) =>
                        old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))    
                    )
                }
                rerender()
            },
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                dataService.updateUser(cancelChange[rowIndex].rut, columnId, value, rol)
                    .then(res => {
                        alert(res.message)
                        console.log(res)
                        rerender()
                    })
                    .catch(error => {
                        alert(error.response.data.error)
                        rerender()
                    })
            },
            removeRow: async (rowIndex: number) => {
                const decision = window.confirm('¿Quieres eliminar este usuario?')
                if (decision) {
                    await dataService.deleteUser(cancelChange[rowIndex].rut)
                    console.log('Usuario eliminado.')
                }
                rerender()
            },
            makeAdmin: async (rowIndex: number) => {
                const decision = window.confirm(cancelChange[rowIndex].rol === 'user' ? `¿Quieres que este usuario se convierta en admin?` : `¿Quieres que este usuario deje de ser admin?`)
                if (decision) {
                    try {
                        const request = await dataService.makeAdmin(cancelChange[rowIndex].rut)
                        console.log(request.message)
                    } catch(error) {
                        console.log(error)
                    }
                    rerender()
                }
            }
        },  
    })

    useEffect(() => {
        rerender()
    }, [page])

    const handleFilter = (column: string) => {
        // console.log(filterOrder === 'asc' ? `${filterOrder} => desc` : filterOrder === 'desc' ? `${filterOrder} => normal` : `${filterOrder} => asc`)
        if (filterOrder === 'asc') {
            handleFilterRequest.toggleFilter(column, 'desc', searchValue, searchColumn, pageSize, page)
                .then(res => {
                    setData(res.filteredData)
                    setCancelChange(res.filteredData)
                })
            setFilterOrder('desc')
        } else if (filterOrder === 'desc') {
            handleFilterRequest.toggleFilter(column, 'normal', searchValue, searchColumn, pageSize, page)
                .then(res => {
                    setData(res.filteredData)
                    setCancelChange(res.filteredData)
                })
            setFilterOrder('normal')
        } else if (filterOrder === 'normal') {
            handleFilterRequest.toggleFilter(column, 'asc', searchValue, searchColumn, pageSize, page)
                .then(res => {
                    setData(res.filteredData)
                    setCancelChange(res.filteredData)
                })
            setFilterOrder('asc')
        }
    }

    const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>, column: any) => {
        setSearchValue(event.target.value)
        setSearchColumn(column)
        const timeout = setTimeout(() => {
            handleFilterRequest.searchFilter(column, event.target.value, pageSize, page)
                .then(res => {
                    res.length === 0 ? setShowMessage(true) : setShowMessage(false)
                    setData(res.filteredData)
                    setCancelChange(res.filteredData)
                    setTotal(res.totalData)
                })
        }, 500)
        return () => clearTimeout(timeout)
    }

    const handlePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
        handleRequests.getUsers(Number(event.target.value), page)
            .then(res => {
                setData(res.content)
                setCancelChange(res.content)
            })
        table.setPageSize(Number(event.target.value))
        setPageSize(Number(event.target.value))
    }

    const handleNewUser = () => {
        document.getElementById('newUserContainer')?.classList.toggle('invisible')
        document.getElementById('newUserFormBG')?.classList.toggle('opacity-0')
        document.getElementById('newUserFormBG')?.classList.toggle('opacity-50')
        document.getElementById('newUserForm')?.classList.toggle('translate-x-full')
    }

    return (
       <div className="p-2">
            <table className="border-solid border-1 border-gray-100 block w-fit border-collapse my-6 mx-auto text-base shadow-md table">
                <thead>
                    {table.getHeaderGroups().map(group => (
                        <tr key={group.id}>
                            {group.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan} className="bg-zinc-200 border-2 border-solid border-gray-300 py-0.5 px-1 w-fit min-w-32">
                                    {header.isPlaceholder ? null : (
                                    <>
                                        <div 
                                        {...{
                                            className: 'cursor-pointer'
                                        }}
                                        onClick={() => handleFilter(header.id)}
                                        >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                        <div>
                                            {/* header.column */}
                                            <input
                                                type="text"
                                                onChange={event => handleSearchFilter(event, header.column.id)}
                                                placeholder='Buscar...'
                                                className="w-28 p-1 rounded my-2"
                                            />
                                        </div>
                                        ) : null}
                                    </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="border-b border-solid border-gray-100">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="border-b border-solid border-gray-300" >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className={ row.original.rol === 'admin' || row._valuesCache.rol === 'superAdmin'
                                    ? "text-left py-2 px-2.5 border-r border-solid border-gray-300 bg-cyan-50 w-fit max-h-2"
                                    : "text-left py-2 px-2.5 border-r border-solid border-gray-300 w-fit max-h-2"}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot className='bg-gradient-to-t from-to-slate-300 to-white'>
                    <tr>
                        <td colSpan={10}>
                            <div className="flex justify-end pt-2">
                                <button className="flex gap-2 rounded-md bg-green-50 px-2 py-1 ring-1 ring-inset ring-green-600/20 hover:bg-green-200 hover:ring-green-500" onClick={handleNewUser}>
                                    <BiSolidUserPlus className="text-green-700" size={24} />
                                    <span className="text-base text-green-700">Crear nuevo usuario</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <div className="flex justify-start p-2">
                                <p className="font-medium">
                                    Mostrando <span className="underline decoration-1 underline-offset-2">{data.length}</span> de <span className="underline decoration-1 underline-offset-2">{total}</span> registros
                                </p>
                            </div>
                        </td>
                        <td colSpan={5}>
                            <div className="flex justify-end p-2 gap-6">
                                <span className="flex items-center gap-2">
                                    <p>Página actual:</p>
                                    <strong>
                                        { page } de {' '}
                                        { Math.floor(total / pageSize) + 1 }
                                    </strong>
                                </span>
                                <span className="flex items-center gap-2">
                                    Ir a la página:
                                    <input
                                        type="text"
                                        value={page}
                                        onChange={event => {
                                            const fakeNumber = Number(event.target.value)
                                            if (!Number.isNaN(fakeNumber)) {
                                                setPage(Number(event.target.value))
                                                rerender()
                                            }
                                        }}
                                        className="px-2 rounded w-8"
                                    />
                                </span>
                                <select value={pageSize} onChange={handlePageSize}
                                    className="px-2 py-1 rounded w-32"
                                    >
                                    { [10, 20, 30, 40, 50].map(number => {
                                        return <option key={number} value={number}>Mostrar {number}</option>
                                    }) }
                                </select>
                                <span className="flex items-center gap-1">
                                    <button
                                        className={page - 1 <= 0 ? "cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded" : "cursor-pointer py-1 px-1 border border-slate-300 bg-white hover:bg-gray-100 rounded"}
                                        onClick={() => setPage(1)}
                                        disabled={page - 1 <= 0 ? true : false}
                                    >
                                        <BiSolidChevronsLeft size={24} />
                                    </button>
                                    <button
                                        className={page - 1 <= 0 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => setPage(page - 1 < 1 ? 1 : page - 1)}
                                        disabled={page - 1 <= 0 ? true : false}
                                        >
                                        <BiSolidChevronLeft size={24} />
                                    </button>
                                    <button
                                        className={page + 1 >= Math.floor(total / pageSize) + 1 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => setPage(page + 1)}
                                        disabled={page + 1 >= Math.floor(total / pageSize) + 1 ? true : false}
                                    >
                                        <BiSolidChevronRight size={24} />
                                    </button>
                                    <button
                                        className={page + 1 >= Math.floor(total / pageSize) + 1 ? 'cursor-default py-1 px-1 border text-gray-300 border-slate-300 bg-white rounded' : "cursor-pointer py-1 px-2 border border-slate-300 bg-white hover:bg-gray-100 rounded nav-button"}
                                        onClick={() => setPage(Math.floor(total / pageSize) + 1)}
                                        disabled={page + 1 >= Math.floor(total / pageSize) + 1 ? true : false}
                                    >
                                        <BiSolidChevronsRight size={24} />
                                    </button>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            { showMessage ? 
            <div className="flex justify-center mb-5">
                <Message />
            </div>
            : '' }
            <div id="newUserContainer" className="fixed inset-0 w-full h-full invisible">
                <div id="newUserFormBG" className="w-full h-full duration-500 ease-out transition-all inset-0 absolute bg-gray-900 opacity-0" onClick={handleNewUser}></div>
                <div id="newUserForm" className="w-2/5 h-full duration-300 ease-out transition-all absolute bg-gray-300 right-0 top-0 translate-x-full">
                    <CreateUser />
                </div>
            </div>
       </div>
    )
}

export default GeneralTable