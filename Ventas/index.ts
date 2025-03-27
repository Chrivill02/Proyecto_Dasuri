import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// 🔹 Servir archivos estáticos desde "dist"
app.use(express.static(path.join(__dirname, 'dist'))); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
