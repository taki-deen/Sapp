const { validationResult } = require('express-validator');
const authService = require('../services/authService');

// Register new user
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, name, phone, role, location, specialization } = req.body;
        const result = await authService.register({
            email,
            password,
            name,
            phone,
            role,
            location,
            specialization
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
}; 