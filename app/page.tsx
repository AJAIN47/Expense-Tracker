"use client"

import { useEffect } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseStats } from "@/components/expense-stats"
import { ExpenseCharts } from "@/components/expense-charts"
import { ExpenseHeader } from "@/components/expense-header"
import { ExpenseControls } from "@/components/expense-controls"
import { useExpenseStore } from "@/lib/expense-store"
import { useThemeStore } from "@/lib/theme-store"

export default function Home() {
  const { expenses, loadMockData, hasMockDataLoaded } = useExpenseStore()
  const { theme } = useThemeStore()

  // Load mock data if no expenses exist and mock data hasn't been loaded yet
  useEffect(() => {
    if (expenses.length === 0 && !hasMockDataLoaded) {
      loadMockData()
    }
  }, [expenses.length, loadMockData, hasMockDataLoaded])

  // Apply theme class to document element
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 ${theme}`}
    >
      <ExpenseHeader />

      <main className="container mx-auto px-4 py-8">
        <ExpenseControls className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6" onClick={(e) => e.stopPropagation()}>
            <ExpenseForm />
            <ExpenseStats />
          </div>

          <div className="lg:col-span-2 space-y-6" onClick={(e) => e.stopPropagation()}>
            <ExpenseCharts />
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  )
}

