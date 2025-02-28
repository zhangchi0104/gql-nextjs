import { cn } from "~/lib/utils";

type FormLabelProps = {
  children: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

const FormLabel = ({ children, className, ...props }: FormLabelProps) => {
  return (
    <label {...props} className={cn("text-md font-medium", className)}>
      {children}
    </label>
  );
};

export default FormLabel;
