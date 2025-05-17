import mongoose from 'mongoose';

const serviceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
serviceTypeSchema.index({ name: 1 });
serviceTypeSchema.index({ isActive: 1 });

export default mongoose.model('ServiceType', serviceTypeSchema); 