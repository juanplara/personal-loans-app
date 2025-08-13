'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔹 Llamada a tu API de login
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();

            // ✅ Guardar token y usuario usando tu contexto
            login(data.user, data.token); 

            // ✅ Guardar el email manualmente para usarlo en el Dashboard
            // Esto asegura que el Dashboard pueda leerlo aunque el AuthContext no lo haga
            localStorage.setItem("email", email);

            // Redirigir al Dashboard
            router.push('/dashboard');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
