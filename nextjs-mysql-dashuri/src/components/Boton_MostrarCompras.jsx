"use client";

import React, { useState } from 'react';

function botonMostrarCompras() {
  const [activo, setActivo] = useState(false);

  return (
    <div
      onClick={() => setActivo(!activo)}
      style={{
        width: '120px',
        height: '34px',
        top: '10',
        borderRadius: '30px',
        backgroundColor: activo ? '#4caf50' : '#f70e0e',
        position: 'absolute',
        top: '340px',   // posición vertical
        left: '1250px',   // posición horizontal
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        boxSizing: 'border-box',
        border: '2px solid black' // <-- Aquí agregas el borde
      }}
    >
      {/* Círculo deslizante */}
      <div
        style={{
          width: '26px',
          height: '26px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          left: activo ? '90px' : '4px',
          top: '4px',
          transition: 'left 0.3s ease',
        }}
      />

      {/* Texto dinámico */}
      <span
        style={{
          position: 'absolute',
          left: activo ? '10px' : '42px',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '12px',
          transition: 'left 0.3s ease',
        }}
      >
        {activo ? 'Compras ON' : 'Compras OFF'}
      </span>
    </div>
  );
}

export default botonMostrarCompras;
