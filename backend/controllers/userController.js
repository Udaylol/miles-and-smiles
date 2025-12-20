import User from "../models/User.js";
import { isSameObject } from "../utils/compare.js";
import { getUser } from "../services/userService.js";

const formatUser = (user) => ({
  _id: user._id,
  email: user.email,
});

class UserController {
  // --------------------- GET USER BY ID ---------------------
  static async getUserById(req, res) {
    try {
      const user = await getUser(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: formatUser(user),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- GET ME ---------------------
  static async getMe(req, res) {
    try {
      const user = await getUser(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: formatUser(user),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- UPDATE USER ---------------------
  static async updateUser(req, res) {
    try {
      const updates = req.body ?? {};

      if (Object.keys(updates).length === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes provided.",
          data: null,
        });
      }

      // Explicitly block forbidden fields
      const forbidden = ["_id", "email", "password"];
      for (const field of forbidden) {
        if (field in updates) {
          return res.status(400).json({
            success: false,
            message: `Cannot update field: ${field}`,
            data: null,
          });
        }
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      // Compare using plain object
      if (isSameObject(user.toObject(), updates)) {
        return res.status(200).json({
          success: true,
          message: "No changes provided.",
          data: formatUser(user),
        });
      }

      const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
        new: true,
      }).select("-password");

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: formatUser(updatedUser),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error updating user",
        data: null,
      });
    }
  }

  // --------------------- UPDATE EMAIL ---------------------
  static async updateEmail(req, res) {
    try {
      const { email } = req.body ?? {};

      if (!email) {
        return res.status(200).json({
          success: true,
          message: "No changes provided.",
          data: null,
        });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      if (email === user.email) {
        return res.status(200).json({
          success: true,
          message: "No changes provided.",
          data: formatUser(user),
        });
      }

      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.userId },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
          data: null,
        });
      }

      user.email = email;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email updated successfully",
        data: formatUser(user),
      });
    } catch (err) {
      console.error("Error updating email:", err);

      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }
}

export default UserController;
