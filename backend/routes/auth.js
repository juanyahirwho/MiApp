const express = require('express');
const estudianteRouter = require('../controllers/estudianteController');

const router = express.Router();

// Rutas para estudiantes
router.use('/estudiante', estudianteRouter);

module.exports = router;