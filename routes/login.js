import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.js";
import MailRepository from "../repositories/mail.js";
import authenticateToken from "../middleware/middleware.js";

const SECRET = process.env.SECRET;
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email });

  try {
    const user = await userRepository.verifyUser(email, password);

    // Account deactivated — block before 2FA
    if (user && user.inactive) {
      return res.status(403).json({
        error:
          "Cuenta desactivada. Contacte a soporte o al/la dueñ@ del negocio.",
        inactive: true,
      });
    }

    if (!user || user === false) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await userRepository.afSetCode(email, code);
    await MailRepository.send2FACode(email, code);
    console.log(`2FA code for ${email}: ${code}`);
    res.json({ message: "2FA code sent to email" }).status(200);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Error verifying user" });
  }
});

router.post("/login/2fa", async (req, res) => {
  const { email, code } = req.body;
  console.log("2FA login attempt:", { email, code });
  try {
    /*if (!email || !password || !code) {
      return res.status(400).json({ error: "Email, password and 2FA code are required" });
    }

    if ( email.find("@") === -1 || password.length < 6 || code.length !== 6) {
      return res.status(400).json({ error: "Invalid email, password or 2FA code format" });
    } */

    const user = await userRepository.verify2FACode(email, code);

    // Defense in depth: re-check active status at 2FA step
    if (user && user.inactive) {
      return res.status(403).json({
        error:
          "Cuenta desactivada. Contacte a soporte o al/la dueñ@ del negocio.",
        inactive: true,
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("2FA verification successful for:", user);
    const token = jwt.sign({ userId: user.id, userType: user.type }, SECRET, {
      expiresIn: "132h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 132 * 60 * 60 * 1000, // 132 hours
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
    await MailRepository.sendPasswordReset(email, resetLink);
    res.json({ message: "Password reset instructions sent to email" });
  } catch {
    res
      .status(500)
      .json({ error: "Error sending password reset instructions" });
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

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType || "user";
    const user = await userRepository.getUserById(userId, userType);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // included role if exists
      position: user.position || null, // expose position to frontend
      permissions: user.permissions,
      type: userType, // also expose if owner or user
    };
    console.log(`[DEBUG] GET /me resolved for ${safeUser.email}. Position is: "${safeUser.position}"`);
    return res.json({ user: safeUser });
  } catch {
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType || "user";
    const { name, email, position } = req.body;

    // Verificar si el correo ya pertenece a otro
    if (email) {
      const existingEmail = await userRepository.getUserByEmail(email);
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ error: "Este correo ya está en uso" });
      }
    }

    const updatedUser = await userRepository.updateProfile(userId, userType, {
      name,
      email,
      position
    });

    return res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "No se pudo actualizar el perfil" });
  }
});

export default router;
