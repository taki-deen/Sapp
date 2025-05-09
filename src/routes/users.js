const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Only allow access if user is viewing their own profile or is admin
        if (req.user.role !== 'admin' && !user._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

// Update user
router.put('/:id', auth, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Only allow users to update their own profile or admin to update any profile
        if (req.user.role !== 'admin' && !user._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update allowed fields
        const allowedUpdates = ['name', 'phone', 'location', 'specialization'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router; 