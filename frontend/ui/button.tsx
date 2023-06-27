import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { IconLoader2 } from "@tabler/icons-react";
import { cva, VariantProps } from "cva";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

const buttonVariants = cva(
  "gap-x-2 inline-flex items-center justify-center transition-all rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive-foreground text-white hover:bg-destructive-foreground/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        subtle:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        blue: "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-700",
        yellow:
          "bg-yellow-300 dark:bg-yellow-400 text-neutral-900 dark:text-neutral-900 hover:bg-yellow-400 dark:hover:bg-yellow-500 dark:hover:active:bg-yellow-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        xxs: "h-6 px-1 rounded-md",
        xs: "h-8 px-3 rounded-md",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      disabled,
      loading,
      icon,
      children,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        aria-busy={loading}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && <IconLoader2 className="h-4 w-4 animate-spin" />}
        {icon}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
