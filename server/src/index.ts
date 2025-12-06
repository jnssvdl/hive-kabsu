import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact";

import http from "http";
import { Server, Socket } from "socket.io";

import { v4 as uuidv4 } from "uuid";
import path from "path";
import { authenticateSocket } from "./middleware/authenticate-socket";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// serve client
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

app.use("/api/contact", contactRoutes);
app.get("/api/ping", (_, res) => res.send("pong"));

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// socket io middleware
io.use(authenticateSocket);

let queue: Socket[] = [];

let userQueue: string[] = [];

const onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  const user = socket.user;

  if (user) {
    onlineUsers.add(user.uid);
    io.emit("online_count", onlineUsers.size);
  }

  socket.on("find", () => {
    if (queue.length === 0) {
      // No partner yet, enqueue self
      queue.push(socket);
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
      from: socket.id, // TODO: Find a way to use user.uid instead of socket.id for everything
      message,
    });
  });

  socket.on("leave", () => {
    queue = queue.filter((s) => s !== socket);

    const room = socket.data.room;

    if (room) {
      socket.to(room).emit("disconnected");
      delete socket.data.room;
      socket.leave(room);
    }
  });

  socket.on("disconnect", () => {
    if (user) {
      onlineUsers.delete(user.uid);
      io.emit("online_count", onlineUsers.size);
    }

    queue = queue.filter((s) => s !== socket);

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
