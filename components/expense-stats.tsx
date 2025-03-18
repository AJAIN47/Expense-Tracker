"use client"

import { useExpenseStore } from "@/lib/expense-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { startOfMonth, endOfMonth, format } from "date-fns"

interface ExpenseStatsProps {
  className?: string
}

export function ExpenseStats({ className = "" }: ExpenseStatsProps) {
  // Get expenses from the store
  const { expenses } = useExpenseStore()

  // Calculate total expenses (sum of all expense amounts)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate this month's expenses
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  // Filter expenses for the current month and sum them
  const thisMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate average expense amount (if there are any expenses)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  // Find the largest single expense amount
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map((expense) => expense.amount)) : 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Total expenses card */}
      <Card className="overflow-hidden border-primary/10 shadow-lg">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use gradient text for emphasis */}
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            ${totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime total across {expenses.length} expenses</p>
        </CardContent>
      </Card>

      {/* This month's expenses card */}
      <Card className="overflow-hidden border-secondary/10 shadow-lg">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">
            This Month ({format(today, "MMMM yyyy")})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">${thisMonthExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Average and largest expense cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Average expense card */}
        <Card className="overflow-hidden border-accent/10 shadow-lg">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-accent">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-accent">${averageExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Largest expense card */}
        <Card className="overflow-hidden border-primary/10 shadow-lg">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Largest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">${largestExpense.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

