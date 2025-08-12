'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';

// 1️⃣ Definimos el tipo de usuario y del estado global
interface User {
    id: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

type AuthAction =
    | { type: 'LOGIN'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' };

// 2️⃣ Estado inicial
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

// 3️⃣ Reducer para manejar acciones de login y logout
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN':
        return {
            isAuthenticated: true,
            user: action.payload.user,
            token: action.payload.token,
        };
        case 'LOGOUT':
        return {
            isAuthenticated: false,
            user: null,
            token: null,
        };
        default:
        return state;
    }
}

// 4️⃣ Creamos el contexto
const AuthContext = createContext<{
    state: AuthState;
    login: (user: User, token: string) => void;
    logout: () => void;
}>({
    state: initialState,
    login: () => {},
    logout: () => {},
});

// 5️⃣ Provider que envuelve la app
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Cargar token/usuario del localStorage al iniciar
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
        dispatch({
            type: 'LOGIN',
            payload: { user: JSON.parse(user), token },
        });
        }
    }, []);

    // Guardar en localStorage cuando haya login
    const login = (user: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: { user, token } });
    };

    // Eliminar de localStorage cuando haya logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

// 6️⃣ Hook personalizado para usar el contexto
export function useAuth() {
    return useContext(AuthContext);
}
