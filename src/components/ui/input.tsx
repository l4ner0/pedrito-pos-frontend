import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, endAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-secondary px-5 py-3 text-sm text-foreground",
            "placeholder:text-muted-foreground outline-none",
            "focus:ring-2 focus:ring-primary/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            endAdornment && "pr-12",
            className,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-4 top-0 bottom-0 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
