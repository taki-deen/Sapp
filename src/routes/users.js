const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, checkRole(['admin']), userController.getAllUsers);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Update user
router.put('/:id', auth, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty')
], userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);

module.exports = router; 