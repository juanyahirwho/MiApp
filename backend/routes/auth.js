const express = require('express');
const estudianteRouter = require('../controllers/estudianteController');
const administradorRouter = require('../controllers/administradorController');
const vigilanteRouter = require('../controllers/vigilanteController');


const router = express.Router();

// Rutas para estudiantes
router.use('/estudiante', estudianteRouter);

//Rutas para administradores
router.use('/administrador', administradorRouter);

//Rutas para vigilantes
router.use('/vigilante', vigilanteRouter);

module.exports = router;