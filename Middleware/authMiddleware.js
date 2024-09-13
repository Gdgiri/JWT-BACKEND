// jwt.verify

import jwt from "jsonwebtoken";
import user from "../Models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  //const token = req.header("Authorization");
  const token = req.headers.authorization?.split(" ")[1]; /// bearer token
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.User = decode;
    //console.log(req.User);
    const User = await user.findById(req.User._id);
    if (User.role != 'admin') {
      return res
        .status(401)
        .json({ message: "Access Denied Not a Valid User" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Invalid token internal server error" });
  }
};

export default authMiddleware;
