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

// 📌 REGISTRO DE ESTUDIANTE
router.post('/register', async (req, res) => {
  const { nombre, correo_personal, correo_institucional, contrasena, facultad, matricula, telefono, foto_perfil } = req.body;

  if (!nombre || !correo_personal || !correo_institucional || !contrasena || !facultad || !matricula) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben estar llenos' });
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  db.query(
    'INSERT INTO estudiantes (nombre, correo_personal, correo_institucional, contraseña, facultad, matricula, telefono, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, correo_personal, correo_institucional, hashedPassword, facultad, matricula, telefono || null, foto_perfil || null],
    (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }
      res.json({ message: 'Usuario registrado correctamente' });
    }
  );
});


// 📌 LOGIN DE ESTUDIANTE
router.post('/login', (req, res) => {
  const { matricula, contraseña } = req.body;

  db.query('SELECT * FROM estudiantes WHERE matricula = ?', [matricula], async (err, results) => {
    if (err) {
      console.error('Error al buscar estudiante:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const estudiante = results[0];
    const validPassword = await bcrypt.compare(contraseña, estudiante.contraseña);

    if (!validPassword) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: estudiante.id_estudiante, matricula: estudiante.matricula, nombre: estudiante.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token, estudiante });
  });
});

module.exports = router;
