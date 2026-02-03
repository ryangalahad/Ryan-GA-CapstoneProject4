import * as userModel from "../models/user.js";

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Create new user
export async function createUser(req, res) {
  try {
    const { name, email, role } = req.body;

    // Simple validation
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, error: "Name and email required" });
    }

    const newUser = await userModel.createUser({ name, email, role });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await userModel.updateUser(id, { name, email, role });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
