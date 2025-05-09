const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceType',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
ordersSchema.index({ customerId: 1, status: 1 });
ordersSchema.index({ workerId: 1, status: 1 });
ordersSchema.index({ serviceType: 1, status: 1 });

const orders = mongoose.model('orders', ordersSchema);

module.exports = orders; 