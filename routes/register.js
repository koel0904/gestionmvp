import express from "express";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.js";

const router = express.Router();
const SECRET = process.env.SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await userRepository.createUser(name, email, password);

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Registered successfully", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Error registering user" });
  }
});

export default router;
