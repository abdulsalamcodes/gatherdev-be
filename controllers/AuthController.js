import { hash } from "argon2";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import randomBytes from "randombytes";
import passport from "passport";

const generateToken = (data) => {
  const jwtSecret = randomBytes(64);
  const token = jwt.sign(data, jwtSecret);
  return token;
};

// Register a new user
export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const encryptedPassword = await hash(password);
    const newUser = await User.create({
      fullname,
      email,
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
        user: newUser,
        token,
      },
    });
  } catch (e) {
    console.error("[REGISTER USER]: An error occurred", e);
    return res.status(500).json({
      message:
        "An error occurred while creating your account, please try again",
      success: false,
    });
  }
};

export const registerWithGoogle = () => {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  });
};

// login
export const loginUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter all fields",
      success: false,
    });
  }
  // fetch user with username
  // decrypt user password
  // compare with received password.
  // if match, return user and success message.
  // else return error message.
};

// verify-email
// logout
// recover-password
// forget-password
