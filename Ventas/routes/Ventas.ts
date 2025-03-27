import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import { reservasRouter } from "../routes/reservas";
import cors from "cors";

const app = express();
const PORT = 3000;

// Configurar Sequelize con MySQL
const sequelize = new Sequelize("dbname", "user", "password", {
  host: "localhost",
  dialect: "mysql",
});

// Definir el modelo de Reservas
const Reserva = sequelize.define("Reserva", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "reservas",
  timestamps: false,
});

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/reservas", reservasRouter);

// Iniciar servidor y sincronizar base de datos
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sincronizar el modelo con la BD
    console.log("Conectado a MySQL y base de datos sincronizada");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);
  }
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
