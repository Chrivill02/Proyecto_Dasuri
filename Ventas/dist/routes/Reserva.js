"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Reserva = void 0;
const sequelize_1 = require("sequelize");
// Configurar Sequelize con MySQL
const sequelize = new sequelize_1.Sequelize("dbname", "user", "password", {
    host: "localhost",
    dialect: "mysql",
});
exports.sequelize = sequelize;
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
exports.Reserva = Reserva;
