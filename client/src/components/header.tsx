import { useChat } from "./chat-context";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Unlink } from "lucide-react";
import LogoutButton from "./logout-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Header() {
  const { status, leaveRoom } = useChat();

  return (
    <header className="bg-background flex flex-shrink-0 items-center justify-between gap-4 border-b p-4">
      <h1 className="font-bold">chat.kabsu</h1>

      <div className="flex space-x-2">
        <ModeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <LogoutButton />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Log out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={leaveRoom}
                disabled={status !== "matched"}
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/20 dark:hover:bg-destructive/20 text-destructive hover:text-destructive"
              >
                <Unlink />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Disconnect</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
