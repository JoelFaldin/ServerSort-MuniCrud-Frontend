import axios from "axios"

interface userModel {
    identifier: String,
    names: String,
    lastNames: String,
    email: String,
    passHash: String,
    role: String,
    departments: String,
    directions: String,
    jobNumber: String,
    contactNumber: String
}

const baseUrl = ''

const getUsers = async (searchValue: string, searchColumn: string, pageSize: number, page: number, jwt: string | null) => {
    const req = axios.get(`${baseUrl}/api/newData`, {
        params: {
            searchValue,
            searchColumn,
            pageSize,
            page
        },
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const res = await req
    return res.data
}

const getUserData = async (jwt: string | null) => {
    const request = axios.get(`${baseUrl}/api/getUserData`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const getFilteredUsers = async (column: string, order: string, pageSize: number, page: number, jwt: string | null) => {
    let sendOrder = 0
    if (order === 'asc') {
        sendOrder = 1
    } else if (order === 'desc') {
        sendOrder = -1
    } else if (order === 'normal') {
        sendOrder = 0
    }

    const request = axios.get(`${baseUrl}/api/filterUsers/`, {
        params: {
            column,
            sendOrder,
            pageSize,
            page
        },
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const res = await request
    return res.data
}

const verify = async (identifier: string, password: string): Promise<any> => {
    const request = axios.post(`${baseUrl}/api/verifyLogin`, { identifier, password })
    const res = await request
    return res.data
}

const recoverPassword = async (identifier: string, email: string) => {
    const request = axios.post(`${baseUrl}/api/getPassword`, { identifier, email })
    const res = await request
    return res.data
}

const validateToken = async (token: string | null) => {
    const request = axios.post(`${baseUrl}/api/verifyToken`, { token })
    const res = await request
    return res.data
}

const restorePasword = async (newPassword: string, token: string | null) => {
    const request = axios.patch(`${baseUrl}/api/restorePassword`, { newPassword, token })
    const res = await request
    return res.data
}

const logout = async (jwt: string | null) => {
    const request = axios.post(`${baseUrl}/api/logout`, null, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const createUser = async (object: userModel, jwt: string | null) => {
    const request = axios.post(`${baseUrl}/api/newUser`, object, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const updateUser = async (values: object, pageSize: number, page: number, jwt: string | null) => {
    const request = axios.put(`${baseUrl}/api/update/`, { values, pageSize, page }, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const deleteUser = async (identifier: string, jwt: string | null) => {
    const request = axios.delete(`${baseUrl}/api/delete/${identifier}`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const makeAdmin = async (identifier: string, jwt: string | null) => {
    const request = axios.put(`${baseUrl}/api/newAdmin/${identifier}`, null, { headers: { Authorization: `Bearer ${jwt}` } } )
    const res = await request
    return res.data
}

const getDepartments = async (jwt: string | null) => {
    const request = axios.get(`${baseUrl}/api/getDepartments`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const createDepartment = async (name: string, jwt: string | null) => {
    const request = axios.post(`${baseUrl}/api/newDepartment`, { name }, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const deleteDepartment = async (index: number, jwt: string | null) => {
    const request = axios.delete(`${baseUrl}/api/deleteDepartment/${index}`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const updateDepartment = async (newName: string | null, index: number, jwt: string | null) => {
    const request = axios.put(`${baseUrl}/api/updateDepartment/${index}`, { newName }, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const getDirections = async (jwt: string | null) => {
    const request = axios.get(`${baseUrl}/api/getDirections`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const createDirection = async (newDirection: string, address: string, jwt: string | null) => {
    const request = axios.post(`${baseUrl}/api/newDirection`, { newDirection, address }, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const deleteDirection = async (index: number, jwt: string | null) => {
    const request = axios.delete(`${baseUrl}/api/deleteDirection/${index}`, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const updateDirection = async (editDirection: string | null, address: string | null, index: number, jwt: string | null) => {
    const request = axios.put(`${baseUrl}/api/updateDirection/${index}`, { editDirection, address }, { headers: { Authorization: `Bearer ${jwt}` } })
    const res = await request
    return res.data
}

const uploadExcel = async (excel: File | null | undefined, jwt: string | null) => {
    const formData = new FormData()
    formData.append('excelFile', excel as Blob)

    const request = axios.post(`${baseUrl}/api/uploadExcel`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`
        }
    })

    const res = await request
    return res.data
}

const downloadExcel = async (users: number | string, page: number, jwt: string | null) => {
    const getExcel = await axios.get(`${baseUrl}/api/download`, {
        params: {
            users,
            page,
            jwt
        },
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        responseType: 'blob'
    })

    const blob = new Blob([getExcel.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const anchor = document.createElement('a')
    anchor.href = window.URL.createObjectURL(blob)
    anchor.download = 'userdata.xlsx'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    const res = getExcel
    return res.data
}

const downloadTemplate = async (jwt: string | null) => {
    const getTemplate = await axios.get(`${baseUrl}/api/template`, {
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const blob = new Blob([getTemplate.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const anchor = document.createElement('a')
    anchor.href = window.URL.createObjectURL(blob)
    anchor.download = 'template.xlsx'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    const res = getTemplate
    return res.data
}

export default {
    getUsers,
    getUserData,
    getFilteredUsers,
    verify,
    recoverPassword,
    validateToken,
    restorePasword,
    logout,
    createUser,
    updateUser, 
    deleteUser,
    makeAdmin,
    getDepartments,
    createDepartment,
    deleteDepartment,
    updateDepartment,
    getDirections,
    createDirection,
    deleteDirection,
    updateDirection,
    uploadExcel,
    downloadExcel,
    downloadTemplate,
}