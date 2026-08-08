const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { signupValidation, loginValidation, updatePasswordValidation } = require('../middleware/validators');

router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.get('/me', verifyToken, authController.me);
router.put('/update-password', verifyToken, updatePasswordValidation, authController.updatePassword);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
