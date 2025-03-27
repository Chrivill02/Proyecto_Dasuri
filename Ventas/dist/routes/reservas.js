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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservasRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.reservasRouter = router;
// Definir las rutas para reservas
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simulación de obtener reservas (reemplaza con consulta a la base de datos)
        const reservas = [
            { id: 1, producto: 'Base de Maquillaje', fecha: '2025-03-27' },
            { id: 2, producto: 'Pintalabios', fecha: '2025-03-28' }
        ];
        res.json(reservas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
}));
