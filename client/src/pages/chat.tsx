import ChatForm from "@/components/chat-form";
import { useChat } from "@/components/chat-context";
import ChatBox from "@/components/chat-box";
import { Loader2, Unlink, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import TypingIndicator from "@/components/typing-indicator";
import Header from "@/components/header";
import StatusText from "@/components/status-text";
import NewChat from "@/components/new-chat";

export default function Chat() {
  const { status, isTyping, messages } = useChat();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, status]);

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col md:p-4">
      <div className="bg-card/20 flex flex-1 flex-col overflow-hidden border md:rounded-2xl">
        <Header />

        <div className="flex-1 overflow-y-auto p-4" ref={ref}>
          <div className="flex min-h-full flex-col justify-end gap-2">
            {status === "waiting" && (
              <StatusText
                Icon={Loader2}
                text="Waiting someone you can chat with..."
                iconClassName="animate-spin"
              />
            )}

            {status === "matched" && (
              <StatusText
                Icon={Users}
                text="You're connected! Say hi to them!"
              />
            )}

            <ChatBox messages={messages} />
            {isTyping && <TypingIndicator />}

            {status === "disconnected" && (
              <>
                <StatusText
                  Icon={Unlink}
                  text="They have disconnected!"
                  className="text-destructive"
                />
                <div className="flex justify-center">
                  <NewChat />
                </div>
              </>
            )}

            {status === "idle" && (
              <div className="flex justify-center">
                <NewChat />
              </div>
            )}
          </div>
        </div>

        <div className="bg-background border-t p-4">
          <ChatForm />
        </div>
      </div>
    </div>
  );
}
