import type { LucideIcon } from "lucide-react";

type StatusTextProps = {
  Icon: LucideIcon;
  text: string;
  className?: string;
  iconClassName?: string;
};

export default function StatusText({
  Icon,
  text,
  className,
  iconClassName,
}: StatusTextProps) {
  return (
    <p className={`flex items-center justify-center gap-2 ${className}`}>
      <Icon className={`h-4 w-4 ${iconClassName}`} />
      {text}
    </p>
  );
}
