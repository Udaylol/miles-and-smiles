import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const formatUser = (user) => {
  return {
    _id: user._id,
    email: user.email,
    username: user.username || null,
  };
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

class AuthController {
  async signup(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password required." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id);
      setAuthCookie(res, token);

      return res.status(201).json({
        message: "Signup successful.",
        user: formatUser(user),
        token,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Sign up failed." });
    }
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password required." });
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const isMatch = await comparePassword(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const token = generateToken(existingUser._id);
      setAuthCookie(res, token);

      return res.status(200).json({
        message: "Signin successful.",
        user: formatUser(existingUser),
        token,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async signout(req, res) {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({ message: "Signed out successfully." });
  }
}

export default new AuthController();
