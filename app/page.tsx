"use client"

import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseStats } from "@/components/expense-stats"
import { ExpenseCharts } from "@/components/expense-charts"
import { ExpenseHeader } from "@/components/expense-header"
import { ExpenseControls } from "@/components/expense-controls"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
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

