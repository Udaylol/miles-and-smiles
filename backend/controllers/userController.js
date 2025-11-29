import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

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

      const forbidden = [
        "_id",
        "email",
        "username",
        "password",
        "profilePicture",
      ];

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

  static async updateProfilePicture(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newImageUrl = req.file.path;
      const newPublicId = req.file.filename;

      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      user.profilePicture = newImageUrl;
      user.profilePicturePublicId = newPublicId;

      await user.save();

      res.json({
        message: "Profile picture updated successfully.",
        url: newImageUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile picture" });
    }
  }
}

export default UserController;
