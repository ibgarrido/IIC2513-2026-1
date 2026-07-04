const express = require('express');
const router = express.Router();
const requireAuth = require('../../middlewares/authMiddleware');
const { requireAdmin } = require('../../middlewares/authMiddleware');

router.use(requireAuth, requireAdmin);

router.use('/products', require('./product'));
router.use('/variantes', require('./variante'));
router.use('/users', require('./user'));
router.use('/orders', require('./order'));

module.exports = router;
