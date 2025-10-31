export default function TypingIndicator() {
  return (
    <div className="bg-muted inline-flex max-w-fit items-center space-x-1 rounded-full p-4">
      <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
      <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
      <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
    </div>
  );
}
