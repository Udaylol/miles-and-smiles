import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const formatUser = (user) => ({
  _id: user._id,
  email: user.email,
});

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

class AuthController {
  // ------------------- SIGNUP -------------------
  static async signup(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required.",
          data: null,
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
          data: null,
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword,
      });
      await user.save();

      const token = generateToken(user._id);
      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: "Signup successful.",
        data: {
          user: formatUser(user),
          token,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Sign up failed.",
        data: null,
      });
    }
  }

  // ------------------- SIGNIN -------------------
  static async signin(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required.",
          data: null,
        });
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password.",
          data: null,
        });
      }

      const isMatch = await comparePassword(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password.",
          data: null,
        });
      }

      const token = generateToken(existingUser._id);
      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Signin successful.",
        data: {
          user: formatUser(existingUser),
          token,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
        data: null,
      });
    }
  }

  // ------------------- SIGNOUT -------------------
  static async signout(req, res) {
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: "Signed out successfully.",
      data: null,
    });
  }
}

export default AuthController;
