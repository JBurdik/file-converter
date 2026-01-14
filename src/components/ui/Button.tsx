import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles matching your app's feel
  "inline-flex items-center justify-center font-medium select-none transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        // Primary - uses CSS variables from styles.css for easy customization
        default:
          "bg-gradient-to-b from-[var(--button-gradient-from)] to-[var(--button-gradient-to)] text-white rounded-[var(--button-radius)] shadow-[var(--button-shadow)] hover:shadow-[var(--button-shadow-hover)] hover:from-[var(--button-gradient-hover-from)] hover:to-[var(--button-gradient-hover-to)] active:scale-[0.98]",
        // Secondary - bordered style
        secondary:
          "border border-border bg-white text-foreground rounded-[var(--button-radius)] hover:bg-muted active:scale-[0.98]",
        // Outline - similar to secondary but more subtle
        outline:
          "border border-border bg-background text-foreground rounded-[var(--button-radius)] hover:bg-muted active:scale-[0.98]",
        // Ghost - minimal, text-only feel
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-muted rounded-[var(--button-radius)] active:scale-[0.98]",
        // Destructive - red danger style
        destructive:
          "text-destructive hover:text-destructive hover:bg-destructive/10 rounded-[var(--button-radius)] active:scale-[0.98]",
        // Link - underline style
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 gap-2 text-base",
        sm: "h-9 px-4 gap-1.5 text-sm",
        lg: "h-12 px-8 gap-2 text-base",
        icon: "size-9 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
