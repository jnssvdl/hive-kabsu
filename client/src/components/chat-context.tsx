import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import type { Message } from "../types/message";

type ChatContextType = {
  isConnected: boolean;
  isWaiting: boolean;
  isMatched: boolean;
  isDisconnected: boolean;
  messages: Message[];
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  findMatch: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onWaiting = () => setIsWaiting(true);
    const onMatched = () => {
      setIsWaiting(false);
      setIsMatched(true);
    };
    const onDisconnected = () => {
      setIsMatched(false);
      setIsDisconnected(true);
    };
    const onMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("waiting", onWaiting);
    socket.on("matched", onMatched);
    socket.on("disconnected", onDisconnected);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      socket.off("waiting", onWaiting);
      socket.off("matched", onMatched);
      socket.off("disconnected", onDisconnected);
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, []);

  const findMatch = () => {
    setMessages([]);
    setIsMatched(false);
    setIsDisconnected(false);
    socket.emit("find");
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("message", { message });
    setMessages((prevMessages) => [
      ...prevMessages,
      { from: socket.id, message },
    ]);
  };

  const leaveRoom = () => {
    socket.emit("leave");
    setIsWaiting(false);
    setIsMatched(false);
    setIsDisconnected(false);
  };

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        isWaiting,
        isMatched,
        isDisconnected,
        messages,
        findMatch,
        sendMessage,
        leaveRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};
