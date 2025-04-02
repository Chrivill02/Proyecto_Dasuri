"use client";
import { useEffect, useState } from "react";

export default function Ventas() {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        fetch("/api/ventas")
            .then((res) => res.json())
            .then((data) => setVentas(data))
            .catch((err) => console.error("Error al obtener ventas:", err));
    }, []);

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold my-4">Ventas</h1>
            <ul className="text-gray-300">
                {ventas.length > 0 ? (
                    ventas.map((venta) => (
                        <li key={venta.id} className="border-b py-2">
                            {JSON.stringify(venta)}
                        </li>
                    ))
                ) : (
                    <p>No hay ventas registradas</p>
                )}
            </ul>
        </div>
    );
}
