const { Rating, Store, User } = require('../models');

// Normal user submits or updates their rating for a store (upsert)
exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [record, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id: storeId },
      defaults: { rating },
    });

    if (!created) {
      record.rating = rating;
      await record.save();
    }

    res.status(created ? 201 : 200).json({ rating: record, message: created ? 'Rating submitted' : 'Rating updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};

// Store owner: list of users who rated their store + average rating
exports.storeOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'No store is assigned to this account yet' });
    }

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['created_at', 'DESC']],
    });

    const avgRating = ratings.length
      ? Number((ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2))
      : null;

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avgRating,
      totalRatings: ratings.length,
      raters: ratings.map((r) => ({
        ratingId: r.id,
        rating: r.rating,
        submittedAt: r.created_at,
        user: r.user,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load store owner dashboard', error: err.message });
  }
};
