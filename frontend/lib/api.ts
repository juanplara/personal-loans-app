// frontend/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API client centralizado para el frontend (Next + TypeScript)
 *
 * - BaseURL viene de NEXT_PUBLIC_API_URL (.env.local)
 * - No leemos localStorage en top-level para evitar errores SSR.
 * - Interceptor de request agrega Authorization si existe token en localStorage (solo cliente).
 * - Funciones auxiliares: setAuthToken() para controlar el header por código (útil desde AuthContext).
 */

// fallback por si olvidas NEXT_PUBLIC_API_URL
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true, // habilitar si usas cookies HttpOnly (ajustar backend)
});

/**
 * setAuthToken
 * - Si pasas token => lo guarda en axios.defaults y en localStorage (cliente).
 * - Si pasas null/undefined => limpia token.
 *
 * Úsalo desde tu AuthContext cuando hagas login/logout.
 */
export function setAuthToken(token?: string | null) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (typeof window !== 'undefined') {
        try { localStorage.setItem('token', token); } catch (e) { /* ignore */ }
        }
    } else {
        delete api.defaults.headers.common['Authorization'];
        if (typeof window !== 'undefined') {
        try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
        }
    }
}

/**
 * Interceptor request:
 * Si estamos en el cliente y existe token en localStorage, lo anexa al header.
 * Protegemos con typeof window !== 'undefined' para evitar errores SSR.
 */
api.interceptors.request.use((config: AxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        try {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        } catch (e) {
        // no hacemos nada si localStorage no está disponible
        }
    }
    return config;
    }, (error) => Promise.reject(error));

/**
 * Interceptor response (opcional, útil para manejar 401 globalmente).
 * Aquí limpiamos token local y puedes despachar evento para redirigir al login.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
        if (typeof window !== 'undefined') {
            try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
            // opción: redirigir a login
            // window.location.href = '/login';
        }
        }
        return Promise.reject(error);
    }
);

export default api;
