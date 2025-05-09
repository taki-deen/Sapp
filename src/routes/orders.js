const express = require('express');
const { body, validationResult } = require('express-validator');
const orders = require('../models/orders');
const { auth, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Create a new service request (Customer only)
router.post('/',
    auth,
    checkRole(['customer']),
    [
        body('serviceType').notEmpty().withMessage('Service type is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('scheduledTime').notEmpty().withMessage('Scheduled time is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { serviceType, description, location, scheduledTime, notes } = req.body;
            const orders = new orders({
                customerId: req.user._id,
                serviceType,
                description,
                location,
                scheduledTime,
                notes
            });
            await orders.save();
            res.status(201).json(orders);
        } catch (err) {
            res.status(500).json({ message: 'Error creating service request', error: err.message });
        }
    }
);

// Get all service requests (role-based)
router.get('/', auth, async (req, res) => {
    console.log(req);
    try {
        let filter = {};
        if (req.user.role === 'customer') {
            filter.customerId = req.user._id;
        } else if (req.user.role === 'worker') {
            filter.$or = [
                { workerId: req.user._id },
                { status: 'pending' }
            ];
        }
        const requests = await orders.find(filter)
            .populate('customerId', 'name email')
            .populate('workerId', 'name email')
            .populate('serviceType', 'name');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service requests', error: err.message });
    }
});

// Get a single service request by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const request = await orders.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate('workerId', 'name email')
            .populate('serviceType', 'name');
        if (!request) return res.status(404).json({ message: 'Service request not found' });
        // Only allow access if user is involved or admin
        if (
            req.user.role !== 'admin' &&
            !request.customerId._id.equals(req.user._id) &&
            (!request.workerId || !request.workerId._id.equals(req.user._id))
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service request', error: err.message });
    }
});

// Update service request status (Worker or Admin)
router.put('/:id/status', auth, checkRole(['worker', 'admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const request = await orders.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Service request not found' });
        // Only assigned worker or admin can update
        if (
            req.user.role === 'worker' &&
            (!request.workerId || !request.workerId.equals(req.user._id))
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }
        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Error updating status', error: err.message });
    }
});

// Assign a worker to a request (Worker accepts job)
router.put('/:id/assign', auth, checkRole(['worker']), async (req, res) => {
    try {
        const request = await orders.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Service request not found' });
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Job is not available for assignment' });
        }
        request.workerId = req.user._id;
        request.status = 'accepted';
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Error assigning worker', error: err.message });
    }
});

// Customer rates worker after completion
router.put('/:id/rate', auth, checkRole(['customer']), [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const request = await orders.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Service request not found' });
        if (!request.customerId.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (request.status !== 'completed') {
            return res.status(400).json({ message: 'Service not completed yet' });
        }
        request.rating = req.body.rating;
        await request.save();
        // Optionally, update worker's ratings array
        if (request.workerId) {
            const User = require('../models/User');
            await User.findByIdAndUpdate(request.workerId, { $push: { ratings: req.body.rating } });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Error rating worker', error: err.message });
    }
});

// Delete a service request (Admin or owner)
router.delete('/:id', auth, async (req, res) => {
    try {
        const request = await orders.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Service request not found' });
        if (
            req.user.role !== 'admin' &&
            !request.customerId.equals(req.user._id)
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await request.deleteOne();
        res.json({ message: 'Service request deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service request', error: err.message });
    }
});

module.exports = router; 