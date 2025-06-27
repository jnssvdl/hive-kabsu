import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

import http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/ping", (_, res) => res.send("pong"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  // console.log("Token from client:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid JWT on socket", err);
    next(new Error("Authentication error"));
  }
});

const queue: Socket[] = [];

io.on("connection", (socket) => {
  socket.on("find", () => {
    socket.rooms.clear();
    if (queue.includes(socket)) {
      return;
    }

    if (queue.length === 0) {
      // No partner yet, enqueue self
      queue.push(socket);
      socket.emit("waiting");
    } else {
      const partner = queue.shift()!;

      const room = uuidv4();

      socket.join(room);
      partner.join(room);

      socket.data.room = room;
      partner.data.room = room;

      socket.emit("matched");
      partner.emit("matched");
    }
  });

  socket.on("message", ({ message }) => {
    if (!message) return;

    const room = socket.data.room;

    socket.to(room).emit("message", {
      from: socket.id,
      message,
    });
  });

  socket.on("leave", () => {
    const index = queue.indexOf(socket);

    if (index !== -1) {
      queue.splice(index, 1);
    }

    const room = socket.data.room;

    if (room) {
      socket.to(room).emit("disconnected");
      delete socket.data.room;
      socket.leave(room);
    }
  });

  socket.on("disconnect", () => {
    const index = queue.indexOf(socket);

    if (index !== -1) {
      queue.splice(index, 1);
    }

    const room = socket.data.room;
    if (room) {
      socket.to(room).emit("disconnected");
      delete socket.data.room;
      socket.leave(room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
