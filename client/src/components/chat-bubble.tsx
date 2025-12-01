import { socket } from "@/lib/socket";
import type { Message } from "@/types/message";

export default function ChatBubble({ message }: { message: Message }) {
  const isMe = message.from === socket.id;

  return (
    <div
      className={`flex transition-all duration-200 ease-in-out ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-full transform rounded-2xl px-4 py-2 break-words ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-tl-none"
        } scale-100 opacity-100 transition-all duration-200 ease-in-out`}
      >
        {message.message}
      </div>
    </div>
  );
}
