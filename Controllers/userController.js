// first schema want

import user from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user with the same email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, registration failed" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new user({ username, email, password: hashPassword, role });
    await newUser.save();

    res
      .status(200)
      .json({ message: "User Registered Successfully", result: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Registration failed due to an internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDetail = await user.findOne({ email });
    if (!userDetail) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "User Not Found" });
    }
    // jwt.sign
    // jwt token generation
    const token = jwt.sign(
      { _id: userDetail._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    userDetail.token = token;
    await userDetail.save();

    // console.log(token);

    res
      .status(200)
      .json({ message: "User Logined Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed Internal server error" });
  }
};

export const getuser = async (req, res) => {
  try {
    const userId = req.User._id;
    const User = await user.findById(userId);
    res.status(200).json({ message: "Authorized user", data: [User] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error Failed to fetch user" });
  }
};
