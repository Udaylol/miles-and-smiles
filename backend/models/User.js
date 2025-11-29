import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "/guest.png",
    },

    profilePicturePublicId: {
      type: String,
      default: null,
    },

    favourites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Game",
      default: [],
    },

    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    incomingFriendRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    outgoingFriendRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    birthday: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
