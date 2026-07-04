const express = require('express');
const router = express.Router();
const { User, Order } = require('../../models');
const { sequelize } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'nombre',
        'email',
        'rol',
        'createdAt',
        [
          sequelize.literal(`(SELECT COUNT(*) FROM "Orders" WHERE "Orders"."userId" = "User"."id")`),
          'totalOrders'
        ]
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
