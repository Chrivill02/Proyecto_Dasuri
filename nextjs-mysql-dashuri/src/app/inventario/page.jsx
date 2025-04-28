'use client';
import { useEffect, useState } from 'react';
import ButtonBusqueda from './buttonBus';

export default function ViewInventario() {
    const [esAdmin, setEsAdmin] = useState(false);

    // Verificar el nivel del usuario en localStorage
    useEffect(() => {
        const usuarioNivel = localStorage.getItem('usuarioNivel');
        if (usuarioNivel && parseInt(usuarioNivel) === 1) {
            setEsAdmin(true);
        } else {
            setEsAdmin(false);
        }
    }, []);

    if (!esAdmin) {
        return <p>No tienes acceso a esta página.</p>;
    }

    return (
        <div>
            <ButtonBusqueda />
        </div>
    );
}
