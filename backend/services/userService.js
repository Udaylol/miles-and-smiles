import User from "../models/User.js";

export const getUser = async (userId) => {
  return await User.findById(userId).select("-password");
};
