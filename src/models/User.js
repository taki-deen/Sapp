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
        required: function () {
            return this.role === 'worker';
        }
    },
    ratings: {
        type: [Number],
        validate: {
            validator: function (arr) {
                return arr.every(num => num >= 1 && num <= 5);
            },
            message: 'Ratings must be between 1 and 5'
        },
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate average rating
userSchema.methods.getAverageRating = function () {
    if (!this.ratings.length) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
    return parseFloat((sum / this.ratings.length).toFixed(2));
};

module.exports = mongoose.model('User', userSchema);
