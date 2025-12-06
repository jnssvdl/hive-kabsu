import { Socket } from "socket.io";
import { firebaseAdminAuth } from "../lib/firebase-admin";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = await firebaseAdminAuth.verifyIdToken(token);

    if (
      process.env.NODE_ENV === "production" &&
      !decoded.email?.endsWith("@cvsu.edu.ph")
    ) {
      return next(new Error("Unauthorized domain"));
    }

    socket.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    next(new Error("Invalid token"));
  }
};
