import express from "express";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.js";

const router = express.Router();
const SECRET = process.env.SECRET;

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await userRepository.getUserByEmail(email);
  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }
  const newUser = await userRepository.createUser(email, password);

  const token = jwt.sign({ userId: newUser.id }, SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3600000,
  });

  res.json({ message: "Registered successfully" });
});

export default router;
