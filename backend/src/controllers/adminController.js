const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

// Dashboard totals
exports.dashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

// Admin creates a new user (any role, including admin/store_owner)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

// List normal + admin + store_owner users with filters & sort, includes rating for store owners
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const allowedSort = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      order: [[sortField, order]],
      include: [{ model: Store, as: 'ownedStore', attributes: ['id'], include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }] }],
    });

    const result = users.map((u) => {
      const plain = u.toJSON();
      let avgRating = null;
      if (plain.ownedStore && plain.ownedStore.ratings && plain.ownedStore.ratings.length > 0) {
        const sum = plain.ownedStore.ratings.reduce((acc, r) => acc + r.rating, 0);
        avgRating = Number((sum / plain.ownedStore.ratings.length).toFixed(2));
      }
      delete plain.ownedStore;
      return { ...plain, rating: plain.role === 'store_owner' ? avgRating : undefined };
    });

    res.json({ users: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
};

// Single user detail (includes rating if store owner)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Store, as: 'ownedStore', include: [{ model: Rating, as: 'ratings' }] }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const plain = user.toJSON();
    let avgRating = null;
    if (plain.ownedStore && plain.ownedStore.ratings && plain.ownedStore.ratings.length > 0) {
      const sum = plain.ownedStore.ratings.reduce((acc, r) => acc + r.rating, 0);
      avgRating = Number((sum / plain.ownedStore.ratings.length).toFixed(2));
    }

    res.json({
      user: {
        id: plain.id,
        name: plain.name,
        email: plain.email,
        address: plain.address,
        role: plain.role,
        rating: plain.role === 'store_owner' ? avgRating : undefined,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// List stores with average rating, filters & sort
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const allowedSort = ['name', 'email', 'address', 'created_at'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[sortField, order]],
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
    });

    const result = stores.map((s) => {
      const plain = s.toJSON();
      const ratings = plain.ratings || [];
      const avgRating = ratings.length ? Number((ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2)) : null;
      delete plain.ratings;
      return { ...plain, averageRating: avgRating, totalRatings: ratings.length };
    });

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
};

// Admin creates a store, optionally assigning an existing store_owner user
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'owner_id must reference an existing store_owner user' });
      }
      const alreadyOwns = await Store.findOne({ where: { owner_id } });
      if (alreadyOwns) {
        return res.status(409).json({ message: 'This store owner already has a store assigned' });
      }
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'A store with this email already exists' });

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });
    res.status(201).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
};
