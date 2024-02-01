import { ChangeEvent, useState } from "react"
import dataService from '../../../services/handleRequests'
import { RiFileExcel2Line } from "react-icons/ri";

interface excelComp {
    onFinish: () => void
}

const ExcelComponent: React.FC<excelComp> = ({ onFinish }) => {
    const [excel, setExcel] = useState<File | null>()
    const [userQuantity, setUserQuantity] = useState<number | string>('todo')
    const [selectPage, setSelectPage] = useState(1)
    const [fileInput, setFileInput] = useState(0)

    const handleExcel = (event: ChangeEvent<HTMLInputElement>) => {
        setExcel(event.target.files?.[0])
    }

    const handlePage = (event: ChangeEvent<HTMLInputElement>) => {
        const numberPage = Number(event.target.value)
        setSelectPage(numberPage)
    }

    const uploadExcel = async () => {
        const jwtToken = localStorage.getItem('jwt')
        try {
            const req = await dataService.uploadExcel(excel, jwtToken)
            alert(req.message)
            setTimeout(() => {
                setExcel(null)
                setFileInput(prev => prev + 1)
            }, 500)
            onFinish()
            } catch(error: any) {
            alert(error.response.data.message)
            setExcel(null)
            setFileInput(prev => prev + 1)
        }
    }

    const downloadExcel = async () => {
        const jwtToken = localStorage.getItem('jwt')
        try {
            await dataService.downloadExcel(userQuantity, selectPage, jwtToken)
            console.log('Archivo descargado!')
        } catch(error) {
            console.log(error)
        }
    }

    const downloadTemplate = async () => {
        try {
            await dataService.downloadTemplate()
            console.log('Plantilla descargada!')
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="h-fit">
            <h1 className="text-center text-xl font-bold p-4 mt-32">Manejo de archivos Excel</h1>
            <div className="flex justify-center">
                <RiFileExcel2Line size={42} />
            </div>
            <span className="max-w-6/12 mt-10 mx-auto flex flex-col justify-center ml-20 gap-16">
                <section className="max-w-xl flex flex-col">
                    <h2 className="text-xl font-medium pb-2 underline decoration-solid underline-offset-2">Sube archivos al sistema</h2>
                    <p className="pb-4 font-medium">Estos datos serán (si la operación tiene éxito) añadidos a la base de datos!</p>
                    <input 
                        type="file"
                        accept=".xls, .xlsx"
                        className="pb-4 font-medium"
                        onChange={handleExcel}
                    />
                    <button
                        className={!excel ? "cursor-default w-fit inline-flex items-center rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-500" : "w-fit inline-flex items-center rounded-md bg-green-200 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 hover:bg-green-400 hover:ring-green-900"}
                        disabled={!excel ? true : false}
                        onClick={uploadExcel}
                    >
                        <span className="text-base">Subir archivo</span>
                    </button>
                    <p className="pt-4 text-xs mb-4">Nota: No puedes subir el mismo archivo múltiples veces.</p>
                    <button
                        className="w-fit inline-flex items-center rounded-md bg-sky-200 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10 hover:bg-sky-400 hover:ring-sky-900"
                        onClick={downloadTemplate}
                    >
                        <span className="text-base">Descargar plantilla</span>
                    </button>
                    <p className="pt-4 text-xs">Esta plantilla lleva los headers necesarios para ser leídos por el sistema.</p>
                </section>

                <section className="max-w-xl">
                    <h3 className="text-xl font-medium pb-2 underline decoration-solid underline-offset-2">Descarga los usuarios</h3>
                    <label
                        htmlFor="userQuantity"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        ¿Cuántos usuarios quieres descargar?
                    </label>
                    <select
                        name="userQuantity"
                        id="userQuantity"
                        className="block w-fit rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
                        onChange={event => setUserQuantity(event.target.value)}
                    >
                        <option value="todo">Todos</option>
                        {
                            [10, 20, 30, 40, 50].map(number => (
                                <option key={`OptionNumber${number}`} value={number}>{number} usuarios</option>
                            ))
                        }
                    </select>
                    {
                        userQuantity !== 'todo' ? (
                            <>
                                <label
                                    htmlFor="page"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Página:
                                </label>
                                <input
                                    id="page"
                                    type="text"
                                    className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={selectPage}
                                    onChange={handlePage}
                                />
                            </>
                        ) : (
                            <></>
                        )
                    }
                    <button
                        className="w-fit inline-flex items-center rounded-md bg-green-200 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 hover:bg-green-400 hover:ring-green-900"
                        onClick={downloadExcel}
                    >
                        <span className="text-base">Descargar archivo</span>
                    </button>
                </section>
            </span>
        </div>
    )
}

export default ExcelComponent