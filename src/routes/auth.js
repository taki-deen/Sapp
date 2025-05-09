const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register new user
router.post('/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('role').isIn(['customer', 'worker']).withMessage('Invalid role'),
        body('location').trim().notEmpty().withMessage('Location is required'),
        body('specialization').if(body('role').equals('worker')).notEmpty().withMessage('Specialization is required for workers')
    ],
    authController.register
);

// Login user
router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    authController.login
);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

module.exports = router; 