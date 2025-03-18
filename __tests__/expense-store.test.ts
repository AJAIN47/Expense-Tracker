import { renderHook, act } from "@testing-library/react"
import { useExpenseStore } from "@/lib/expense-store"

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Reset the store before each test
beforeEach(() => {
  // Clear the store state
  const { result } = renderHook(() => useExpenseStore())
  act(() => {
    result.current.clearAllExpenses()
  })
})

describe("Expense Store", () => {
  test("should initialize with empty expenses and default categories", () => {
    const { result } = renderHook(() => useExpenseStore())

    expect(result.current.expenses).toEqual([])
    expect(result.current.categories.length).toBeGreaterThan(0)
    expect(result.current.categories[0]).toHaveProperty("id")
    expect(result.current.categories[0]).toHaveProperty("name")
    expect(result.current.categories[0]).toHaveProperty("color")
  })

  test("should add a new expense", () => {
    const { result } = renderHook(() => useExpenseStore())

    const newExpense = {
      id: "1",
      amount: 50,
      description: "Test expense",
      category: "food",
      date: "2023-01-01",
      createdAt: new Date().toISOString(),
    }

    act(() => {
      result.current.addExpense(newExpense)
    })

    expect(result.current.expenses.length).toBe(1)
    expect(result.current.expenses[0]).toEqual(newExpense)
  })

  test("should delete an expense", () => {
    const { result } = renderHook(() => useExpenseStore())

    const expense1 = {
      id: "1",
      amount: 50,
      description: "Test expense 1",
      category: "food",
      date: "2023-01-01",
      createdAt: new Date().toISOString(),
    }

    const expense2 = {
      id: "2",
      amount: 30,
      description: "Test expense 2",
      category: "transport",
      date: "2023-01-02",
      createdAt: new Date().toISOString(),
    }

    act(() => {
      result.current.addExpense(expense1)
      result.current.addExpense(expense2)
    })

    expect(result.current.expenses.length).toBe(2)

    act(() => {
      result.current.deleteExpense("1")
    })

    expect(result.current.expenses.length).toBe(1)
    expect(result.current.expenses[0].id).toBe("2")
  })

  test("should clear all expenses", () => {
    const { result } = renderHook(() => useExpenseStore())

    const expense = {
      id: "1",
      amount: 50,
      description: "Test expense",
      category: "food",
      date: "2023-01-01",
      createdAt: new Date().toISOString(),
    }

    act(() => {
      result.current.addExpense(expense)
    })

    expect(result.current.expenses.length).toBe(1)

    act(() => {
      result.current.clearAllExpenses()
    })

    expect(result.current.expenses.length).toBe(0)
  })

  test("should add a new category", () => {
    const { result } = renderHook(() => useExpenseStore())

    const initialCategoriesCount = result.current.categories.length

    const newCategory = {
      id: "custom",
      name: "Custom Category",
      color: "#FF00FF",
    }

    act(() => {
      result.current.addCategory(newCategory)
    })

    expect(result.current.categories.length).toBe(initialCategoriesCount + 1)
    expect(result.current.categories).toContainEqual(newCategory)
  })

  test("should update a category", () => {
    const { result } = renderHook(() => useExpenseStore())

    // Get the first category
    const categoryToUpdate = result.current.categories[0]
    const updatedName = "Updated Category Name"

    act(() => {
      result.current.updateCategory(categoryToUpdate.id, { name: updatedName })
    })

    // Find the updated category
    const updatedCategory = result.current.categories.find((c) => c.id === categoryToUpdate.id)

    expect(updatedCategory).toBeDefined()
    expect(updatedCategory?.name).toBe(updatedName)
    expect(updatedCategory?.color).toBe(categoryToUpdate.color) // Color should remain unchanged
  })

  test("should import expenses", () => {
    const { result } = renderHook(() => useExpenseStore())

    const expensesToImport = [
      {
        id: "import1",
        amount: 75,
        description: "Imported expense 1",
        category: "food",
        date: "2023-02-01",
        createdAt: new Date().toISOString(),
      },
      {
        id: "import2",
        amount: 120,
        description: "Imported expense 2",
        category: "housing",
        date: "2023-02-02",
        createdAt: new Date().toISOString(),
      },
    ]

    act(() => {
      result.current.importExpenses(expensesToImport)
    })

    expect(result.current.expenses.length).toBe(2)
    expect(result.current.expenses).toContainEqual(expensesToImport[0])
    expect(result.current.expenses).toContainEqual(expensesToImport[1])
  })
})

