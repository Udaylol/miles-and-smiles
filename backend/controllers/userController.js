import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { isSameObject } from "../utils/compare.js";

class UserController {
  // --------------------- GET USER ---------------------
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
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
        data: user,
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
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: req.user,
    });
  }

  // --------------------- UPDATE USER ---------------------
  static async updateUser(req, res) {
    try {
      const updates = req.body || {};
      const user = req.user;

      // If empty body
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes provided. User is up to date.",
          data: user,
        });
      }

      // Forbidden fields
      const forbidden = [
        "_id",
        "email",
        "username",
        "password",
        "profilePicture",
        "profilePicturePublicId",
        "favourites",
        "friends",
        "incomingFriendRequests",
        "outgoingFriendRequests",
      ];

      for (const key of Object.keys(updates)) {
        if (forbidden.includes(key)) delete updates[key];
      }

      // If empty after removing forbidden fields
      if (Object.keys(updates).length === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes provided. User is up to date.",
          data: user,
        });
      }

      // Check if values are actually different
      if (isSameObject(user, updates)) {
        return res.status(200).json({
          success: true,
          message: "No changes provided. User is up to date.",
          data: user,
        });
      }

      // Perform update
      const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
        new: true,
      }).select("-password");

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
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

  // --------------------- UPDATE CREDENTIALS ---------------------
  static async updateCredentials(req, res) {
    try {
      const { email, username } = req.body || {};
      const user = req.user;
      const userId = user._id;

      // If no fields provided
      if (!email && !username) {
        return res.status(200).json({
          success: true,
          message: "No changes provided. User is up to date.",
          data: user,
        });
      }

      // Check if same values already
      const updates = { email, username };
      Object.keys(updates).forEach(
        (key) => updates[key] === undefined && delete updates[key]
      );

      if (isSameObject(user, updates)) {
        return res.status(200).json({
          success: true,
          message: "No changes provided. User is up to date.",
          data: user,
        });
      }

      // Email uniqueness check
      if (email) {
        const emailExists = await User.findOne({
          email,
          _id: { $ne: userId },
        });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email already in use",
            data: null,
          });
        }
      }

      // Username uniqueness check
      if (username) {
        const usernameExists = await User.findOne({
          username,
          _id: { $ne: userId },
        });
        if (usernameExists) {
          return res.status(400).json({
            success: false,
            message: "Username already in use",
            data: null,
          });
        }
      }

      // Perform update
      const updated = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      }).select("-password");

      return res.status(200).json({
        success: true,
        message: "Credentials updated successfully",
        data: updated,
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

  // --------------------- UPDATE PROFILE PICTURE ---------------------
  static async updateProfilePicture(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        data: null,
      });
    }

    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      const newImageUrl = req.file.path;
      const newPublicId = req.file.filename;

      // Remove old image if exists
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      user.profilePicture = newImageUrl;
      user.profilePicturePublicId = newPublicId;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        data: { url: newImageUrl },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
        data: null,
      });
    }
  }

  // --------------------- DELETE PROFILE PICTURE ---------------------
  static async deleteProfilePicture(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }
      user.profilePicture = "/guest.png";
      user.profilePicturePublicId = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Profile picture removed",
        data: null,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to remove profile picture",
        data: null,
      });
    }
  }
}

export default UserController;
