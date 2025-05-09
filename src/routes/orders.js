const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

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
    orderController.createOrder
);

// Get all service requests (role-based)
router.get('/', auth, orderController.getAllOrders);

// Get a single service request by ID
router.get('/:id', auth, orderController.getOrderById);

// Update service request status (Worker or Admin)
router.put('/:id/status', auth, checkRole(['worker', 'admin']), orderController.updateOrderStatus);

// Assign a worker to a request (Worker accepts job)
router.put('/:id/assign', auth, checkRole(['worker']), orderController.assignWorker);

// Customer rates worker after completion
router.put('/:id/rate', auth, checkRole(['customer']), [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
], orderController.rateWorker);

// Delete a service request (Admin or owner)
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router; 