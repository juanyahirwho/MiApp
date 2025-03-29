const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const estudianteRouter = express.Router();

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// 📌 REGISTRO DE ESTUDIANTE
estudianteRouter.post('/register', async (req, res) => {
  try {
    const { nombre, correo_personal, correo_institucional, contrasena, facultad, matricula, telefono, foto_perfil } = req.body;

    // Validaciones
    if (!nombre || !correo_personal || !correo_institucional || !contrasena || !facultad || !matricula) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar llenos' });
    }

    // Validar formato de correos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_personal) || !emailRegex.test(correo_institucional)) {
      return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
    }

    // Verificar si la matrícula ya existe
    const [matriculaExists] = await db.promise().query('SELECT * FROM estudiantes WHERE matricula = ?', [matricula]);
    if (matriculaExists.length > 0) {
      return res.status(400).json({ message: 'La matrícula ya está registrada' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo estudiante
    await db.promise().query(
      'INSERT INTO estudiantes (nombre, correo_personal, correo_institucional, contraseña, facultad, matricula, telefono, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, correo_personal, correo_institucional, hashedPassword, facultad, matricula, telefono || null, foto_perfil || null]
    );

    res.status(201).json({ message: 'Estudiante registrado correctamente' });
  } catch (error) {
    console.error('Error en el registro de estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 📌 LOGIN DE ESTUDIANTE
estudianteRouter.post('/login', async (req, res) => {
  try {
    const { matricula, contrasena } = req.body;

    if (!matricula || !contrasena) {
      return res.status(400).json({ message: 'Matrícula y contraseña son requeridas' });
    }

    const [results] = await db.promise().query('SELECT * FROM estudiantes WHERE matricula = ?', [matricula]);
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const estudiante = results[0];
    const validPassword = await bcrypt.compare(contrasena, estudiante.contraseña);

    if (!validPassword) {
      return res.status(401).json({ message: 'Matrícula o contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id: estudiante.id_estudiante, 
        matricula: estudiante.matricula, 
        nombre: estudiante.nombre,
        role: 'estudiante'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Eliminar contraseña antes de enviar la respuesta
    delete estudiante.contraseña;

    res.json({ 
      message: 'Login exitoso', 
      token, 
      estudiante 
    });
  } catch (error) {
    console.error('Error en el login de estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = estudianteRouter;