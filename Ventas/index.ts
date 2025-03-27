import express from 'express';
import path from 'path';

const app = express();

// Sirve archivos estáticos desde la carpeta 'Ventas' (o donde esté tu HTML)
app.use(express.static(path.join(__dirname, 'Ventas')));

// Servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Ventas', 'index.html'));
});
