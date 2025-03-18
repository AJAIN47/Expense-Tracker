"use client"

import { useState } from "react"
import { useExpenseStore } from "@/lib/expense-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartPie,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, subMonths, eachDayOfInterval, isSameDay } from "date-fns"

export function ExpenseCharts() {
  // Get expenses and categories from the store
  const { expenses, categories } = useExpenseStore()

  // State for the selected time range in the trend chart
  const [timeRange, setTimeRange] = useState("month")

  // Prepare data for category pie chart
  // Map categories to their total expense amounts and filter out those with no expenses
  const categoryData = categories
    .map((category) => {
      // Calculate total amount for this category
      const totalAmount = expenses
        .filter((expense) => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0)

      return {
        name: category.name,
        value: totalAmount,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0) // Only include categories with expenses

  /**
   * Generate time series data based on the selected time range
   * Returns an array of objects with date and amount properties
   */
  const getTimeSeriesData = () => {
    const today = new Date()
    let startDate, endDate, dateFormat

    // Set date range and format based on selected time range
    if (timeRange === "week") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 6) // Last 7 days
      endDate = today
      dateFormat = "EEE" // Day of week (e.g., Mon, Tue)
    } else if (timeRange === "month") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 29) // Last 30 days
      endDate = today
      dateFormat = "MMM d" // Month and day (e.g., Jan 1)
    } else {
      // year
      startDate = subMonths(today, 11) // Last 12 months
      endDate = today
      dateFormat = "MMM" // Month name (e.g., Jan, Feb)
    }

    // Create array of all dates in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    // Map each date to its total expense amount
    const expensesByDate = dateRange.map((date) => {
      // Find expenses for this date
      const dayExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return isSameDay(expenseDate, date)
      })

      // Sum the amounts
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        date: format(date, dateFormat),
        amount: totalAmount,
        fullDate: date,
      }
    })

    // For year view, aggregate by month
    if (timeRange === "year") {
      const monthlyData = {}
      expensesByDate.forEach((item) => {
        const month = format(item.fullDate, "MMM")
        if (!monthlyData[month]) {
          monthlyData[month] = { date: month, amount: 0 }
        }
        monthlyData[month].amount += item.amount
      })
      return Object.values(monthlyData)
    }

    return expensesByDate
  }

  // Get the time series data for the selected range
  const timeSeriesData = getTimeSeriesData()

  return (
    <div className="space-y-6">
      {/* Category pie chart */}
      <Card className="overflow-hidden border-primary/10 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </span>
            Expenses by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-80">
              <ChartContainer>
                <Chart className="h-80">
                  <ChartPie
                    data={categoryData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `$${value.toFixed(2)}`}
                    colors={categoryData.map((item) => item.color)}
                    className="h-80 animate-float"
                  />
                  <ChartTooltip>
                    <ChartTooltipContent formatValues={(value) => `$${value.toFixed(2)}`} />
                  </ChartTooltip>
                </Chart>
                <ChartLegend className="max-h-40 overflow-y-auto">
                  {categoryData.map((item) => (
                    <ChartLegendItem
                      key={item.name}
                      color={item.color}
                      name={`${item.name}: $${item.value.toFixed(2)}`}
                    />
                  ))}
                </ChartLegend>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense trends chart */}
      <Card className="overflow-hidden border-secondary/10 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full"></div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-secondary flex items-center">
            <span className="bg-secondary/10 text-secondary p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Expense Trends
          </CardTitle>
          {/* Time range selector */}
          <Tabs defaultValue="month" value={timeRange} onValueChange={setTimeRange} className="relative z-10">
            <TabsList className="bg-secondary/10">
              <TabsTrigger value="week" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  {/* Gradient definition for the area fill */}
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(328, 75%, 60%)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(328, 75%, 60%)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(328, 75%, 60%)"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

