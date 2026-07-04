const express = require('express');
const router = express.Router();
const { Product, Variante, Categoria, sequelize } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        },
        {
          model: Variante,
          as: 'variantes',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    });
    return res.status(200).json({ data: products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precioBase, image_url, categoriaId, variantes } = req.body;

    if (!nombre || precioBase === undefined || !categoriaId) {
      return res.status(400).json({ error: 'nombre, precioBase y categoriaId son requeridos' });
    }
    if (!Array.isArray(variantes) || variantes.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos una variante' });
    }

    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    const exists = await Product.findOne({ where: { nombre } });
    if (exists) return res.status(409).json({ error: 'Ya existe un producto con este nombre, en su lugar, crea variantes a este producto.' });

    const result = await sequelize.transaction(async (t) => {
      const product = await Product.create(
        { nombre, descripcion, precioBase, image_url, categoriaId },
        { transaction: t }
      );

      const createdVariantes = await Promise.all(
        variantes.map((v) =>
          Variante.create(
            {
              productId: product.id,
              talla: v.talla,
              color: v.color,
              stock: v.stock ?? 0,
              extraPrice: v.extraPrice ?? 0
            },
            { transaction: t }
          )
        )
      );

      return { product, variantes: createdVariantes };
    });

    return res.status(201).json({ data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/:productId', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const { nombre, descripcion, precioBase, image_url, activo, categoriaId } = req.body;

    if (categoriaId) {
      const categoria = await Categoria.findByPk(categoriaId);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    const exists = await Product.findOne({ where: { nombre } });
    if (exists && exists.id != req.params.productId) return res.status(409).json({ error: 'Ya existe un producto con este nombre.' });
    await product.update({ nombre, descripcion, precioBase, image_url, activo, categoriaId });

    const updated = await Product.findByPk(product.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: { exclude: ['createdAt', 'updatedAt'] } }
      ]
    });

    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    // TODO: aun no me decido si el delete deberia de desactivarlo o simplemente eliminarlo junto a sus variantes.
    // Si ya hicimos una orden, creamos una snapshot de la variante así que no pasa nada de ese lado
    // Pero si un usuario lo tiene en el carrito y desactivamos el producto este sigue en el carrito.
    // pensar....
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await product.update({ activo: false });
    return res.status(200).json({ message: 'Producto desactivado' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:productId/variantes', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const variantes = await Variante.findAll({
      where: { productId: req.params.productId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    return res.status(200).json({ data: variantes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/:productId/variantes', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const { talla, color, stock, extraPrice } = req.body;

    const existing = await Variante.findOne({
      where: { productId: req.params.productId, talla, color },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (existing) {
      return res.status(409).json({
        error: 'Ya existe una variante con esta talla y color para este producto',
        existing
      });
    }

    const variante = await Variante.create({
      productId: req.params.productId,
      talla,
      color,
      stock: stock ?? 0,
      extraPrice: extraPrice ?? 0
    });

    return res.status(201).json({ data: variante });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
