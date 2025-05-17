import { validationResult } from 'express-validator';
import authService from '../services/authService.js';

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

export default {
    register,
    login,
}; 