import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/ping", (_, res) => res.send("pong"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("Token from client:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid JWT on socket", err);
    next(new Error("Authentication error"));
  }
});

// Socket connection
io.on("connection", (socket) => {
  const user = socket.data.user;
  console.log("✅ Connected:", socket.id, user.email);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
