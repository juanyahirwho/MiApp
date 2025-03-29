const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const vigilanteRouter = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// 📌 REGISTRO DE VIGILANTE
vigilanteRouter.post('/register', async (req, res) => {
  try {
    const { nombre, clave, contrasena, acceso } = req.body;

    // Validaciones
    if (!nombre || !clave || !contrasena || !acceso) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si la clave ya existe
    const [results] = await db.promise().query('SELECT * FROM vigilantes WHERE clave = ?', [clave]);
    if (results.length > 0) {
      return res.status(400).json({ message: 'La clave ya está registrada' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo vigilante
    await db.promise().query(
      'INSERT INTO vigilantes (nombre, foto, contraseña, acceso, clave) VALUES (?, NULL, ?, ?, ?)',
      [nombre, hashedPassword, acceso, clave]
    );

    res.status(201).json({ message: 'Vigilante registrado correctamente' });
  } catch (error) {
    console.error('Error en el registro de vigilante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 📌 LOGIN DE VIGILANTE
vigilanteRouter.post('/login', async (req, res) => {
  try {
    const { clave, contrasena } = req.body;

    if (!clave || !contrasena) {
      return res.status(400).json({ message: 'Clave y contraseña son requeridas' });
    }

    const [results] = await db.promise().query('SELECT * FROM vigilantes WHERE clave = ?', [clave]);
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const vigilante = results[0];
    const validPassword = await bcrypt.compare(contrasena, vigilante.contraseña);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: vigilante.id_vigilante,
        role: 'vigilante',
        acceso: vigilante.acceso
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Eliminar contraseña antes de enviar la respuesta
    delete vigilante.contraseña;

    res.json({ 
      message: 'Inicio de sesión exitoso',
      token,
      vigilante
    });
  } catch (error) {
    console.error('Error en el login de vigilante:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = vigilanteRouter;