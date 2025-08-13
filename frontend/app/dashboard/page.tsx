"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!token) {
            router.push("/login");
        } else if (email) {
            setUser(email);
        } else {
            // Si por alguna razón hay token pero no email
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        router.push("/login");
    };

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            {user && <p>Usuario: {user}</p>}

            <button
                onClick={handleLogout}
                style={{
                    background: "red",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "10px"
                }}
            >
                Cerrar sesión
            </button>
        </div>
    );
}
