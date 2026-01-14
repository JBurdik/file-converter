import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center font-medium select-none transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-blue disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-blue-light to-brand-blue text-white shadow-[0_4px_12px_rgba(45,136,255,0.3)] hover:shadow-[0_6px_16px_rgba(45,136,255,0.4)] hover:from-[#5AA8FF] hover:to-brand-blue-light active:scale-[0.98]",
        secondary:
          "border border-border-light bg-white text-text-primary hover:bg-gray-50 active:scale-[0.98]",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-gray-100 active:scale-[0.98]",
        danger:
          "text-red-500 hover:text-red-600 hover:bg-red-50 active:scale-[0.98]",
        link:
          "text-text-secondary hover:text-text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
        md: "h-11 px-5 text-base rounded-[10px] gap-2",
        lg: "h-12 px-8 py-4 text-base rounded-[10px] gap-2",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
