"use client";

import React, { useState, useEffect } from 'react';

function botonMostrarCompras() {

  const [activo, setActivo] = useState(false);

  return (
    <div
      onClick={() => setActivo(!activo)}
      style={{
        width: '150px',
        height: '50px',
        top: '10',
        borderRadius: '30px',
        backgroundColor: activo ? '#A74BE3' : '#9365A9', //a057cf
        position: 'absolute',
        top: '540px',   // posición vertical
        left: '1250px',   // posición horizontal
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '6px',
        boxSizing: 'border-box',
        border: '6px solid #000000' // <-- Aquí agregas el borde
      }}
    >
      {/* Círculo deslizante */}
      <div
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#6600A1',
          borderRadius: '50%',
          position: 'absolute',
          left: activo ? '103px' : '4px',
          top: '4px',
          transition: 'left 0.3s ease',
          border: '4px', // <-- Aquí agregas el borde
        }}
      />

      {/* Texto dinámico */}
      <span
        style={{
          position: 'absolute',
          left: activo ? '10px' : '42px',
          color: '#000000',
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
