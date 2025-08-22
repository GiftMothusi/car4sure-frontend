import Axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

const axios: AxiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

axios.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
            }
        }
        return Promise.reject(error)
    }
)

export default axios
export type { AxiosResponse, AxiosError }