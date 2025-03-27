import { Sequelize, DataTypes } from "sequelize";

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

// Exportar el modelo y la conexión Sequelize
export { Reserva, sequelize };
