const { validationResult } = require('express-validator');
const orderService = require('../services/orderService');

/**
 * Create a new service request
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When service request creation fails
 */
const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { serviceType, description, location, scheduledTime, notes } = req.body;
        const order = await orderService.createOrder({
            customerId: req.user._id,
            serviceType,
            description,
            location,
            scheduledTime,
            notes
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service request', error: err.message });
    }
};

/**
 * Get all service requests based on user role
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When fetching service requests fails
 */
const getAllOrders = async (req, res) => {
    try {
        const filter = req.user.role === 'customer' 
            ? { customerId: req.user._id }
            : req.user.role === 'worker'
                ? { $or: [{ workerId: req.user._id }, { status: 'pending' }] }
                : {};
        
        const orders = await orderService.getAllOrders(filter);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service requests', error: err.message });
    }
};

/**
 * Get a single service request by ID
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When fetching service request fails
 */
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Service request not found' });
        
        if (
            req.user.role !== 'admin' &&
            !order.customerId._id.equals(req.user._id) &&
            (!order.workerId || !order.workerId._id.equals(req.user._id))
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service request', error: err.message });
    }
};

/**
 * Update service request status
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When updating status fails
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status, req.user);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error updating status', error: err.message });
    }
};

/**
 * Assign a worker to a request
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When assigning worker fails
 */
const assignWorker = async (req, res) => {
    try {
        const order = await orderService.assignWorker(req.params.id, req.user._id);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error assigning worker', error: err.message });
    }
};

/**
 * Rate worker after completion
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When rating worker fails
 */
const rateWorker = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const order = await orderService.rateWorker(req.params.id, req.user._id, req.body.rating);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error rating worker', error: err.message });
    }
};

/**
 * Delete a service request
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} When deleting service request fails
 */
const deleteOrder = async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id, req.user);
        res.json({ message: 'Service request deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service request', error: err.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    assignWorker,
    rateWorker,
    deleteOrder
}; 