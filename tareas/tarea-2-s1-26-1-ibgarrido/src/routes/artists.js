const express = require('express');
const router = express.Router();
const { Artist, User } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware'); 

// GET /artists/ - Obtener artistas
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const forSale = req.query.forSale === 'true';

    const offset = (page - 1) * limit;

    const whereConditions = {};


    if (forSale) {
      whereConditions.ownerId = null;
    }

    // Buscamos los artistas y contamos el total al mismo tiempo
    const { count, rows } = await Artist.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
      order: [['id', 'ASC']] // Mantenemos el orden por ID para que la lista no salte
    });

    res.status(200).json({
      data: rows,
      meta: {
        totalPages: Math.ceil(count / limit) || 1,
        currentPage: page,
        totalItems: count
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /artists/my - Obtener los artistas contratados por el usuario
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Buscamos los artistas donde el dueño sea el usuario logueado
    const { count, rows } = await Artist.findAndCountAll({
      where: { ownerId: req.userId },
      limit: limit,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const formattedRows = rows.map(artist => {
      const artistData = artist.toJSON(); // Convertimos el objeto de Sequelize a un objeto normal
      
      if (Array.isArray(artistData.genres)) {
        // Convierte en, por ejemplo ["Pop", "Rock"] en el texto "Pop, Rock"
        artistData.genres = artistData.genres.join(', ');
      }
      
      return artistData;
    });

    res.status(200).json({
      data: formattedRows,
      meta: { totalPages: Math.ceil(count / limit) || 1, currentPage: page, totalItems: count }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /artists/:id - Obtener el detalle de un artista
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /artists/:id/buy - Comprar un artista
router.post('/:id/buy', authMiddleware, async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    const user = await User.findByPk(req.userId);

    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    if (artist.ownerId !== null) return res.status(400).json({ error: 'Este artista ya está contratado' });
    if (user.balance < artist.price) return res.status(400).json({ error: 'Saldo insuficiente' });

    user.balance -= artist.price;
    artist.ownerId = req.userId;

    await user.save();
    await artist.save();

    res.status(200).json({
      message: 'Artista contratado exitosamente', 
      newBalance: Number(user.balance),
      artist 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /artists/:id/sell - Vender un artista
router.post('/:id/sell', authMiddleware, async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    const user = await User.findByPk(req.userId);

    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    if (artist.ownerId !== req.userId) return res.status(401).json({ error: 'No puedes vender este artista' });

    user.balance += artist.price;
    artist.ownerId = null;

    await user.save();
    await artist.save();

    res.status(200).json({ 
      message: 'Artista vendido exitosamente', 
      newBalance: Number(user.balance),
      artist 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /artists/ - Crear un artista
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, hypeLevel, genres, imageUrl } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
    }

    // Guardamos los datos exactamente como vienen (genres vuelve a ser la lista original)
    const newArtist = await Artist.create({ 
      name, 
      price, 
      hypeLevel, 
      genres, 
      imageUrl, 
      ownerId: req.userId 
    });

    res.status(201).json({
      message: 'Artista creado exitosamente',
      artist: newArtist
    });

  } catch (error) { 
    //console.log("=== ERROR AL CREAR ARTISTA ==="); //Debugging
    //console.log(error);
    //console.log("==============================");

    if (error.name === 'SequelizeValidationError' && error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (!req.userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    res.status(500).json({ error: error.message });
  }
});


//  /:artistId - Editar un artista
router.put('/:artistId', authMiddleware, async (req, res) => {
  try {
    const { artistId } = req.params;
    const { name, price, hypeLevel, genres, imageUrl } = req.body;

    if (!req.userId) return res.status(401).json({ error: 'No autorizado' });

    const artist = await Artist.findByPk(artistId);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    if (artist.ownerId !== req.userId) return res.status(403).json({ error: 'No tienes permiso para editar este artista' });

    // Actualizamos solo los campos que vienen en el body
    if (name !== undefined) artist.name = name;
    if (price !== undefined) artist.price = price;
    if (hypeLevel !== undefined) artist.hypeLevel = hypeLevel;
    if (genres !== undefined) artist.genres = genres; // Guardamos la lista directamente
    if (imageUrl !== undefined) artist.imageUrl = imageUrl;

    await artist.save();

    res.status(201).json(artist);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' && error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message });
  }
});


// DELETE /:artistId - Eliminar un artista

router.delete('/:artistId', authMiddleware, async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!req.userId) return res.status(401).json({ error: 'No autorizado' });

    const artist = await Artist.findByPk(artistId);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    if (artist.ownerId !== req.userId) return res.status(403).json({ error: 'No tienes permiso para eliminar este artista' });

    const deletedArtist = artist.toJSON();

    await artist.destroy();

    res.status(201).json(deletedArtist);
  }
  catch (error) {
    if (error.name === 'SequelizeValidationError' && error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message });
  }
});


// favorito 

module.exports = router;