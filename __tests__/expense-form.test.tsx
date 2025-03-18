import { render, screen, fireEvent } from "@testing-library/react"
import { ExpenseForm } from "@/components/expense-form"
import { useExpenseStore } from "@/lib/expense-store"
import { useToast } from "@/hooks/use-toast"

// Mock the hooks
jest.mock("@/lib/expense-store")
jest.mock("@/hooks/use-toast")

describe("ExpenseForm", () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Mock the expense store
    ;(useExpenseStore as jest.Mock)
      .mockReturnValue({
        addExpense: jest.fn(),
        categories: [
          { id: "food", name: "Food & Dining", color: "#FF6B6B" },
          { id: "transport", name: "Transportation", color: "#4ECDC4" },
        ],
      })(
        // Mock the toast hook
        useToast as jest.Mock,
      )
      .mockReturnValue({
        toast: jest.fn(),
      })
  })

  test("renders the form with all required fields", () => {
    render(<ExpenseForm />)

    // Check for form elements
    expect(screen.getByText("Add New Expense")).toBeInTheDocument()
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
    expect(screen.getByText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Add Expense/i })).toBeInTheDocument()
  })

  test("shows error toast when required fields are missing", async () => {
    const { toast } = useToast() as { toast: jest.Mock }
    render(<ExpenseForm />)

    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }))

    // Check that the toast was called with an error message
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Missing fields",
        variant: "destructive",
      }),
    )
  })

  test("adds expense when form is submitted with valid data", async () => {
    const { addExpense } = useExpenseStore() as { addExpense: jest.Mock }
    const { toast } = useToast() as { toast: jest.Mock }

    // Mock Date.now for consistent ID generation
    const mockDateNow = 12345
    jest.spyOn(Date, "now").mockImplementation(() => mockDateNow)

    render(<ExpenseForm />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "50.75" } })

    // Select category (this is simplified as the actual component uses a custom select)
    // In a real test, you'd need to interact with the select component properly
    const categorySelect = screen.getByText(/Select category/i)
    fireEvent.click(categorySelect)
    fireEvent.click(screen.getByText(/Food & Dining/i))

    // Set date
    const today = new Date().toISOString().split("T")[0]
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: today } })

    // Add description
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Lunch" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }))

    // Check that addExpense was called with the correct data
    expect(addExpense).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockDateNow.toString(),
        amount: 50.75,
        description: "Lunch",
        category: "food",
        date: today,
      }),
    )

    // Check that success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Expense added",
      }),
    )

    // Restore Date.now
    jest.restoreAllMocks()
  })

  test("resets form after successful submission", async () => {
    const { addExpense } = useExpenseStore() as { addExpense: jest.Mock }

    render(<ExpenseForm />)

    // Fill in the form
    const amountInput = screen.getByLabelText(/Amount/i)
    fireEvent.change(amountInput, { target: { value: "50.75" } })

    // Select category
    const categorySelect = screen.getByText(/Select category/i)
    fireEvent.click(categorySelect)
    fireEvent.click(screen.getByText(/Food & Dining/i))

    // Set date
    const dateInput = screen.getByLabelText(/Date/i)
    const today = new Date().toISOString().split("T")[0]
    fireEvent.change(dateInput, { target: { value: today } })

    // Add description
    const descriptionInput = screen.getByLabelText(/Description/i)
    fireEvent.change(descriptionInput, { target: { value: "Lunch" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }))

    // Check that form was reset
    expect(amountInput).toHaveValue("")
    expect(descriptionInput).toHaveValue("")
    // Date should be reset to today
    expect(dateInput).toHaveValue(today)
  })
})

