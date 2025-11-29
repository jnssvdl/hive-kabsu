import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contact";

import http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import { parse } from "cookie";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "http://localhost:3000"
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const cookies = parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    if (!token) return next(new Error("No auth token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.error("Socket auth failed:", err);
    next(new Error("Authentication error"));
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// serve client
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

app.get("/api/ping", (_, res) => res.send("pong"));

const queue: Socket[] = [];

io.on("connection", (socket) => {
  socket.on("find", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }

    if (queue.length === 0) {
      // No partner yet, enqueue self
      queue.push(socket);
      // socket.emit("waiting");
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

  socket.on("typing", (typing: boolean) => {
    const room = socket.data.room;
    if (!room) return;

    socket.to(room).emit("typing", typing);
  });

  socket.on("send_message", ({ message }) => {
    if (!message) return;

    const room = socket.data.room;

    socket.to(room).emit("receive_message", {
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
