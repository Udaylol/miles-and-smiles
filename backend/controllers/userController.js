import User from "../models/User.js";

class UserController {
  static async getMe(req, res) {
    return res.json({
      message: "User fetched successfully",
      user: req.user,
    });
  }

  static async updateUser(req, res) {
    try {
      const updates = req.body || {};

      const forbidden = ["_id", "email", "username", "password"];

      for (const key of Object.keys(updates)) {
        if (forbidden.includes(key)) {
          delete updates[key];
        }
      }

      const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select("-password");

      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating user" });
    }
  }

  static async updateCredentials(req, res) {
    try {
      const { email, username } = req.body || {};

      if (!email && !username) {
        return res.status(200).json({
          message: "No changes provided. User is up to date.",
        });
      }

      const userId = req.user._id;

      if (email) {
        const emailExists = await User.findOne({
          email,
          _id: { $ne: req.user._id },
        });
        if (emailExists && emailExists._id.toString() !== userId)
          return res.status(400).json({ message: "Email already in use" });
      }

      if (username) {
        const usernameExists = await User.findOne({
          username,
          _id: { $ne: req.user._id },
        });
        if (usernameExists && usernameExists._id.toString() !== userId)
          return res.status(400).json({ message: "Username already in use" });
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        { email, username },
        { new: true }
      ).select("-password");

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default UserController;
