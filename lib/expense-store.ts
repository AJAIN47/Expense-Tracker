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
  hasMockDataLoaded: boolean

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
  loadMockData: () => void
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

// Mock data for demonstration purposes
const mockExpenses: Expense[] = [
  {
    id: "mock-1",
    amount: 85.75,
    description: "Grocery shopping",
    category: "food",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days ago
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-2",
    amount: 45.0,
    description: "Gas station",
    category: "transport",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days ago
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    amount: 1200.0,
    description: "Monthly rent",
    category: "housing",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 15 days ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-4",
    amount: 65.5,
    description: "Movie tickets and dinner",
    category: "entertainment",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-5",
    amount: 120.3,
    description: "Electricity bill",
    category: "utilities",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 10 days ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-6",
    amount: 210.0,
    description: "Doctor visit",
    category: "healthcare",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 20 days ago
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-7",
    amount: 150.25,
    description: "New clothes",
    category: "shopping",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-8",
    amount: 25.0,
    description: "Donation",
    category: "other",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 12 days ago
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-9",
    amount: 35.45,
    description: "Lunch with colleagues",
    category: "food",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 day ago
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-10",
    amount: 55.0,
    description: "Uber rides",
    category: "transport",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 4 days ago
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-11",
    amount: 80.0,
    description: "Internet bill",
    category: "utilities",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 8 days ago
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-12",
    amount: 95.6,
    description: "Concert tickets",
    category: "entertainment",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 25 days ago
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Create the store with persistence to localStorage
export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      // Initial state
      expenses: [],
      categories: defaultCategories,
      hasMockDataLoaded: false,

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
      clearAllExpenses: () =>
        set({
          expenses: [],
          hasMockDataLoaded: false,
        }),

      // Import expenses from external source (e.g., JSON file)
      importExpenses: (importedExpenses) =>
        set((state) => ({
          expenses: [...state.expenses, ...importedExpenses],
        })),

      // Load mock data for demonstration
      loadMockData: () =>
        set({
          expenses: mockExpenses,
          hasMockDataLoaded: true,
        }),
    }),
    {
      // Configuration for localStorage persistence
      name: "expense-tracker-storage",
    },
  ),
)

