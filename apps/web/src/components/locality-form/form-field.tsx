import { cn } from "~/lib/utils";

type FormFieldProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const FormField = ({
  children,
  className,
  ...props
}: FormFieldProps) => {
  return (
    <div {...props} className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};
