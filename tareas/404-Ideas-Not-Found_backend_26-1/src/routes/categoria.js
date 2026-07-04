const express = require('express');
const router = express.Router();
const { Categoria, Product, sequelize } = require('../models');
const requireAuth = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      attributes: [
        'id',
        'nombre',
        'descripcion',
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT p.id)
            FROM "Products" p
            INNER JOIN "Variantes" v ON v."productId" = p.id
            WHERE p."categoriaId" = "Categoria"."id"
              AND p."activo" = true
          )`),
          'totalProductos'
        ]
      ]
    });

    return res.status(200).json({ data: categorias });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El campo nombre es requerido' });
    const exists = await Categoria.findOne({ where: { nombre } });
    if (exists) return res.status(409).json({ error: 'Ya existe una categoria con este nombre' });

    const categoria = await Categoria.create({ nombre, descripcion });
    return res.status(201).json({ data: categoria, mensaje: "Categoria Creada con éxito." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/:categoriaId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = await Categoria.findByPk(req.params.categoriaId);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    const exists = await Categoria.findOne({ where: { nombre } });
    if (exists) return res.status(409).json({ error: 'Ya existe una categoria con este nombre' });

    await categoria.update({ nombre, descripcion });
    return res.status(200).json({ data: categoria, mensaje: "Categoria editada con éxito." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:categoriaId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.categoriaId);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    const activeProducts = await Product.count({
      where: { categoriaId: req.params.categoriaId, activo: true }
    });
    if (activeProducts > 0) {
      return res.status(409).json({
        error: `No se puede eliminar: la categoría tiene ${activeProducts} producto(s) activo(s)`
      });
    }

    await categoria.destroy();
    return res.status(200).json({ message: 'Categoría eliminada' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
