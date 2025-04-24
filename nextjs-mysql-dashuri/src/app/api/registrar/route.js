// src/app/api/registrar/route.js
import { pool } from '@/libs/mysql'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { nombre, email, telefono, contraseña, nivel } = await req.json()

  if (!nombre || !email || !contraseña) {
    return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 })
  }

  try {
    const hashedContraseña = await bcrypt.hash(contraseña, 10)

    // Asegúrate de que el nivel sea un valor válido (0 o 1)
    const userNivel = nivel === 1 ? 1 : 0

    const [resultado] = await pool.query(
      'INSERT INTO usuario (nombre, correo, telefono, contraseña, nivel) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono || null, hashedContraseña, userNivel]
    )

    return NextResponse.json({ message: 'Usuario registrado con éxito', id: resultado.insertId })
  } catch (error) {
    console.error(error)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 409 })
    }
    return NextResponse.json({ message: 'Error al registrar usuario' }, { status: 500 })
  }
}
