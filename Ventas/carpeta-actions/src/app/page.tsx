// src/app/page.tsx
import React from 'react';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#DCD0FF', padding: '20px' }}>
      <h1>Bienvenido a Dashuri</h1>
      <p>¡Aquí puedes gestionar ventas y reservas!</p>
      <button
        style={{
          backgroundColor: '#DCD0FF',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Empezar
      </button>
    </div>
  );
};

export default HomePage;
