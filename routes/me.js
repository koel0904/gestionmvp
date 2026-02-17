import express from "express";
import authenticateToken from "../middleware/middleware.js";
import userRepository from "../repositories/user.js";

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Error fetching user" });
  }
});

export default router;
