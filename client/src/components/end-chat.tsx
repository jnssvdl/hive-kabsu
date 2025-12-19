import { useChat } from "./chat-context";
import { Button } from "./ui/button";
import { Unlink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EndChat() {
  const { status, endChat } = useChat();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={status !== "matched"}
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/20 dark:hover:bg-destructive/20 text-destructive hover:text-destructive"
        >
          <Unlink />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to end the chat?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be disconnected from the chat. If you'd like, you can say
            goodbye before disconnecting, or just disconnect if you prefer to
            leave now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={endChat} asChild>
            <Button variant={"destructive"}>End chat</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
