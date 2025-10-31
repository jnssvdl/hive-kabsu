import { useChat } from "./chat-context";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function NewChat() {
  const { findMatch } = useChat();

  return (
    <Button onClick={findMatch} className="rounded-full">
      <MessageCircle />
      New chat
    </Button>
  );
}
