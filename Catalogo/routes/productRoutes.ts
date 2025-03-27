import { Router } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Conectar a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM producto");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
