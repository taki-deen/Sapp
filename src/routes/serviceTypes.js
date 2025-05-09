const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceType = require('../models/ServiceType');
const { auth, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Create service type (Admin only)
router.post('/',
    auth,
    checkRole(['admin']),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, description } = req.body;
            const exists = await ServiceType.findOne({ name });
            if (exists) return res.status(400).json({ message: 'Service type already exists' });
            const serviceType = new ServiceType({ name, description });
            await serviceType.save();
            res.status(201).json(serviceType);
        } catch (err) {
            res.status(500).json({ message: 'Error creating service type', error: err.message });
        }
    }
);

// Get all service types
router.get('/', auth, async (req, res) => {
    try {
        const types = await ServiceType.find({ isActive: true });
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service types', error: err.message });
    }
});

// Update service type (Admin only)
router.put('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const updated = await ServiceType.findByIdAndUpdate(
            req.params.id,
            { name, description, isActive },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Service type not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating service type', error: err.message });
    }
});

// Delete service type (Admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const deleted = await ServiceType.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Service type not found' });
        res.json({ message: 'Service type deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service type', error: err.message });
    }
});

module.exports = router; 