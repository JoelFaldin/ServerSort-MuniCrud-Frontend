import GeneralTable from '../tables/adminTable/GeneralTable'
import dataService from '../../services/handleRequests'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface UserName {
    nombres: String
}

const AdminPage = () => {
    const [userName, setUserName] = useState<UserName>()
    const token = localStorage.getItem('jwt')
    const navigate = useNavigate()

    const greetingsArray = ['Bienvenido', 'Buenas', 'Saludos']
    const greeting = greetingsArray[Math.floor(Math.random() * 3)]

    useEffect(() => {
        const getData = async () => {
            try {
                const user = await dataService.getUserData(token)
                setUserName(user)     
                console.log(user)
            } catch(error) {
                alert(error)
            }
        }
        getData()
    }, [])

    const endSession = () => {
        localStorage.removeItem('jwt')
        navigate('/login')
    }

    return (
        <div  className='bg-gradient-to-b from-white to-slate-200 min-h-dvh w-fit min-w-full'>
            <h2 className="text-3xl font-bold text-gray-900 underline underline-offset-4 ml-24 mb-2">Conectado como admin</h2>
            <h3 className="text-xl font-bold text-gray-900 ml-24">{greeting}, <i className="not-italic text-indigo-700">{userName?.nombres}</i></h3>
            <button
                className="ml-24 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-s font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-200 hover:text-indigo 900 hover:ring-indigo-800/10"
                onClick={endSession}
            >
                Cerrar Sesión
            </button>
            <GeneralTable rol={'admin'} />
        </div>
    )
}

export default AdminPage