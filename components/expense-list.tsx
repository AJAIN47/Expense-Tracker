"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useExpenseStore } from "@/lib/expense-store"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

interface ExpenseListProps {
  className?: string
}

export function ExpenseList({ className = "" }: ExpenseListProps) {
  // Get expenses, categories, and delete function from the store
  const { expenses, categories, deleteExpense } = useExpenseStore()

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    // Match against description (case insensitive)
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Match against selected category (if any)
    const matchesCategory = categoryFilter ? expense.category === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  /**
   * Get the category name for display
   * @param categoryId - The ID of the category to look up
   * @returns The category name or "Uncategorized" if not found
   */
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  /**
   * Get the category color for styling
   * @param categoryId - The ID of the category to look up
   * @returns The color code or "gray" if not found
   */
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "gray"
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-primary/10 p-6 overflow-hidden relative ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-tr-full z-0"></div>

      {/* Section header */}
      <h2 className="text-xl font-semibold mb-4 text-primary relative z-10 flex items-center">
        <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Expense History
      </h2>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 relative z-10">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/20 focus:border-primary focus:ring-primary/30"
          aria-label="Search expenses"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px] border-primary/20 focus:ring-primary/30">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="flex items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expense table or empty state */}
      {sortedExpenses.length > 0 ? (
        <div className="rounded-md border border-primary/10 relative z-10 overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-primary/5 transition-colors">
                  <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{expense.description || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: `${getCategoryColor(expense.category)}20`,
                        color: getCategoryColor(expense.category),
                        borderColor: getCategoryColor(expense.category),
                      }}
                      className="font-medium"
                    >
                      {getCategoryName(expense.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      aria-label={`Delete expense: ${expense.description || "Unnamed expense"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-primary/5 rounded-lg border border-primary/10 relative z-10">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary/50 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-lg font-medium">No expenses recorded yet</p>
              <p className="text-sm">Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary/50 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg font-medium">No expenses match your search</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

