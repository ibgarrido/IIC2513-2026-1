const express = require('express');
const router = express.Router();

// Importamos el controlador de artistas
const authRouter = require('./auth');
const artistsRouter = require('./artists');
const usersRouter = require('./users');
const reviewsRouter = require('./reviews');


// Asignamos la ruta base
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/artists', artistsRouter);
router.use('/reviews', reviewsRouter);


module.exports = router;