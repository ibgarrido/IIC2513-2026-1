// src/routes/catalog.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
// Importar el modelo Movie creado con sequelize
const { Product, Variante, Categoria, sequelize } = require('../models');


router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const categoriaId = req.query.categoriaId || null;
    const precioMin = req.query.precioMin !== undefined ? parseInt(req.query.precioMin) : null;
    const precioMax = req.query.precioMax !== undefined ? parseInt(req.query.precioMax) : null;
    const hayPrecio = precioMin !== null && precioMax !== null;

    const where = {
      nombre: { [Op.iLike]: `%${search}%` },
      ...(categoriaId && { categoriaId }),
      activo: true
    };

    const { count, rows } = await Product.findAndCountAll({
      attributes: { exclude: ['categoriaId', 'createdAt', 'updatedAt'] },
      where,
      include: [
        {
          model: Variante,
          as: 'variantes',
          attributes: { exclude: ['stock', 'productId', 'updatedAt', 'createdAt'] },
          ...(hayPrecio && {
            required: true,
            where: sequelize.where(
              sequelize.literal('"Product"."precioBase" + "variantes"."extraPrice"'),
              { [Op.between]: [precioMin, precioMax] }
            )
          })
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }
      ],
      limit,
      offset,
      distinct: true
    });

    const totalPages = Math.ceil(count / limit);

    if (count > 0 && page > totalPages) {
      return res.status(400).json({
        error: `Página inválida. Solo existen ${totalPages} página(s) para esta búsqueda.`
      });
    }

    return res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    const productsFound = await Product.findByPk(productId, {
      attributes: { exclude: ['categoriaId', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Variante,
          as: 'variantes',
          attributes: { exclude: ['stock', 'productId', 'updatedAt', 'createdAt'] }
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: { exclude: ['id', 'updatedAt', 'createdAt'] }
        }
      ]
    });

    if (!productsFound) {
      return res.status(404).json({ error: 'No se ha encontrado el producto.' });
    }

    return res.status(200).json({ data: productsFound });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;