import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useSocket } from "./socket-context";
import type { Message } from "../types/message";

/**
 * Chat statuses:
 * - idle: not in a chat
 * - waiting: searching for a match
 * - matched: connected with someone
 * - disconnected: the other person left
 * - left: you left the chat
 */
type Status = "idle" | "waiting" | "matched" | "disconnected" | "left";

type ChatState = {
  status: Status;
  isTyping: boolean;
  messages: Message[];
};

type ChatAction =
  | { type: "set_status"; payload: Status }
  | { type: "set_typing"; payload: boolean }
  | { type: "add_message"; payload: Message }
  | { type: "clear_chat" };

type ChatContextType = ChatState & {
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  findMatch: () => void;
  onlineCount: number;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const reducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "set_status":
      return { ...state, status: action.payload };
    case "set_typing":
      return { ...state, isTyping: action.payload };
    case "add_message":
      return { ...state, messages: [...state.messages, action.payload] };
    case "clear_chat":
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

  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const onMatched = () =>
      dispatch({ type: "set_status", payload: "matched" });
    const onDisconnected = () =>
      dispatch({ type: "set_status", payload: "disconnected" });

    const onTyping = (typing: boolean) =>
      dispatch({ type: "set_typing", payload: typing });
    const onMessage = (message: Message) =>
      dispatch({ type: "add_message", payload: message });

    socket.on("matched", onMatched);
    socket.on("disconnected", onDisconnected);

    socket.on("typing", onTyping);
    socket.on("receive_message", onMessage);

    socket.on("online_count", (count: number) => setOnlineCount(count));

    return () => {
      socket.off("matched", onMatched);
      socket.off("disconnected", onDisconnected);
      socket.off("typing", onTyping);
      socket.off("receive_message", onMessage);
    };
  }, [socket]);

  const findMatch = () => {
    dispatch({ type: "set_status", payload: "waiting" });
    dispatch({ type: "clear_chat" });
    socket.emit("find");
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("send_message", { message });
    dispatch({ type: "add_message", payload: { from: socket.id, message } });
  };

  const leaveRoom = () => {
    socket.emit("leave");
    dispatch({ type: "set_status", payload: "left" });
    // dispatch({ type: "clear_chat" });
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        findMatch,
        sendMessage,
        leaveRoom,
        onlineCount,
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
