"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
    const router = useRouter();
    const { state, logout, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !state.isAuthenticated) {
        router.push("/login");
        }
    }, [isLoading, state.isAuthenticated, router]);

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
        <h1>Bienvenido al Dashboard</h1>
        {state.user && <p>Usuario: {state.user.email}</p>}

        <button
            onClick={logout}
            style={{
            background: "red",
            color: "white",
            padding: "8px 12px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            }}
        >
            Cerrar sesión
        </button>
        </div>
    );
}
