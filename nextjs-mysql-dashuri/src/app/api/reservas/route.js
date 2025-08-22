// app/api/reservas/route.js
import { NextResponse } from 'next/server';
import { pool } from '@/libs/mysql';

// GET - Obtener solo reservas PENDIENTES del usuario
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuario_id');

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(`
      SELECT 
        v.id as venta_id,
        v.total,
        v.descripcion,
    
        drp.id as detalle_id,
        drp.producto_id,
        drp.cantidad,
        drp.precio as precio_unitario,
        drp.estado,
        p.nombre as producto_nombre,
        p.imagen_url
      FROM venta v
      INNER JOIN detalles_reserva_producto drp ON v.id = drp.venta_id
      INNER JOIN producto p ON drp.producto_id = p.id
      WHERE v.usuario_id = ? AND drp.estado = 'pendiente'
      
    `, [usuarioId]);

    return NextResponse.json(rows || []);

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Confirmar o cancelar reserva
export async function POST(request) {
  let connection;
  
  try {
    const { venta_id, accion } = await request.json();

    if (!venta_id || !accion) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere venta_id y accion.' },
        { status: 400 }
      );
    }

    if (!['confirmar', 'cancelar'].includes(accion)) {
      return NextResponse.json(
        { error: 'Acción no válida. Use "confirmar" o "cancelar".' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    if (accion === 'confirmar') {
      // Confirmar la reserva (solo cambia el estado)
      const [result] = await connection.query(
        `UPDATE detalles_reserva_producto 
         SET estado = 'confirmada' 
         WHERE venta_id = ? AND estado = 'pendiente'`,
        [venta_id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return NextResponse.json(
          { error: 'No se encontraron reservas pendientes para confirmar' },
          { status: 404 }
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({
        message: 'Reserva confirmada con éxito',
        estado: 'confirmada'
      });

    } else if (accion === 'cancelar') {
      // Cancelar la reserva y devolver stock
      const [detalles] = await connection.query(
        `SELECT drp.producto_id, drp.cantidad 
         FROM detalles_reserva_producto drp 
         WHERE drp.venta_id = ? AND drp.estado = 'pendiente'`,
        [venta_id]
      );

      if (detalles.length === 0) {
        await connection.rollback();
        connection.release();
        return NextResponse.json(
          { error: 'No se encontraron reservas pendientes para cancelar' },
          { status: 404 }
        );
      }

      // Devolver stock a los productos
      for (const detalle of detalles) {
        await connection.query(
          'UPDATE producto SET stock = stock + ? WHERE id = ?',
          [detalle.cantidad, detalle.producto_id]
        );
      }

      // Cambiar estado a cancelada
      await connection.query(
        `UPDATE detalles_reserva_producto 
         SET estado = 'cancelada' 
         WHERE venta_id = ? AND estado = 'pendiente'`,
        [venta_id]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({
        message: 'Reserva cancelada con éxito. Stock devuelto.',
        stock_devuelto: detalles.length,
        estado: 'cancelada'
      });
    }

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    
    console.error('Error al procesar reserva:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la reserva',
        details: error.message 
      },
      { status: 500 }
    );
  }
}