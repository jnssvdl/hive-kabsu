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

// think about the structure of map i should use

// const map = new Map<string, Set<string>>(); // chatRoom => Set of userId

const userChatRoom = new Map<string, string>(); // userId => chatRoom

io.on("connection", (socket) => {
  const userId = socket.user?.uid;

  console.log("user:", userId);

  if (!userId) {
    socket.disconnect();
    return;
  }

  const userRoom = `user:${userId}`;
  socket.join(userRoom);

  // TODO: implement online count, create a new set or refer to userChatRoom map?
  socket.on("online_count", () => {});

  socket.on("find_match", () => {
    if (queue.length === 0) {
      queue.push(userId); // enqueue user
      // console.log("queue", queue);
    } else {
      if (queue.includes(userId)) return;

      const peerId = queue.shift()!; // userId of peer

      const chatId = uuidv4(); // generate chatId

      const chatRoom = `chat:${chatId}`; // make chatRoom

      userChatRoom.set(userId, chatRoom);
      userChatRoom.set(peerId, chatRoom);

      console.log("userChatRoom on matched: ", userChatRoom);

      // const users = new Set<string>();
      // users.add(userId);
      // users.add(peerId);
      // map.set(chatRoom, users);

      io.to(userRoom).socketsJoin(chatRoom);
      io.to(`user:${peerId}`).socketsJoin(chatRoom);

      io.to(userRoom).emit("matched", chatRoom);
      io.to(`user:${peerId}`).emit("matched", chatRoom);
    }
  });

  socket.on(
    "typing",
    ({ chatRoom, typing }: { chatRoom: string; typing: boolean }) => {
      if (!socket.rooms.has(chatRoom)) return;

      // real validation
      if (userChatRoom.get(userId) !== chatRoom) return;

      socket.to(chatRoom).emit("typing", typing);
    }
  );

  socket.on(
    "send_message",
    ({ chatRoom, text }: { chatRoom: string; text: string }) => {
      if (!socket.rooms.has(chatRoom) || !text) return;

      // real validation
      if (userChatRoom.get(userId) !== chatRoom) return;

      socket.to(chatRoom).emit("receive_message", {
        from: userId,
        text,
      });
    }
  );

  socket.on("leave_room", (chatRoom: string) => {
    if (!socket.rooms.has(chatRoom)) return;

    if (userChatRoom.get(userId) !== chatRoom) return;

    socket.to(chatRoom).emit("disconnected");

    console.log("chatRoom before: ", io.sockets.adapter.rooms.get(chatRoom));

    // io.in(userRoom).socketsLeave(chatRoom);

    // clear the chatRoom
    io.in(chatRoom).socketsLeave(chatRoom); // i think i should leave on chatRoom instead of userRoom

    console.log("chatRoom now: ", io.sockets.adapter.rooms.get(chatRoom));
  });

  // when a user close all their sockets (tabs)
  socket.on("disconnect", () => {
    const sockets = io.sockets.adapter.rooms.get(userRoom);
    if (Array.from(sockets || []).length === 0) {
      // remove from queue if waiting
      queue = queue.filter((uid) => uid !== userId);
      // console.log("queue after disconnect: ", queue);

      // remove chatRoom
      const chatRoom = userChatRoom.get(userId);
      if (chatRoom) {
        // inform the client that peer have disconnected (bye)
        socket.to(chatRoom).emit("disconnected");

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
      }

      // remove from map
      userChatRoom.delete(userId);
      console.log("map after disconnect: ", userChatRoom);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
