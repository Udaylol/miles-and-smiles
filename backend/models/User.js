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

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
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
