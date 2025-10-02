// app/api/Ventas/route.js
import { NextResponse } from 'next/server';
import { pool } from '@/libs/mysql';

export async function GET() {
  try {
    // Usar pool.query() de mysql2/promise

    // Antes de la otimización:
    // const results = await pool.query("SELECT * FROM venta");

    // Después de la otimización *******************************************************************************************:
    const [results] = await pool.query("SELECT v.id, u.nombre AS usuario_nombre, " +
      "v.total, v.descripcion FROM venta v JOIN usuario u ON v.usuario_id = u.id ORDER BY v.id DESC");
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(request) {
  let connection;
  
  try {
    const { usuario_id, total, descripcion, producto_id, cantidad } = await request.json();

    // Validaciones
    if (!usuario_id || !producto_id || !cantidad || cantidad <= 0) {
      return NextResponse.json(
        { error: 'Datos inválidos. Todos los campos son requeridos.' },
        { status: 400 }
      );
    }

    // Iniciar transacción
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Verificar stock disponible
    const [producto] = await connection.query(


      // Antes de la optimización:      
      // 'SELECT stock, precio FROM producto WHERE id = ?',
      // [producto_id]


      // Después de la optimización *******************************************************************************************:
      'CREATE INDEX idx_producto_id ON producto(id);' + 
      'SELECT stock, precio FROM producto WHERE id = ? FOR UPDATE',
      [producto_id]
    );

    if (producto.length === 0) {
      await connection.rollback();
      connection.release();
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (producto[0].stock < cantidad) {
      await connection.rollback();
      connection.release();
      return NextResponse.json(
        { error: `Stock insuficiente. Solo quedan ${producto[0].stock} unidades.` },
        { status: 400 }
      );
    }

    // 2. Crear la venta
    const [ventaResult] = await connection.query(


      // Antes de la optimización:
      // 'INSERT INTO venta (usuario_id, total, descripcion) VALUES (?, ?, ?)',
      // [usuario_id, total, descripcion]

      // Después de la optimización *******************************************************************************************:
      'CREATE INDEX idx_venta_usuario_id ON venta(usuario_id);' +
      'INSERT INTO venta (usuario_id, total, descripcion) VALUES (?, ?, ?)',
      [usuario_id, total, descripcion]
    );

    const ventaId = ventaResult.insertId;

    // 3. Crear detalle de la reserva con estado 'pendiente' (CORREGIDO)
    const precioUnitario = producto[0].precio;



    // Antes de la optimización:    
    // await connection.query(
    //   'INSERT INTO detalles_reserva_producto (venta_id, producto_id, cantidad, precio, estado) VALUES (?, ?, ?, ?, "pendiente")',
    //   [ventaId, producto_id, cantidad, precioUnitario]
    // );

    // Después de la optimización *******************************************************************************************:
    await connection.query(
      'CREATE INDEX idx_detalle_venta ON detalles_reserva_producto(venta_id);' +
      'CREATE INDEX idx_detalle_producto ON detalles_reserva_producto(producto_id);' +
      'INSERT INTO detalles_reserva_producto (venta_id, producto_id, cantidad, precio, estado) VALUES (?, ?, ?, ?, "pendiente")',
      [ventaId, producto_id, cantidad, precioUnitario]
    );

    // 4. Reservar stock (restarlo temporalmente)
    await connection.query(
      'CREATE INDEX idx_producto_id ON stock(id);' + 
      'UPDATE producto SET stock = stock - ? WHERE id = ?',
      [cantidad, producto_id]
    );

    // Confirmar transacción
    await connection.commit();
    connection.release();

    return NextResponse.json({
      message: 'Reserva realizada con éxito. Debes confirmarla.',
      ventaId: ventaId,
      estado: 'pendiente',
      detalles: {
        producto_id: producto_id,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        total: total
      }
    });

  } catch (error) {
    // Rollback en caso de error
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    
    console.error('Error en transacción:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la reserva',
        details: error.message 
      },
      { status: 500 }
    );
  }
}