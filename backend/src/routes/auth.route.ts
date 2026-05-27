import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "change-me";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Dummy check for admin
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ id: 1, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
