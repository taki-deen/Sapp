const User = require('../models/User');

// Get all users
const getAllUsers = async () => {
    return await User.find().select('-password');
};

// Get user by ID
const getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

// Update user
const updateUser = async (id, updateData, currentUser) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    if (currentUser.role !== 'admin' && !user._id.equals(currentUser._id)) {
        throw new Error('Access denied');
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'phone', 'location', 'specialization'];
    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    return await user.save();
};

// Delete user
const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('User not found');
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}; 