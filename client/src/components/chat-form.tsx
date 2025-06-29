import React, { useState } from "react";
import { useChat } from "./chat-context";
import { socket } from "@/lib/socket";

export default function ChatForm() {
  const { sendMessage, isMatched } = useChat();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    socket.emit("typing", { typing: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      socket.emit("typing", { typing: true });
    } else {
      socket.emit("typing", { typing: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isMatched) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
      setMessage("");
      socket.emit("typing", { typing: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <button type="submit" disabled={!isMatched}>
        Send
      </button>
    </form>
  );
}
