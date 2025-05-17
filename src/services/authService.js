import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Register new user
const register = async (userData) => {
    const { email, password, name, phone, role, location, specialization } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create new user
    const user = new User({
        name,
        email,
        password,
        phone,
        role,
        location,
        specialization: role === 'worker' ? specialization : undefined
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return {
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

// Login user
const login = async (email, password) => {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new Error('Account is inactive');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    return {
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const getCurrentUserInfo = async ()=>{
    await User.findOne({ _id: decoded.userId, isActive: true });
}

export default {
    register,
    login,
    getCurrentUserInfo
}; 