const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const ratingController = require('../controllers/ratingController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validators');

// Normal user store browsing
router.get('/', verifyToken, requireRole('user'), storeController.listStoresForUser);

// Submit / update rating
router.post('/:storeId/ratings', verifyToken, requireRole('user'), ratingValidation, ratingController.submitRating);

// Store owner dashboard
router.get('/owner/dashboard', verifyToken, requireRole('store_owner'), ratingController.storeOwnerDashboard);

module.exports = router;
