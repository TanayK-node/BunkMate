import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold shadow group ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-tr from-[hsl(var(--accent))] to-[hsl(var(--accent2))] text-foreground hover:brightness-105 active:scale-98",
        destructive: "bg-[hsl(var(--danger))] text-white hover:bg-[hsl(var(--danger),0.85)]",
        outline: "border border-input bg-transparent hover:bg-[hsl(var(--card))] text-foreground",
        secondary: "bg-gradient-to-tr from-[hsl(var(--accent2))] to-[hsl(var(--accent))] text-foreground hover:brightness-105",
        ghost: "hover:bg-input/50 hover:text-accent",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "transition-transform duration-200 active:scale-97")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
