import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact";

import http from "http";
import { Server } from "socket.io";

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

let queue: string[] = []; // userId

const chatMap = new Map<string, { chatRoom: string; peerId: string }>(); // userId => { chatRoom, peerId }

const onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  const userId = socket.user?.uid;

  console.log("user:", userId);

  if (!userId) {
    socket.disconnect();
    return;
  }

  const userRoom = `user:${userId}`;
  socket.join(userRoom);

  onlineUsers.add(userId);
  socket.emit("online_count", onlineUsers.size);

  if (queue.includes(userId)) {
    io.to(userRoom).emit("waiting");
  }

  if (chatMap.has(userId)) {
    console.log("new socket: ", socket.id);
    const { chatRoom } = chatMap.get(userId) || {};

    if (!chatRoom) return;
    io.to(userRoom).socketsJoin(chatRoom);
    io.to(userRoom).emit("matched");
  }

  socket.on("find_match", () => {
    if (queue.length === 0) {
      queue.push(userId); // enqueue user
      io.to(userRoom).emit("waiting");
      // console.log("queue", queue);
    } else {
      if (queue.includes(userId) || chatMap.has(userId)) return;

      const peerId = queue.shift()!; // userId of peer

      const chatId = uuidv4(); // generate chatId

      const chatRoom = `chat:${chatId}`; // make chatRoom

      // set their chatRoom and their peerId
      chatMap.set(userId, { chatRoom, peerId });
      chatMap.set(peerId, { chatRoom, peerId: userId });

      console.log("chatMap on matched: ", chatMap);

      io.to(userRoom).socketsJoin(chatRoom);
      io.to(`user:${peerId}`).socketsJoin(chatRoom);

      io.to(userRoom).emit("matched");
      io.to(`user:${peerId}`).emit("matched");
    }
  });

  socket.on("typing", ({ typing }: { typing: boolean }) => {
    const { chatRoom } = chatMap.get(userId) || {};
    if (!chatRoom) return;

    socket.to(chatRoom).emit("typing", typing);
  });

  socket.on("send_message", ({ text }: { text: string }) => {
    const { chatRoom } = chatMap.get(userId) || {};
    if (!chatRoom) return;

    socket.to(chatRoom).emit("receive_message", {
      from: userId,
      text,
    });
  });

  socket.on("end_chat", () => {
    const { chatRoom, peerId } = chatMap.get(userId) || {};

    if (!chatRoom || !peerId) return;

    io.to(chatRoom).emit("chat_ended");

    console.log("chatRoom before: ", io.sockets.adapter.rooms.get(chatRoom));

    // clear the chatRoom
    io.in(chatRoom).socketsLeave(chatRoom);
    console.log("chatRoom now: ", io.sockets.adapter.rooms.get(chatRoom));

    chatMap.delete(userId);
    chatMap.delete(peerId);
    console.log("map after disconnect: ", chatMap);
  });

  // when a user close all their sockets (tabs)
  socket.on("disconnect", () => {
    const sockets = io.sockets.adapter.rooms.get(userRoom);
    if (Array.from(sockets || []).length === 0) {
      // remove from queue if waiting
      queue = queue.filter((uid) => uid !== userId);
      // console.log("queue after disconnect: ", queue);

      // remove chatRoom
      const { chatRoom, peerId } = chatMap.get(userId) || {};
      if (!chatRoom || !peerId) return;

      // inform the client that peer have disconnected (bye)
      io.to(chatRoom).emit("chat_ended");

      console.log(
        "sockets adapter chatRoom now: ",
        io.sockets.adapter.rooms.get(chatRoom)
      );

      // clear the chatRoom
      io.in(chatRoom).socketsLeave(chatRoom);

      console.log(
        "sockets adapter chatRoom now: ",
        io.sockets.adapter.rooms.get(chatRoom)
      );

      // remove from map
      chatMap.delete(userId);
      chatMap.delete(peerId);
      console.log("map after disconnect: ", chatMap);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
