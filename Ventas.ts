import express from "express";
import { Sequelize } from "sequelize";
import reservasRouter from "./routes/reservas";
import cors from "cors";

tconst app = express();
const PORT = 3000;

// Configurar Sequelize con MySQL
const sequelize = new Sequelize("dbname", "user", "password", {
  host: "localhost",
  dialect: "mysql",
});

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/reservas", reservasRouter);

// Iniciar servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a MySQL");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);
  }
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
