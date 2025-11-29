import User from "../models/User.js";

class FriendController {
  // --------------------- GET FRIENDS ---------------------
  static async getFriends(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate("friends", "username email profilePicture")
        .lean();

      return res.status(200).json({
        success: true,
        message: "Friends fetched successfully",
        data: user?.friends || [],
      });
    } catch (err) {
      console.error("getFriends error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- GET FRIEND REQUESTS ---------------------
  static async getFriendRequests(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate("incomingFriendRequests", "username profilePicture")
        .populate("outgoingFriendRequests", "username profilePicture")
        .lean();

      return res.status(200).json({
        success: true,
        message: "Friend requests fetched successfully",
        data: {
          incoming: user?.incomingFriendRequests || [],
          outgoing: user?.outgoingFriendRequests || [],
        },
      });
    } catch (err) {
      console.error("getFriendRequests error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- SEND FRIEND REQUEST ---------------------
  static async sendFriendRequest(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.id;

      if (senderId === receiverId) {
        return res.status(400).json({
          success: false,
          message: "You cannot add yourself",
          data: null,
        });
      }

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      if (sender.friends.includes(receiverId)) {
        return res.status(400).json({
          success: false,
          message: "Already friends",
          data: null,
        });
      }

      if (sender.incomingFriendRequests.includes(receiverId)) {
        return FriendController.acceptFriendRequest(req, res);
      }

      if (sender.outgoingFriendRequests.includes(receiverId)) {
        return res.status(400).json({
          success: false,
          message: "Request already sent",
          data: null,
        });
      }

      sender.outgoingFriendRequests.push(receiverId);
      receiver.incomingFriendRequests.push(senderId);

      await sender.save();
      await receiver.save();

      return res.status(200).json({
        success: true,
        message: "Friend request sent",
        data: null,
      });
    } catch (err) {
      console.error("sendFriendRequest error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- ACCEPT FRIEND REQUEST ---------------------
  static async acceptFriendRequest(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.id;

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!receiver || !sender) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      if (!receiver.incomingFriendRequests.includes(senderId)) {
        return res.status(400).json({
          success: false,
          message: "No request from this user",
          data: null,
        });
      }

      receiver.incomingFriendRequests = receiver.incomingFriendRequests.filter(
        (id) => id.toString() !== senderId
      );

      sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(
        (id) => id.toString() !== receiverId
      );

      receiver.friends.push(senderId);
      sender.friends.push(receiverId);

      await receiver.save();
      await sender.save();

      return res.status(200).json({
        success: true,
        message: "Friend request accepted",
        data: null,
      });
    } catch (err) {
      console.error("acceptFriendRequest error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- DELETE FRIEND REQUEST ---------------------
  static async deleteFriendRequest(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

      if (!user1 || !user2) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      user1.incomingFriendRequests = user1.incomingFriendRequests.filter(
        (id) => id.toString() !== uid2
      );
      user1.outgoingFriendRequests = user1.outgoingFriendRequests.filter(
        (id) => id.toString() !== uid2
      );
      user2.incomingFriendRequests = user2.incomingFriendRequests.filter(
        (id) => id.toString() !== uid1
      );
      user2.outgoingFriendRequests = user2.outgoingFriendRequests.filter(
        (id) => id.toString() !== uid1
      );

      await user1.save();
      await user2.save();

      return res.status(200).json({
        success: true,
        message: "Friend request removed",
        data: null,
      });
    } catch (err) {
      console.error("deleteFriendRequest error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // --------------------- DELETE FRIEND ---------------------
  static async deleteFriend(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

      if (!user1 || !user2) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      user1.friends = user1.friends.filter((id) => id.toString() !== uid2);
      user2.friends = user2.friends.filter((id) => id.toString() !== uid1);

      await user1.save();
      await user2.save();

      return res.status(200).json({
        success: true,
        message: "Friend removed",
        data: null,
      });
    } catch (err) {
      console.error("deleteFriend error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }
}

export default FriendController;
