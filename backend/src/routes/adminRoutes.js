const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { adminCreateUserValidation, storeValidation } = require('../middleware/validators');

router.use(verifyToken, requireRole('admin'));

router.get('/dashboard', adminController.dashboard);
router.post('/users', adminCreateUserValidation, adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/stores', storeValidation, adminController.createStore);
router.get('/stores', adminController.listStores);

module.exports = router;
