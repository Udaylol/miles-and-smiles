import User from "../models/User.js";

class UserController {
  async getMe(req, res) {
    return res.json({
      message: "Success",
      user: req.user,
    });
  }

  async updateUser(req, res) {
    try {
      const updates = req.body;

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
}

export default new UserController();
