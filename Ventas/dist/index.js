"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const reservas_1 = require("./routes/reservas"); // Asegúrate de que esta importación esté correcta
const app = (0, express_1.default)();
const port = 3000; // O el puerto que prefieras
// Servir archivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Usar las rutas de la API
app.use('/api/reservas', reservas_1.reservasRouter);
// Servir la página HTML en la raíz
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "index.html"));
});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
