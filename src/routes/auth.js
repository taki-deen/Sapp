const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { auth } = require('../middlewares/auth');

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
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, name, phone, role, location, specialization } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const user = new User({
                name,
                email,
                password,
                phone,
                role,
                location,
                specialization: role === 'worker' ? specialization : undefined
            });

            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }
);

// Login user
router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({ message: 'Account is inactive' });
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
            const token = generateToken(user._id);

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
);

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

module.exports = router; 