import * as React from "react"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartPie = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[]
    category: string
    index: string
    valueFormatter?: (value: number) => string
    colors: string[]
  }
>(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
ChartPie.displayName = "ChartPie"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "absolute z-10 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md animate-in fade-in",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    formatValues?: (value: number) => string
  }
>(({ className, formatValues, children, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col space-y-1", className)} ref={ref} {...props}>
      {children}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex flex-col space-y-2", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color: string
    name: string
  }
>(({ className, color, name, ...props }, ref) => {
  return (
    <div className={cn("flex items-center space-x-2", className)} ref={ref} {...props}>
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{name}</span>
    </div>
  )
})
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartLegend, ChartLegendItem, ChartPie, ChartTooltip, ChartTooltipContent }

