// app/test-api/page.tsx
'use client';
import React, { useState } from 'react';
import api from '../../lib/api';

export default function TestApiPage() {
    const [result, setResult] = useState<string | null>(null);

    async function testLogin() {
        try {
        // Ajusta con un usuario de prueba que exista en tu backend
        const res = await api.post('/auth/login', {
            email: 'prueba@correo.com',
            password: '123456'
        });
        console.log(res.data);
        setResult(JSON.stringify(res.data));
        } catch (err: any) {
        console.error(err);
        setResult('Error: ' + (err.response?.data?.message || err.message));
        }
    }

    return (
        <div style={{ padding: 20 }}>
        <h2>Prueba API</h2>
        <button onClick={testLogin}>Probar login (POST /auth/login)</button>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{result}</pre>
        </div>
    );
}
