import { render, screen, fireEvent } from "@testing-library/react"
import { ExpenseList } from "@/components/expense-list"
import { useExpenseStore } from "@/lib/expense-store"

// Mock the expense store
jest.mock("@/lib/expense-store")

describe("ExpenseList", () => {
  // Sample expenses for testing
  const mockExpenses = [
    {
      id: "1",
      amount: 50.75,
      description: "Grocery shopping",
      category: "food",
      date: "2023-01-15",
      createdAt: "2023-01-15T12:00:00Z",
    },
    {
      id: "2",
      amount: 30.0,
      description: "Gas",
      category: "transport",
      date: "2023-01-20",
      createdAt: "2023-01-20T14:30:00Z",
    },
    {
      id: "3",
      amount: 100.0,
      description: "Electricity bill",
      category: "utilities",
      date: "2023-01-25",
      createdAt: "2023-01-25T09:15:00Z",
    },
  ]

  // Sample categories for testing
  const mockCategories = [
    { id: "food", name: "Food & Dining", color: "#FF6B6B" },
    { id: "transport", name: "Transportation", color: "#4ECDC4" },
    { id: "utilities", name: "Utilities", color: "#FFD166" },
  ]

  beforeEach(() => {
    // Reset mocks
    jest
      .clearAllMocks()(
        // Setup default mock implementation
        useExpenseStore as jest.Mock,
      )
      .mockReturnValue({
        expenses: mockExpenses,
        categories: mockCategories,
        deleteExpense: jest.fn(),
      })
  })

  test("renders expense list with correct number of items", () => {
    render(<ExpenseList />)

    // Check that all expenses are rendered
    const rows = screen.getAllByRole("row")
    // +1 for the header row
    expect(rows.length).toBe(mockExpenses.length + 1)

    // Check that expense details are displayed
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument()
    expect(screen.getByText("Gas")).toBeInTheDocument()
    expect(screen.getByText("Electricity bill")).toBeInTheDocument()

    // Check that amounts are formatted correctly
    expect(screen.getByText("$50.75")).toBeInTheDocument()
    expect(screen.getByText("$30.00")).toBeInTheDocument()
    expect(screen.getByText("$100.00")).toBeInTheDocument()
  })

  test("filters expenses by search term", () => {
    render(<ExpenseList />)

    // Enter search term
    const searchInput = screen.getByPlaceholderText("Search expenses...")
    fireEvent.change(searchInput, { target: { value: "grocery" } })

    // Check that only matching expenses are shown
    const rows = screen.getAllByRole("row")
    // +1 for the header row
    expect(rows.length).toBe(2) // 1 expense + header

    // The matching expense should be visible
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument()

    // Other expenses should not be visible
    expect(screen.queryByText("Gas")).not.toBeInTheDocument()
    expect(screen.queryByText("Electricity bill")).not.toBeInTheDocument()
  })

  test("filters expenses by category", () => {
    render(<ExpenseList />)

    // Select category filter (this is simplified)
    const categorySelect = screen.getByText("All categories")
    fireEvent.click(categorySelect)
    fireEvent.click(screen.getByText("Food & Dining"))

    // Check that only matching expenses are shown
    const rows = screen.getAllByRole("row")
    // +1 for the header row
    expect(rows.length).toBe(2) // 1 expense + header

    // The matching expense should be visible
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument()

    // Other expenses should not be visible
    expect(screen.queryByText("Gas")).not.toBeInTheDocument()
    expect(screen.queryByText("Electricity bill")).not.toBeInTheDocument()
  })

  test("deletes an expense when delete button is clicked", () => {
    const { deleteExpense } = useExpenseStore() as { deleteExpense: jest.Mock }

    render(<ExpenseList />)

    // Find and click the delete button for the first expense
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i })
    fireEvent.click(deleteButtons[0])

    // Check that deleteExpense was called with the correct ID
    expect(deleteExpense).toHaveBeenCalledWith("1")
  })

  test("shows empty state when no expenses exist", () => {
    // Mock empty expenses array
    ;(useExpenseStore as jest.Mock).mockReturnValue({
      expenses: [],
      categories: mockCategories,
      deleteExpense: jest.fn(),
    })

    render(<ExpenseList />)

    // Check for empty state message
    expect(screen.getByText("No expenses recorded yet")).toBeInTheDocument()
    expect(screen.getByText("Add your first expense to get started!")).toBeInTheDocument()

    // Table should not be rendered
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })

  test("shows no matches message when search has no results", () => {
    render(<ExpenseList />)

    // Enter search term that won't match any expenses
    const searchInput = screen.getByPlaceholderText("Search expenses...")
    fireEvent.change(searchInput, { target: { value: "nonexistent" } })

    // Check for no matches message
    expect(screen.getByText("No expenses match your search")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your search criteria")).toBeInTheDocument()

    // Table should not be rendered
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })
})

