"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define the Expense interface to ensure type safety
export interface Expense {
  id: string // Unique identifier for each expense
  amount: number // The expense amount
  description: string // Description of the expense
  category: string // Category ID the expense belongs to
  date: string // Date of the expense in ISO format
  createdAt: string // Timestamp when the expense was created
}

// Define the Category interface for expense categorization
export interface Category {
  id: string // Unique identifier for each category
  name: string // Display name of the category
  color: string // Color code for visual representation
}

// Define the state and actions for the expense store
interface ExpenseState {
  expenses: Expense[]
  categories: Category[]

  // Actions for managing expenses
  addExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void

  // Actions for managing categories
  addCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  updateCategory: (id: string, updates: Partial<Category>) => void

  // Utility actions
  clearAllExpenses: () => void
  importExpenses: (expenses: Expense[]) => void
}

// Default categories with predefined colors
const defaultCategories: Category[] = [
  { id: "food", name: "Food & Dining", color: "#FF6B6B" },
  { id: "transport", name: "Transportation", color: "#4ECDC4" },
  { id: "housing", name: "Housing", color: "#45B7D1" },
  { id: "entertainment", name: "Entertainment", color: "#A66CFF" },
  { id: "utilities", name: "Utilities", color: "#FFD166" },
  { id: "healthcare", name: "Healthcare", color: "#FF8364" },
  { id: "shopping", name: "Shopping", color: "#06D6A0" },
  { id: "other", name: "Other", color: "#6D8A96" },
]

// Create the store with persistence to localStorage
export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      // Initial state
      expenses: [],
      categories: defaultCategories,

      // Add a new expense to the store
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),

      // Remove an expense by ID
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      // Add a new category
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      // Remove a category by ID
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),

      // Update an existing category
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
        })),

      // Clear all expenses (but keep categories)
      clearAllExpenses: () => set({ expenses: [] }),

      // Import expenses from external source (e.g., JSON file)
      importExpenses: (importedExpenses) =>
        set((state) => ({
          expenses: [...state.expenses, ...importedExpenses],
        })),
    }),
    {
      // Configuration for localStorage persistence
      name: "expense-tracker-storage",
    },
  ),
)

