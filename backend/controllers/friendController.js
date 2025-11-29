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

  static async sendFriendRequest(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.id;

      if (senderId === receiverId)
        return res.status(400).json({ message: "You cannot add yourself" });

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (sender.friends.includes(receiverId))
        return res.status(400).json({ message: "Already friends" });

      if (sender.incomingFriendRequests.includes(receiverId))
        return FriendController.acceptFriendRequest(req, res);

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

  static async acceptFriendRequest(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.id;

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!receiver.incomingFriendRequests.includes(senderId))
        return res.status(400).json({ message: "No request from this user" });

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

      res.json({ message: "Friend request accepted" });
    } catch (err) {
      console.error("acceptFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async deleteFriendRequest(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

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

      res.json({ message: "Friend request removed" });
    } catch (err) {
      console.error("deleteFriendRequest error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async deleteFriend(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

      user1.friends = user1.friends.filter((id) => id.toString() !== uid2);
      user2.friends = user2.friends.filter((id) => id.toString() !== uid1);
      await user1.save();
      await user2.save();

      res.json({ message: "Friend removed" });
    } catch (err) {
      console.error("deleteFriend error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default FriendController;
