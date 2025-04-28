// src/app/api/auth/route.js
import { pool } from '@/libs/mysql';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { correo, contraseña } = await req.json();

  if (!correo || !contraseña) {
    return NextResponse.json({ success: false, message: 'Correo y contraseña requeridos' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nombre, correo, contraseña, nivel FROM usuario WHERE correo = ? LIMIT 1',
      [correo]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 401 });
    }

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordValida) {
      return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Aquí podrías usar cookies, tokens, etc.
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        nivel: usuario.nivel,  // Incluye el nivel aquí
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
