import { render, screen, fireEvent } from "@testing-library/react"
import { ExpenseControls } from "@/components/expense-controls"
import { useExpenseStore } from "@/lib/expense-store"
import { useToast } from "@/hooks/use-toast"

// Mock the hooks
jest.mock("@/lib/expense-store")
jest.mock("@/hooks/use-toast")

// Mock the file reading functionality
const mockFileReader = {
  readAsText: jest.fn(),
  result: "[]",
  onload: null,
}

global.FileReader = jest.fn(() => mockFileReader) as any

describe("ExpenseControls", () => {
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
        clearAllExpenses: jest.fn(),
        importExpenses: jest.fn(),
      })(useToast as jest.Mock)
      .mockReturnValue({
        toast: jest.fn(),
      })

    // Mock document.createElement for the export functionality
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === "a") {
        return {
          setAttribute: jest.fn(),
          click: jest.fn(),
        }
      }
      return document.createElement(tag)
    })
  })

  test("renders all control buttons", () => {
    render(<ExpenseControls />)

    expect(screen.getByRole("button", { name: /Import/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Export/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Clear All/i })).toBeInTheDocument()
  })

  test("export button is disabled when no expenses exist", () => {
    // Mock empty expenses array
    ;(useExpenseStore as jest.Mock).mockReturnValue({
      expenses: [],
      clearAllExpenses: jest.fn(),
      importExpenses: jest.fn(),
    })

    render(<ExpenseControls />)

    expect(screen.getByRole("button", { name: /Export/i })).toBeDisabled()
  })

  test("clear all button is disabled when no expenses exist", () => {
    // Mock empty expenses array
    ;(useExpenseStore as jest.Mock).mockReturnValue({
      expenses: [],
      clearAllExpenses: jest.fn(),
      importExpenses: jest.fn(),
    })

    render(<ExpenseControls />)

    expect(screen.getByRole("button", { name: /Clear All/i })).toBeDisabled()
  })

  test("exports expenses as JSON file when export button is clicked", () => {
    const { toast } = useToast() as { toast: jest.Mock }

    render(<ExpenseControls />)

    // Click export button
    fireEvent.click(screen.getByRole("button", { name: /Export/i }))

    // Check that document.createElement was called to create a download link
    expect(document.createElement).toHaveBeenCalledWith("a")

    // Check that success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Export successful",
      }),
    )
  })

  test("shows confirmation dialog when clear all button is clicked", async () => {
    render(<ExpenseControls />)

    // Click clear all button
    fireEvent.click(screen.getByRole("button", { name: /Clear All/i }))

    // Check that confirmation dialog is shown
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Delete All Data/i })).toBeInTheDocument()
  })

  test("clears all expenses when confirmed in dialog", async () => {
    const { clearAllExpenses } = useExpenseStore() as { clearAllExpenses: jest.Mock }
    const { toast } = useToast() as { toast: jest.Mock }

    render(<ExpenseControls />)

    // Click clear all button
    fireEvent.click(screen.getByRole("button", { name: /Clear All/i }))

    // Click confirm button in dialog
    fireEvent.click(screen.getByRole("button", { name: /Delete All Data/i }))

    // Check that clearAllExpenses was called
    expect(clearAllExpenses).toHaveBeenCalled()

    // Check that success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Data cleared",
      }),
    )
  })

  test("imports expenses from JSON file", async () => {
    const { importExpenses } = useExpenseStore() as { importExpenses: jest.Mock }
    const { toast } = useToast() as { toast: jest.Mock }

    // Setup mock file and FileReader
    const mockFile = new File(['[{"id":"import1"}]'], "expenses.json", { type: "application/json" })
    mockFileReader.result = '[{"id":"import1"}]'

    render(<ExpenseControls />)

    // Click import button
    fireEvent.click(screen.getByRole("button", { name: /Import/i }))

    // Simulate file selection
    const fileInput = document.querySelector('input[type="file"]')
    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    // Trigger the onload event
    mockFileReader.onload({ target: { result: mockFileReader.result } })

    // Check that importExpenses was called with the correct data
    expect(importExpenses).toHaveBeenCalledWith([{ id: "import1" }])

    // Check that success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Import successful",
      }),
    )
  })
})

