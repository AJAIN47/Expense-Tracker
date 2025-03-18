"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useExpenseStore } from "@/lib/expense-store"

export function ExpenseForm() {
  // Get toast notification function and expense store
  const { toast } = useToast()
  const { addExpense, categories } = useExpenseStore()

  // Form state for controlled inputs
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]) // Default to today

  /**
   * Handle form submission
   * Validates inputs, creates a new expense, and resets the form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Make sure this is present to prevent default form behavior

    // Validate required fields
    if (!amount || !category || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Create new expense object
    const newExpense = {
      id: Date.now().toString(), // Use timestamp as unique ID
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
      createdAt: new Date().toISOString(),
    }

    // Add to store
    addExpense(newExpense)

    // Reset form fields
    setAmount("")
    setDescription("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])

    // Show success notification
    toast({
      title: "Expense added",
      description: "Your expense has been recorded",
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-primary/10 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/10 rounded-tr-full z-0"></div>

      {/* Form header */}
      <h2 className="text-xl font-semibold mb-4 text-primary relative z-10 flex items-center">
        <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Add New Expense
      </h2>

      {/* Expense form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Amount field */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="pl-8 border-primary/20 focus:border-primary focus:ring-primary/30"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-required="true"
            />
          </div>
        </div>

        {/* Category selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category *
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-primary/20 focus:ring-primary/30" aria-required="true">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></div>
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date field */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date *
          </Label>
          <Input
            id="date"
            type="date"
            className="border-primary/20 focus:border-primary focus:ring-primary/30"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-required="true"
          />
        </div>

        {/* Description field (optional) */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="What was this expense for?"
            className="border-primary/20 focus:border-primary focus:ring-primary/30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200"
        >
          Add Expense
        </Button>
      </form>
    </div>
  )
}

