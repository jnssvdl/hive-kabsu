import React, { useState } from "react";
import { useChat } from "./chat-context";
import { socket } from "@/lib/socket";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import { Input } from "./ui/input";

export default function ChatForm() {
  const { sendMessage, status } = useChat();
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
      // setTimeout(() => {
      //   socket.emit("typing", { typing: false });
      // }, 2000);
    } else {
      socket.emit("typing", { typing: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status !== "matched") return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
      setMessage("");
      socket.emit("typing", { typing: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="rounded-full"
      />
      <Button type="submit" disabled={status !== "matched"} size="icon">
        <SendHorizonal />
      </Button>
    </form>
  );
}
