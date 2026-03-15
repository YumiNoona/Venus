import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-bg-soft p-6 shadow-sm transition-all duration-200 hover:border-neutral-500 hover:-translate-y-1",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
