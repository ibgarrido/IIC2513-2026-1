const express = require('express');
const router = express.Router();
const { Review, Artist, User } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');


// GET /reviews/artist/:id - Obtener reseñas de un artista específico (Público)
router.get('/artist/:id', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { artistId: req.params.id },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']], // Las más nuevas primero
      include: [{ model: User, as: 'author', attributes: ['username', 'image'] }]
    });

    res.status(200).json({
      data: rows,
      meta: { totalPages: Math.ceil(count / limit) || 1, currentPage: page, totalItems: count }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /reviews/my - Reseñas hechas por el usuario logueado
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { userId: req.userId },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Artist, as: 'artist', attributes: ['name', 'imageUrl'] }] // Para mostrar a qué artista reseñó
    });

    res.status(200).json({
      data: rows,
      meta: { totalPages: Math.ceil(count / limit) || 1, currentPage: page, totalItems: count }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;