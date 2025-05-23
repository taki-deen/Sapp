const { validationResult } = require("express-validator");
const userService = require("../services/userService");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    let filter = {};

    console.log(req.query);
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const users = await userService.getAllUsers(filter);
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin" && !user._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};
// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
};

 const uploadingProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = req.user;
    user.image = req.file.filename;
    await user.save();

    res.json({
      message: "Image uploaded successfully",
      image: user.image
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading image",
      error: error.message
    });
  }
}
module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  uploadingProfileImage,
  
};
