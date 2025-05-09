const Order = require('../models/orders');
const User = require('../models/User');

// Create a new order
const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};

// Get all orders with filter
const getAllOrders = async (filter) => {
    return await Order.find(filter)
        .populate('customerId', 'name email')
        .populate('workerId', 'name email')
        .populate('serviceType', 'name');
};

// Get order by ID
const getOrderById = async (id) => {
    return await Order.findById(id)
        .populate('customerId', 'name email')
        .populate('workerId', 'name email')
        .populate('serviceType', 'name');
};

// Update order status
const updateOrderStatus = async (id, status, user) => {
    const order = await Order.findById(id);
    if (!order) throw new Error('Service request not found');

    if (
        user.role === 'worker' &&
        (!order.workerId || !order.workerId.equals(user._id))
    ) {
        throw new Error('Access denied');
    }

    order.status = status;
    return await order.save();
};

// Assign worker to order
const assignWorker = async (orderId, workerId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Service request not found');
    
    if (order.status !== 'pending') {
        throw new Error('Job is not available for assignment');
    }

    order.workerId = workerId;
    order.status = 'accepted';
    return await order.save();
};

// Rate worker
const rateWorker = async (orderId, customerId, rating) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Service request not found');

    if (!order.customerId.equals(customerId)) {
        throw new Error('Access denied');
    }

    if (order.status !== 'completed') {
        throw new Error('Service not completed yet');
    }

    order.rating = rating;
    await order.save();

    // Update worker's ratings
    if (order.workerId) {
        await User.findByIdAndUpdate(order.workerId, {
            $push: { ratings: rating }
        });
    }

    return order;
};

// Delete order
const deleteOrder = async (orderId, user) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Service request not found');

    if (
        user.role !== 'admin' &&
        !order.customerId.equals(user._id)
    ) {
        throw new Error('Access denied');
    }

    await order.deleteOne();
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