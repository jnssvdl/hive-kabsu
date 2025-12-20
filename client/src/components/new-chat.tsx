import { useChat } from "./chat-context";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

type NewChatVariant = {
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

export default function NewChat({ variant }: NewChatVariant) {
  const { findMatch } = useChat();

  return (
    <Button onClick={findMatch} className="rounded-full" variant={variant}>
      <MessageCircle />
      New chat
    </Button>
  );
}
