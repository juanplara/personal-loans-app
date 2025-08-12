'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { state, login, logout } = useAuth();

  const handleLogin = () => {
    // Simulación de login
    login({ 
      email: 'usuario@prueba.com', 
      nombre: 'Usuario de Prueba' 
    }, 'TOKEN_DE_PRUEBA_123');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Prueba de AuthContext</h1>

      {state.user ? (
        <>
          <p>Usuario logueado: <b>{state.user.nombre}</b></p>
          <p>Email: {state.user.email}</p>
          <p>Token: {state.token}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <p>No hay usuario logueado</p>
          <button onClick={handleLogin}>Iniciar sesión de prueba</button>
        </>
      )}
    </div>
  );
}
