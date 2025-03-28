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

// Registro del administrador
administradorRouter.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    // Validaciones
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar formato de correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
    }

    // Verificar si el correo ya existe
    db.query('SELECT * FROM administradores WHERE correo = ?', [correo], async (err, results) => {
      if (err) {
        console.error('Error al verificar correo:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      // Insertar nuevo administrador
      db.query(
        'INSERT INTO administradores (nombre, correo, contraseña) VALUES (?, ?, ?)',
        [nombre, correo, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error al registrar administrador:', err);
            return res.status(500).json({ message: 'Error al registrar administrador' });
          }
          res.status(201).json({ message: 'Administrador registrado correctamente' });
        }
      );
    });
  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login del administrador
administradorRouter.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  db.query('SELECT * FROM administradores WHERE correo = ?', [correo], async (err, results) => {
    if (err) {
      console.error('Error al buscar administrador:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const administrador = results[0];
    const validPassword = await bcrypt.compare(contraseña, administrador.contraseña);

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

    
    delete administrador.contraseña; // Eliminamos la contraseña del objeto antes de enviarlo

    res.json({ 
      message: 'Inicio de sesión exitoso',
      token,
      administrador // Enviamos el objeto sin la contraseña
    });
  });
});
module.exports = administradorRouter;