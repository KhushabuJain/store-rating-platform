const { Op } = require('sequelize');
const { Store, Rating } = require('../models');

// Normal user: list stores with search by name/address, overall rating, and their own rating
exports.listStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSort = ['name', 'address'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[sortField, order]],
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'user_id'] }],
    });

    const result = stores.map((s) => {
      const plain = s.toJSON();
      const ratings = plain.ratings || [];
      const avgRating = ratings.length ? Number((ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2)) : null;
      const mine = ratings.find((r) => r.user_id === req.user.id);
      delete plain.ratings;
      return {
        ...plain,
        averageRating: avgRating,
        totalRatings: ratings.length,
        userRating: mine ? mine.rating : null,
      };
    });

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
};
