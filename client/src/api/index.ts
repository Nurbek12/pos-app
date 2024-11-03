import axios, {} from 'axios'
import { useStore } from '@/stores'

// export const baseURL = 'http://localhost:3000'
export const baseURL = ''

const store = useStore()
const api = axios.create({ baseURL })

api.interceptors.response.use(
    (resp) => {
        checkToken()
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