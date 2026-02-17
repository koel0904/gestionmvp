import express from "express";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.js";

const SECRET = process.env.SECRET;
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful", user });
  } catch {
    res.status(500).json({ error: "Error logging in" });
  }
});

export default router;
