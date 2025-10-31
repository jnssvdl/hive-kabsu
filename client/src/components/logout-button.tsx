import { Button } from "./ui/button";
import { socket } from "../lib/socket";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Disconnect Socket.IO
      if (socket.connected) {
        socket.disconnect();
      }

      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <Button
      onClick={logout}
      size={"icon"}
      variant={"ghost"}
      className="text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/20 hover:text-destructive"
    >
      <LogOut />
    </Button>
  );
}
