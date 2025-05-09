const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'worker', 'admin'],
        default: 'customer'
    },
    location: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: function() {
            return this.role === 'worker';
        }
    },
    ratings: [{
        type: Number,
        min: 1,
        max: 5
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate average rating
userSchema.methods.getAverageRating = function() {
    if (this.ratings.length === 0) return 0;
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 