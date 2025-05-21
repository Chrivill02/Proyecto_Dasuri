// GET - Obtener todos los servicios
export async function GET() {
    try {
        const [rows] = await pool.query("CALL ObtenerServicios()");
        return NextResponse.json(rows[0]); // ¡Ojo! CALL devuelve un array de arrays
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST - Crear un nuevo servicio
export async function POST(request) {
    try {
        const { nombre_servicio, precio } = await request.json();

        const [result] = await pool.query("CALL CrearServicio(?, ?)", [
            nombre_servicio,
            precio
        ]);

        // Asumimos que el procedimiento devuelve el nuevo ID como SELECT LAST_INSERT_ID();
        const insertId = result[0]?.[0]?.id || null;

        return NextResponse.json({
            id: insertId,
            nombre_servicio,
            precio
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT - Actualizar un servicio existente
export async function PUT(request) {
    try {
        const { id, nombre_servicio, precio } = await request.json();

        const [result] = await pool.query("CALL ActualizarServicio(?, ?, ?)", [
            id,
            nombre_servicio,
            precio
        ]);

        return NextResponse.json({
            id,
            nombre_servicio,
            precio
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Eliminar un servicio
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const [result] = await pool.query("CALL EliminarServicio(?)", [id]);

        return NextResponse.json({ message: "Servicio eliminado correctamente" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
