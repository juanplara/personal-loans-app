// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
        const res = await api.post('/auth/login', { email, password });

        // Guardar token en localStorage
        localStorage.setItem('token', res.data.token);

        // Redirigir a la página principal
        router.push('/');
        } catch (err: any) {
        setError(err.response?.data?.message || 'Error en el inicio de sesión');
        } finally {
        setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 8 }}
            />
            </div>
            <div style={{ marginBottom: 12 }}>
            <label>Contraseña</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8 }}
            />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
            type="submit"
            disabled={loading}
            style={{
                width: '100%',
                padding: 10,
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
            }}
            >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
        </form>
        </div>
    );
}
