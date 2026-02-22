import express from "express";
import authenticateToken from "../middleware/middleware.js";
import userRepository from "../repositories/user.js";

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    // The authenticateToken middleware decodes the JWT and attaches the payload to req.user
    const userId = req.user.userId;
    const user = await userRepository.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return only safe user data (e.g., id, email, name) without sensitive info
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return res.json({ user: safeUser });
  } catch {
    res.status(500).json({ error: "Error fetching user" });
  }
});

export default router;
