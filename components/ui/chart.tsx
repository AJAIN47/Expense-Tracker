import * as React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  name: string
}

export interface ChartPieProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name: string
    value: number
    color: string
  }[]
  category?: string
  index?: string
  colors: string[]
  valueFormatter?: (value: number) => string
}

export interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  formatValues?: (value: number) => string
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)} ref={ref} {...props} />
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(({ className, ...props }, ref) => {
  return <div className={cn("space-y-2", className)} ref={ref} {...props} />
})
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ className, color, name, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-2", className)} ref={ref} {...props}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
        <div className="text-sm">{name}</div>
      </div>
    )
  }
)
ChartLegendItem.displayName = "ChartLegendItem"

const ChartPie = React.forwardRef<HTMLDivElement, ChartPieProps>(
  ({ className, data, category, index, valueFormatter, colors, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    const tooltip = (data: { payload?: any[]; label?: string }) => {
      if (!data.payload) return null
      const active = data.payload[0]
      if (!active) return null
      const item = active.payload
      const { name, value, color } = item
      if (!item) return null

      return (
        <div className="absolute pointer-events-none z-10">
          <span className="block p-2 text-sm rounded-md bg-popover">
            {/* Display the index name */}
            <span className="font-semibold block">{index}</span>
            {/* Display the formatted value */}
            <span className="block text-muted-foreground">
             {valueFormatter ? valueFormatter(value) : value}
            </span>
          </span>
        </div>
      )
    }
    return (
      <div className={cn("w-full h-full", className)} ref={ref} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              dataKey={category}
              nameKey={index}
              innerRadius={"60%"}
              outerRadius={"80%"}
              fill="#8884d8"
              paddingAngle={0.5}
              activeIndex={activeIndex}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={tooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
ChartPie.displayName = "ChartPie"

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(({ children, className, ...props }, ref) => {
  return <div className={cn("absolute z-20", className)} ref={ref} {...props}>{children}</div>
})
ChartTooltip.displayName = "ChartTooltip"
const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ formatValues, className, ...props }, ref) => {
    return (
      <div className={cn("text-sm bg-popover rounded-md p-2 border", className)} ref={ref} {...props}>
         {props.children}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartContainer, ChartLegend, ChartLegendItem, ChartPie, ChartTooltip, ChartTooltipContent }
