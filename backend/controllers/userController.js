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

      const forbidden = ["_id", "email", "password"];

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

  static async getFriends(req, res) {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId)
        .populate({
          path: "friends",
          select: "username email profilePicture",
        })
        .lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        friends: user.friends || [],
      });
    } catch (error) {
      console.error("Error fetching friends:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async updateCredentials(req, res) {
    try {
      const { email, username } = req.body || {};
      const userId = req.user._id;

      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== userId)
          return res.status(400).json({ message: "Email already in use" });
      }

      if (username) {
        const usernameExists = await User.findOne({ username });
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
