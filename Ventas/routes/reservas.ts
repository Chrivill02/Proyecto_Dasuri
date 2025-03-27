import { Router } from 'express';

const router = Router();

// Definir las rutas para reservas
router.get('/', async (req, res) => {
  try {
    // Simulación de obtener reservas (reemplaza con consulta a la base de datos)
    const reservas = [
      { id: 1, producto: 'Base de Maquillaje', fecha: '2025-03-27' },
      { id: 2, producto: 'Pintalabios', fecha: '2025-03-28' }
    ];
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

export { router as reservasRouter };  // Asegúrate de exportarlo correctamente
