import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {generateTokens, normalizeUser} from "../utils/auth.js";

import { registerUser, getUserByEmail } from "../db/authQueries.js";


const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser && role == existingUser.role) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await registerUser(email, hashedPassword, role);

    if (!result.success) {
      return res.status(400).json({ msg: result.msg });
    }

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      msg: "User registered",
      token,
      user: { email, role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ msg: "Registration failed" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) return res.status(400).json({ msg: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✨ Include email and role in response
  res.status(200).json({
    accessToken,
    user: {
      email: user.email,
      role: user.role,
    },
  });
};

const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ msg: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    res.status(200).json({ accessToken });
  });
};

export default {register, login, refreshAccessToken}
