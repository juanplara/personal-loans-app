'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode'; // npm install jwt-decode

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

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

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

const AuthContext = createContext<{
    state: AuthState;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}>({
    state: initialState,
    isLoading: true,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
        try {
            // 🔹 Validar expiración del token
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
            logout();
            } else {
            dispatch({
                type: 'LOGIN',
                payload: { user: JSON.parse(user), token },
            });
            }
        } catch {
            logout();
        }
        }
        setIsLoading(false);
    }, []);

    const login = (user: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        Cookies.set('token', token); // 🔹 usado por middleware
        dispatch({ type: 'LOGIN', payload: { user, token } });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ state, isLoading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
