import { Router } from "express";
import jwt from "jsonwebtoken";
import { firebaseAdminAuth } from "../lib/firebase-admin";

const router = Router();

router.post("/firebase", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);

    if (!decoded.email?.endsWith("@cvsu.edu.ph")) {
      return res.status(403).json({ message: "Email not allowed" });
    }

    const appJwt = jwt.sign(
      { uid: decoded.uid, email: decoded.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return res.json({ token: appJwt });
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
});

export default router;
