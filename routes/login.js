import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.js";
import MailRepository from "../repositories/mail.js";

const SECRET = process.env.SECRET;
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.verifyUser(email, password);
    if (!user || user === false) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await userRepository.afSetCode(email, code);
    await MailRepository.send2FACode(email, code);

    res.json({ message: "2FA code sent to email" }).status(200);
  } catch {
    return res.status(500).json({ error: "Error verifying user" });
  }
});

router.post("/login/2fa", async (req, res) => {
  const { email, password, code } = req.body;
  
  try {
    if (!email || !password || !code) {
      return res.status(400).json({ error: "Email, password and 2FA code are required" });
    }

    if ( email.find("@") === -1 || password.length < 6 || code.length !== 6) {
      return res.status(400).json({ error: "Invalid email, password or 2FA code format" });
    }

    const user = await userRepository.verifyUserWith2FA(email, password, code);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "72h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful" });
  } catch {
    res.status(500).json({ error: "Error logging in" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const resetLink = `https://yourapp.com/reset-password?email=${encodeURIComponent(email)}`;
    await sendPasswordReset(email, resetLink);
    res.json({ message: "Password reset instructions sent to email" });
  } catch {
    res.status(500).json({ error: "Error sending password reset instructions" });
  }
});

router.post("/reset-password/confirm", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await userRepository.updatePassword(email, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch {
    res.status(500).json({ error: "Error resetting password" });
  }
});

export default router;
