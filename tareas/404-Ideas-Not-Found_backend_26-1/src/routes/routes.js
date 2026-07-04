// src/routes/routes.js
const express = require('express');
const authRouter = require('./auth');
const catalogRouter = require('./catalog');
const categoriaRouter = require('./categoria');
const cartRouter = require('./cart');
const userRouter = require('./user');
const orderRouter = require('./order');
const adminRouter = require('./admin');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/catalog', catalogRouter);
router.use('/categoria', categoriaRouter);
router.use('/cart', cartRouter);
router.use('/user', userRouter);
router.use('/order', orderRouter);
router.use('/admin', adminRouter);
// router.use('/artists', artistRouter);
// router.use('/reviews', reviewsRouter);
// ...
// más routers si hubiesen
// ...


// exportar para usarlo en la app principal
module.exports = router;