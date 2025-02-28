import { CircleX } from "lucide-react";
import { cn } from "~/lib/utils";

const ErrorMessage = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  if (!children) return null;
  return (
    <p
      className={cn("text-red-500 text-sm flex items-center gap-1", className)}
    >
      <span>
        <CircleX className="w-4 h-4" />
      </span>
      {children}
    </p>
  );
};

export default ErrorMessage;
