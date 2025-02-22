const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, apellidos, fecha_nacimiento, unidad_academica, licenciatura, matricula, password } = req.body;

  if (!nombre || !apellidos || !matricula || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO estudiantes (nombre, apellidos, fecha_nacimiento, unidad_academica, licenciatura, matricula, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellidos, fecha_nacimiento, unidad_academica, licenciatura, matricula, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }
      res.json({ message: 'Usuario registrado correctamente' });
    }
  );
});

// Iniciar sesión
router.post('/login', (req, res) => {
  const { matricula, password } = req.body;

  db.query('SELECT * FROM estudiantes WHERE matricula = ?', [matricula], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, matricula: user.matricula }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token });
  });
});

module.exports = router;
