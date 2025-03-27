"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const reservas_1 = require("../routes/reservas");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
// Configurar Sequelize con MySQL
const sequelize = new sequelize_1.Sequelize("dbname", "user", "password", {
    host: "localhost",
    dialect: "mysql",
});
// Definir el modelo de Reservas
const Reserva = sequelize.define("Reserva", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_cliente: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    producto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fecha_reserva: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: "reservas",
    timestamps: false,
});
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Rutas
app.use("/api/reservas", reservas_1.reservasRouter);
// Iniciar servidor y sincronizar base de datos
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        yield sequelize.sync(); // Sincronizar el modelo con la BD
        console.log("Conectado a MySQL y base de datos sincronizada");
    }
    catch (error) {
        console.error("Error al conectar con MySQL:", error);
    }
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}));
