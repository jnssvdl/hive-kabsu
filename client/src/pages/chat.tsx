import ChatForm from "@/components/chat-form";
import { useChat } from "@/components/chat-context";
import ChatBox from "@/components/chat-box";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import TypingIndicator from "@/components/typing-indicator";
import Header from "@/components/header";
import StatusText from "@/components/status-text";

export default function Chat() {
  const { status, isTyping, messages, findMatch } = useChat();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex h-screen justify-center lg:p-4">
      <div className="flex w-full max-w-5xl flex-col border shadow">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-end gap-2 p-4">
            {status === "matched" && (
              <StatusText
                Icon={Users}
                text="You're connected! Say hi to them!"
              />
            )}

            {status === "waiting" && (
              <StatusText
                Icon={Loader2}
                text="Waiting someone you can chat with..."
                iconClassName="animate-spin"
              />
            )}

            <ChatBox messages={messages} />

            {isTyping && <TypingIndicator />}

            {status === "disconnected" && (
              <StatusText
                Icon={Loader2}
                text="Waiting someone you can chat with..."
                className="text-destructive"
              />
            )}

            {status === "idle" && (
              <div className="flex justify-center">
                <Button onClick={findMatch} className="rounded-full">
                  <MessageCircle />
                  <span>New chat</span>
                </Button>
              </div>
            )}

            <div ref={ref}></div>
          </div>
        </div>

        <div className="bg-background sticky bottom-0 border-t p-4">
          <ChatForm />
        </div>
      </div>
    </div>
  );
}
