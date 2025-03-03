require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    return;
  }
  console.log('📌 Conectado a MySQL - Base de Datos control_vehiculos');
});

// Rutas de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
