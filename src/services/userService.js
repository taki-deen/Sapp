const User = require("../models/User");

// Get all users
const getAllUsers = async (filter) => {
  return await User.find(filter).select("-password");
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// Update user
const updateUser = async (id, updateData, currentUser) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (currentUser.role !== "admin" && !user._id.equals(currentUser._id)) {
    throw new Error("Access denied");
  }

  // Update allowed fields
  const allowedUpdates = ["name", "phone", "location", "specialization"];
  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  return await user.save();
};

// Delete user
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
};

// Get current user
const getCurrentUser = async (userId) => {
  return await User.findById(userId).select("-password");
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
};
