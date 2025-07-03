import type React from "react";
import { cn } from "~/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ReusableButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const LandingUsableButton = forwardRef<HTMLButtonElement, ReusableButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-black text-white hover:bg-gray-800": variant === "primary",
            "border border-gray-200 bg-white text-black hover:bg-gray-100":
              variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-50":
              variant === "outline",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-6 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
LandingUsableButton.displayName = "ReusableButton";

export { LandingUsableButton };
