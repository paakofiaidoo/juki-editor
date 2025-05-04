import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function Button({ className, children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={
        cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )
      }
      disabled={isLoading}
      {...props}
    >
      {isLoading && <span className="mr-2 h-4 w-4 animate-spin"></span>}
      {children}
    </button>
  )
}