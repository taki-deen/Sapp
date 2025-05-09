const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middlewares/auth');
const serviceTypeController = require('../controllers/serviceTypeController');

const router = express.Router();

// Create service type (Admin only)
router.post('/',
    auth,
    checkRole(['admin']),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required')
    ],
    serviceTypeController.createServiceType
);

// Get all service types
router.get('/', auth, serviceTypeController.getAllServiceTypes);

// Update service type (Admin only)
router.put('/:id', auth, checkRole(['admin']), serviceTypeController.updateServiceType);

// Delete service type (Admin only)
router.delete('/:id', auth, checkRole(['admin']), serviceTypeController.deleteServiceType);

module.exports = router; 