import User from "../models/User.js";

class FriendController {
  static async getFriends(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate("friends", "username email profilePicture")
        .lean();

      return res.json({ friends: user?.friends || [] });
    } catch (err) {
      console.error("getFriends error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getFriendRequests(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate("incomingFriendRequests", "username profilePicture")
        .populate("outgoingFriendRequests", "username profilePicture")
        .lean();

      return res.json({
        incoming: user?.incomingFriendRequests || [],
        outgoing: user?.outgoingFriendRequests || [],
      });
    } catch (err) {
      console.error("getFriendRequests error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async send(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.userId;

      if (senderId === receiverId)
        return res.status(400).json({ message: "You cannot add yourself" });

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (sender.friends.includes(receiverId))
        return res.status(400).json({ message: "Already friends" });

      if (sender.incomingFriendRequests.includes(receiverId))
        return FriendController.accept(req, res);

      if (sender.outgoingFriendRequests.includes(receiverId))
        return res.status(400).json({ message: "Request already sent" });

      sender.outgoingFriendRequests.push(receiverId);
      receiver.incomingFriendRequests.push(senderId);

      await sender.save();
      await receiver.save();

      res.json({ message: "Friend request sent" });
    } catch (err) {
      console.error("sendFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async accept(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.userId;

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!receiver.incomingFriendRequests.includes(senderId))
        return res.status(400).json({ message: "No request from this user" });

      receiver.incomingFriendRequests =
        receiver.incomingFriendRequests.filter(id => id.toString() !== senderId);
      sender.outgoingFriendRequests =
        sender.outgoingFriendRequests.filter(id => id.toString() !== receiverId);

      receiver.friends.push(senderId);
      sender.friends.push(receiverId);

      await receiver.save();
      await sender.save();

      res.json({ message: "Friend request accepted" });
    } catch (err) {
      console.error("acceptFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async reject(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.userId;

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      receiver.incomingFriendRequests =
        receiver.incomingFriendRequests.filter(id => id.toString() !== senderId);
      sender.outgoingFriendRequests =
        sender.outgoingFriendRequests.filter(id => id.toString() !== receiverId);

      await receiver.save();
      await sender.save();

      res.json({ message: "Friend request rejected" });
    } catch (err) {
      console.error("rejectFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async cancel(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.userId;

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      sender.outgoingFriendRequests =
        sender.outgoingFriendRequests.filter(id => id.toString() !== receiverId);
      receiver.incomingFriendRequests =
        receiver.incomingFriendRequests.filter(id => id.toString() !== senderId);

      await sender.save();
      await receiver.save();

      res.json({ message: "Friend request cancelled" });
    } catch (err) {
      console.error("cancelFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async remove(req, res) {
    try {
      const userId = req.user.id;
      const friendId = req.params.userId;

      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      user.friends = user.friends.filter(id => id.toString() !== friendId);
      friend.friends = friend.friends.filter(id => id.toString() !== userId);

      await user.save();
      await friend.save();

      res.json({ message: "Friend removed" });
    } catch (err) {
      console.error("removeFriend error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default FriendController;
