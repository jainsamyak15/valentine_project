import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-rose-600 text-amber-100 hover:bg-rose-700",
        secondary: "border border-rose-300 text-rose-700 bg-rose-100 hover:bg-rose-200",
        destructive: "border-transparent bg-rose-800 text-rose-200 hover:bg-rose-900",
        outline: "border border-rose-400 text-rose-600 hover:bg-rose-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
