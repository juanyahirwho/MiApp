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

// Registro del vigilante
vigilanteRouter.post('/register', async (req, res) => {
    try {
      const { nombre, clave, contrasena, acceso } = req.body;
  
      // Validaciones
      if (!nombre || !clave || !contrasena || !acceso) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
  
      // Verificar si la clave ya existe
      db.query('SELECT * FROM vigilantes WHERE clave = ?', [clave], async (err, results) => {
        if (err) {
          console.error('Error al verificar clave:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
  
        if (results.length > 0) {
          return res.status(400).json({ message: 'La clave ya está registrada' });
        }
  
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
  
        // Insertar nuevo vigilante
        db.query(
          'INSERT INTO vigilantes (nombre, foto, contraseña, acceso, clave) VALUES (?, NULL, ?, ?, ?)',
          [nombre, hashedPassword, acceso, clave],
          (err, result) => {
            if (err) {
              console.error('Error al registrar vigilante:', err);
              return res.status(500).json({ message: 'Error al registrar vigilante' });
            }
            res.status(201).json({ message: 'Vigilante registrado correctamente' });
          }
        );
      });
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

  
// Login del vigilante
vigilanteRouter.post('/login', (req, res) => {
  const { clave, contraseña } = req.body;

  db.query('SELECT * FROM vigilantes WHERE clave = ?', [clave], async (err, results) => {
    if (err) {
      console.error('Error al buscar vigilante:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const vigilante = results[0];
    const validPassword = await bcrypt.compare(contraseña, vigilante.contraseña);

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

    delete vigilante.contraseña;

    res.json({ 
      message: 'Inicio de sesión exitoso',
      token,
      vigilante
    });
  });
});

module.exports = vigilanteRouter;