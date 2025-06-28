import { socket } from "../lib/socket";
import ChatForm from "../components/chat-form";
import { useChat } from "../components/chat-context";
import { useEffect, useRef } from "react";

export default function Chat() {
  const {
    isWaiting,
    isMatched,
    isDisconnected,
    messages,
    findMatch,
    leaveRoom,
  } = useChat();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-10 flex justify-between border p-2">
        <h1 className="text-xl font-bold">Matchmaker</h1>
        <button onClick={leaveRoom} disabled={!isMatched}>
          Leave
        </button>
      </header>

      <main className="flex flex-1 flex-col-reverse space-y-2 space-y-reverse overflow-y-auto p-2">
        {isWaiting && <p>Waiting for a match...</p>}

        {!isMatched && !isWaiting && (
          <button onClick={findMatch}>Find a Match</button>
        )}

        {isDisconnected && !isMatched && <p>They have disconnected</p>}

        <ul className="space-y-2">
          {messages.map((m, i) => {
            const isMe = m.from === socket.id;
            return (
              <li
                key={i}
                className={`flex transition-all duration-200 ease-in-out ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs transform rounded-2xl px-4 py-2 text-sm break-words shadow ${isMe ? "rounded-br-none bg-blue-500 text-white" : "rounded-bl-none bg-gray-200 text-black"} scale-100 opacity-100 transition-all duration-200 ease-in-out`}
                >
                  {m.message}
                </div>
              </li>
            );
          })}
        </ul>

        {!isWaiting && isMatched && <p>Match found! Chat now</p>}
        <div ref={bottomRef} />
      </main>

      <footer className="bg-background sticky bottom-0 z-10 border-t p-2">
        <ChatForm />
      </footer>
    </div>
  );
}
