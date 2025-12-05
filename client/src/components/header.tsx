// import { ModeToggle } from "./mode-toggle";
import LogoutButton from "./logout-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import DisconnectButton from "./disconnect-button";
import { useChat } from "./chat-context";
import { ModeButton } from "./mode-button";

export default function Header() {
  const { onlineCount } = useChat();
  return (
    <header className="bg-background flex flex-shrink-0 items-center justify-between gap-4 border-b-2 p-4">
      <h1 className="text-primary text-xl font-bold">Hive</h1>

      <div className="flex space-x-2">
        <div className="bg-card text-card-foreground flex items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap">
          <div className="bg-primary top-0 left-0 h-2 w-2 rounded-full"></div>
          online: {onlineCount}
        </div>
        {/* <ModeToggle /> */}
        <ModeButton />
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
              <DisconnectButton />
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
