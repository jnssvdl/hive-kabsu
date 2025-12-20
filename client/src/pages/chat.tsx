import ChatForm from "@/components/chat-form";
import { useChat } from "@/components/chat-context";
import ChatBox from "@/components/chat-box";
import { Loader2, Unlink, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import TypingIndicator from "@/components/typing-indicator";
import Header from "@/components/header";
import StatusText from "@/components/status-text";
import NewChat from "@/components/new-chat";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const { status, isTyping, messages, cancelFind } = useChat();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, status]);

  return (
    <div className="from-secondary/60 to-background bg-gradient-to-t">
      <div className="mx-auto flex h-screen max-w-5xl flex-col md:p-4">
        <div className="bg-background flex flex-1 flex-col overflow-hidden md:rounded-2xl md:border-2">
          <Header />

          <div className="flex-1 overflow-y-auto p-4" ref={ref}>
            <div className="flex min-h-full flex-col justify-end">
              {status === "waiting" && (
                <div className="animate-in slide-in-from-bottom-20 space-y-4 duration-200">
                  <StatusText
                    Icon={Loader2}
                    text="Waiting for a kabushenyo you can chat with..."
                    iconClassName="animate-spin"
                  />
                  <div className="flex justify-center">
                    <Button
                      className="rounded-full"
                      variant={"destructive"}
                      onClick={cancelFind}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {status === "matched" && (
                <div className="animate-in slide-in-from-bottom-20 mb-4 space-y-4 duration-200">
                  <StatusText
                    Icon={Users}
                    text="You're connected! Start chatting now."
                  />
                </div>
              )}

              <ChatBox messages={messages} />
              {isTyping && <TypingIndicator />}

              {status === "chat_ended" && (
                <div className="animate-in slide-in-from-bottom-20 mt-4 space-y-4 duration-200">
                  <StatusText
                    Icon={Unlink}
                    text="Looks like the chat has ended! :("
                    className="text-destructive"
                  />
                  <div className="flex justify-center">
                    <NewChat variant={"outline"} />
                  </div>
                </div>
              )}

              {status === "idle" && (
                <div className="flex justify-center">
                  <NewChat variant={"default"} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-background border-t-2 p-4">
            <ChatForm />
          </div>
        </div>
      </div>
    </div>
  );
}
