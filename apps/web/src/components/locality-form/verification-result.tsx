import { LucideCircleCheck, LucideCircleX } from "lucide-react";
import { cn } from "~/lib/utils";

interface VerificationResultProps {
  className?: string;
  status: "pending" | "success" | "error";
  message: string;
}
const VerificationResult = ({
  className,
  status,
  message,
}: VerificationResultProps) => {
  if (status === "pending") {
    return null;
  }
  return (
    <div
      data-testid="locality-form__verification-result"
      className={cn(
        "text-sm flex items-center gap-1 flex-row justify-center",
        className,
        status === "success" ? "text-green-500" : "text-red-500",
      )}
    >
      <span>
        {status === "success" ? (
          <LucideCircleCheck className="w-4 h-4" />
        ) : (
          <LucideCircleX className="w-4 h-4" />
        )}
      </span>
      {message}
    </div>
  );
};

export default VerificationResult;
