import { hash } from "argon2";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import randomBytes from "randombytes";
import passport from "passport";

const jwtSecret = randomBytes(64);

const generateToken = (data) => {
  const token = jwt.sign(data, jwtSecret);
  return token;
};

// Register a new user
export const registerUser = async (req, res) => {
  const { fullname, email, password, username } = req.body;

  try {
    const encryptedPassword = await hash(password);
    const newUser = await User.create({
      fullname,
      email,
      username,
      password: encryptedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        message: "User could not be created",
        success: false,
      });
    }

    console.log("[REGISTER USER]: User created successfully");
    const token = generateToken({
      email: newUser.email,
      password: newUser.password,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          profilePicture: newUser.profilePicture,
          title: newUser.title,
        },
        token,
      },
    });
  } catch (e) {
    console.error("[REGISTER USER]: An error occurred", e);
    return res.status(500).json({
      message:
        e.message ||
        "An error occurred while creating your account, please try again",
      success: false,
    });
  }
};

// Register user with Google
export const registerWithGoogle = () => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  });
};

// Log In User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "Please enter both username and password",
        success: false,
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Verify user password
    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }
    console.error("[LOGIN USER]: User logged in successfully");
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          profilePicture: user.profilePicture,
          title: user.title,
        },
        token: generateToken({ email: user.email, password: user.password }),
      },
    });
  } catch (error) {
    console.error("[LOGIN USER]: An error occurred", error);
    return res.status(500).json({
      message:
        error.message ||
        "An error occurred while logging you in, please try again",
      success: false,
    });
  }
};

// Recover Password
export const recoverPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Generate a password reset token
    const resetToken = generateToken({
      email: user.email,
      password: user.password, // Include additional security data
      type: "password-reset",
    });

    // Send the reset token to the user's email address
    // Here you should send an email with a link containing the resetToken
    // The link should point to a password reset page in your application

    return res.status(200).json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (error) {
    console.error("[RECOVER PASSWORD]: An error occurred", error);
    return res.status(500).json({
      message:
        "An error occurred while processing your request, please try again",
      success: false,
    });
  }
};

// Forget Password
export const forgetPassword = async (req, res) => {
  const { email, password, resetToken } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Verify the provided resetToken
    const isTokenValid = jwt.verify(resetToken, jwtSecret);

    if (!isTokenValid) {
      return res.status(401).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    // Update the user's password
    user.password = await hash(password);
    await user.save();

    // Send a confirmation email or response
    // Here you should notify the user that their password has been changed

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("[FORGET PASSWORD]: An error occurred", error);
    return res.status(500).json({
      message:
        "An error occurred while processing your request, please try again",
      success: false,
    });
  }
};

// Authorize user
export const authorize = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    req.user = decodedToken;
    next();
  } catch (error) {
    // Handle JWT verification errors
    res.status(401).json({ message: "Unauthorized" });
  }
};
