// frontend/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

const api: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
})

// Interceptor de request
api.interceptors.request.use((config: AxiosRequestConfig) => {
  // Primero intentamos leer de cookies
    let token: string | undefined | null = Cookies.get('token')

    // Si no hay en cookies, buscamos en localStorage (solo client)
    if (!token && typeof window !== 'undefined') {
        try {
        token = localStorage.getItem('token')
        } catch (e) {}
    }

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => Promise.reject(error))

// Interceptor de respuesta: si expira el token → limpiamos
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
        Cookies.remove('token')
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        }
        return Promise.reject(error)
    }
)

export default api
