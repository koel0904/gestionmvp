import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const SECRET = process.env.SECRET;
const prisma = new PrismaClient();

async function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Authenticating token:", { token });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;

    // Defense in depth: check if user account is still active
    if (decoded.userType === "user") {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { active: true },
      });

      if (!user || user.active === false) {
        return res.status(403).json({
          error:
            "Cuenta desactivada. Contacte a soporte o al/la dueñ@ del negocio.",
          inactive: true,
        });
      }
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden" });
  }
}

export default authenticateToken;
