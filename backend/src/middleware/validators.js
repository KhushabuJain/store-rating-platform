const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const addressRule = body('address')
  .trim()
  .isLength({ min: 1, max: 400 })
  .withMessage('Address must be at most 400 characters');

const emailRule = body('email').trim().isEmail().withMessage('Must be a valid email address');

// 8-16 chars, at least one uppercase, at least one special character
const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/)
  .withMessage('Password must contain at least one special character');

const signupValidation = [nameRule, emailRule, addressRule, passwordRule, handleValidation];

const adminCreateUserValidation = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  body('role').isIn(['admin', 'user', 'store_owner']).withMessage('Invalid role'),
  handleValidation,
];

const storeValidation = [
  body('name').trim().isLength({ min: 1, max: 60 }).withMessage('Store name must be at most 60 characters'),
  emailRule,
  addressRule,
  handleValidation,
];

const loginValidation = [
  emailRule,
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const updatePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/)
    .withMessage('New password must contain at least one special character'),
  handleValidation,
];

const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  handleValidation,
];

module.exports = {
  handleValidation,
  signupValidation,
  adminCreateUserValidation,
  storeValidation,
  loginValidation,
  updatePasswordValidation,
  ratingValidation,
};
