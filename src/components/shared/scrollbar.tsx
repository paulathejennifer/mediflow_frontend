import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/60 pr-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Scrollbar.displayName = "Scrollbar"

export { Scrollbar }
