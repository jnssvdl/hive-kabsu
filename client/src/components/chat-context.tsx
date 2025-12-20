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
 * - ended: you or the other person ended the chat
 */
type Status = "idle" | "waiting" | "matched" | "chat_ended";

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
  endChat: () => void;
  findMatch: () => void;
  cancelFind: () => void;
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
    default:
      return state;
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
    const onWaiting = () => {
      dispatch({ type: "set_status", payload: "waiting" }); // when user is already waiting
      dispatch({ type: "clear_chat" });
    };

    const onMatched = () => {
      dispatch({ type: "set_status", payload: "matched" });
    };

    const onChatEnded = () => {
      dispatch({ type: "set_status", payload: "chat_ended" });
    };

    const onTyping = ({ typing }: { typing: boolean }) => {
      dispatch({ type: "set_typing", payload: typing });
    };

    const onReceiveMessage = (message: Message) => {
      dispatch({ type: "add_message", payload: message });
    };

    socket.on("waiting", onWaiting);

    socket.on("matched", onMatched);
    socket.on("chat_ended", onChatEnded);

    socket.on("typing", onTyping);
    socket.on("receive_message", onReceiveMessage);

    socket.on("online_count", (count: number) => setOnlineCount(count));

    return () => {
      socket.off("waiting", onWaiting);
      socket.off("matched", onMatched);
      socket.off("chat_ended", onChatEnded);
      socket.off("typing", onTyping);
      socket.off("receive_message", onReceiveMessage);
    };
  }, [socket]);

  const findMatch = () => {
    dispatch({ type: "clear_chat" });
    socket.emit("find_match");
  };

  const cancelFind = () => {
    if (state.status !== "waiting") return;
    socket.emit("cancel_find");
    dispatch({ type: "set_status", payload: "idle" });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    socket.emit("send_message", { text });
    // dispatch({ type: "add_message", payload: { fromMe: true, text } });
  };

  const endChat = () => {
    socket.emit("end_chat");
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        findMatch,
        sendMessage,
        endChat,
        cancelFind,
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
