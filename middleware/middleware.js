import userRepository from "../repositories/user.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

async function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken;
