import { CircleX } from "lucide-react";
import { cn } from "~/lib/utils";

const ErrorMessage = ({
  children,
  className,
  dataTestId,
}: {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
}) => {
  if (!children) return null;
  return (
    <p
      className={cn("text-red-500 text-sm flex items-center gap-1", className)}
      data-testid={dataTestId}
    >
      <span>
        <CircleX className="w-4 h-4" />
      </span>
      {children}
    </p>
  );
};

export default ErrorMessage;
