import { ModeToggle } from "./mode-toggle";
import LogoutButton from "./logout-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import DisconnectButton from "./disconnect-button";

export default function Header() {
  return (
    <header className="bg-background flex flex-shrink-0 items-center justify-between gap-4 border-b-2 p-4">
      <h1 className="text-primary font-bold">Hive</h1>

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
