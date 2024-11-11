import axios, {} from 'axios'
import { useStore } from '@/stores'

export const baseURL = import.meta.env.VITE_API_URI || ''

const store = useStore()
const api = axios.create({ baseURL })

api.interceptors.response.use(
    (resp) => {
        checkToken()
        if(resp.data?.status === 'PRINTER_ERROR') {
            store.setPrinterMessage(resp.data?.message)
        }
        return resp
    },
    (err) => {
        if(err.response && err.response.status === 401) {
            store.setAuthData(null, null);
            return
        }
        return Promise.reject(err)
    }
)

export const checkToken = () => {
    const token = store.getToken||''
    api.defaults.headers.common.Authorization = `Bearer ${token}`
}

checkToken()

export default api