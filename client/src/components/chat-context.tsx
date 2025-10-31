import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useSocket } from "./socket-context";
import type { Message } from "../types/message";

type Status = "idle" | "waiting" | "matched" | "disconnected";

type ChatState = {
  status: Status;
  isTyping: boolean;
  messages: Message[];
};

type ChatAction =
  | { type: "set_status"; payload: Status }
  | { type: "typing"; payload: boolean }
  | { type: "add_message"; payload: Message }
  | { type: "reset" };

type ChatContextType = ChatState & {
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  findMatch: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const reducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "set_status":
      return { ...state, status: action.payload };
    case "typing":
      return { ...state, isTyping: action.payload };
    case "add_message":
      return { ...state, messages: [...state.messages, action.payload] };
    case "reset":
      return { ...state, messages: [] };
  }
};

const initialState: ChatState = {
  status: "idle",
  isTyping: false,
  messages: [],
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const onWaiting = () =>
      dispatch({ type: "set_status", payload: "waiting" });
    const onMatched = () =>
      dispatch({ type: "set_status", payload: "matched" });
    const onDisconnected = () =>
      dispatch({ type: "set_status", payload: "disconnected" });
    const onTyping = (typing: boolean) =>
      dispatch({ type: "typing", payload: typing });
    const onMessage = (message: Message) =>
      dispatch({ type: "add_message", payload: message });

    socket.on("waiting", onWaiting);
    socket.on("matched", onMatched);
    socket.on("disconnected", onDisconnected);
    socket.on("typing", onTyping);
    socket.on("message", onMessage);

    return () => {
      socket.off("waiting", onWaiting);
      socket.off("matched", onMatched);
      socket.off("disconnected", onDisconnected);
      socket.off("typing", onTyping);
      socket.off("message", onMessage);
    };
  }, [socket]);

  const findMatch = () => {
    dispatch({ type: "set_status", payload: "waiting" });
    dispatch({ type: "reset" });
    socket.emit("find");
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("message", { message });
    dispatch({ type: "add_message", payload: { from: socket.id, message } });
  };

  const leaveRoom = () => {
    socket.emit("leave");
    dispatch({ type: "set_status", payload: "idle" });
    // dispatch({ type: "reset" });
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
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
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
