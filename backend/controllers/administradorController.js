const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const administradorRouter = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// 📌 REGISTRO DE ADMINISTRADOR
administradorRouter.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    // Validaciones
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
    }

    // Verificar si el correo ya existe
    const [results] = await db.promise().query('SELECT * FROM administradores WHERE correo = ?', [correo]);
    if (results.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo administrador
    await db.promise().query(
      'INSERT INTO administradores (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );

    res.status(201).json({ message: 'Administrador registrado correctamente' });
  } catch (error) {
    console.error('Error en el registro de administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 📌 LOGIN DE ADMINISTRADOR
administradorRouter.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    const [results] = await db.promise().query('SELECT * FROM administradores WHERE correo = ?', [correo]);
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const administrador = results[0];
    const validPassword = await bcrypt.compare(contrasena, administrador.contraseña);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: administrador.id,
        role: 'admin'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Eliminar contraseña antes de enviar la respuesta
    delete administrador.contraseña;

    res.json({ 
      message: 'Inicio de sesión exitoso',
      token,
      administrador
    });
  } catch (error) {
    console.error('Error en el login de administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = administradorRouter;