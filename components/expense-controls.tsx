"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useExpenseStore } from "@/lib/expense-store"
import { useToast } from "@/hooks/use-toast"
import { Trash2Icon, DownloadIcon, UploadIcon, RefreshCwIcon } from "lucide-react"

interface ExpenseControlsProps {
  className?: string
}

export function ExpenseControls({ className = "" }: ExpenseControlsProps) {
  // Get expenses and actions from the store
  const { expenses, clearAllExpenses, importExpenses, loadMockData } = useExpenseStore()
  const { toast } = useToast()

  // State for alert dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // State to track when import is in progress
  const [isImporting, setIsImporting] = useState(false)

  /**
   * Handle clearing all expenses
   */
  const handleClearAll = () => {
    clearAllExpenses()
    toast({
      title: "Data cleared",
      description: "All expense data has been deleted",
      variant: "default",
    })
    setIsAlertOpen(false)
  }

  /**
   * Export expenses to a JSON file
   * Creates a downloadable file with the current expense data
   */
  const handleExport = () => {
    try {
      // Convert expenses to a formatted JSON string
      const dataStr = JSON.stringify(expenses, null, 2)

      // Create a data URI for the JSON
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      // Generate a filename with the current date
      const exportFileDefaultName = `expense-tracker-export-${new Date().toISOString().slice(0, 10)}.json`

      // Create and trigger a download link
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      // Show success notification
      toast({
        title: "Export successful",
        description: "Your expense data has been exported",
        variant: "default",
      })
    } catch (error) {
      // Show error notification if export fails
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      })
    }
  }

  /**
   * Import expenses from a JSON file
   * Reads the selected file and adds the expenses to the store
   */
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setIsImporting(false)
      return
    }

    // Use FileReader to read the file contents
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // Parse the JSON content
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        // Validate that the data is an array
        if (Array.isArray(importedData)) {
          // Add the imported expenses to the store
          importExpenses(importedData)

          // Show success notification
          toast({
            title: "Import successful",
            description: `Imported ${importedData.length} expenses`,
            variant: "default",
          })
        } else {
          throw new Error("Invalid data format")
        }
      } catch (error) {
        // Show error notification if import fails
        toast({
          title: "Import failed",
          description: "The file contains invalid data",
          variant: "destructive",
        })
      }

      // Reset the file input and import state
      event.target.value = ""
      setIsImporting(false)
    }

    // Read the file as text
    reader.readAsText(file)
  }

  /**
   * Load mock data for demonstration
   */
  const handleLoadMockData = () => {
    loadMockData()
    toast({
      title: "Mock data loaded",
      description: "Sample expense data has been loaded for demonstration",
      variant: "default",
    })
  }

  return (
    <div className={`flex flex-wrap gap-3 justify-end ${className}`}>
      {/* Import button */}
      <Button
        variant="outline"
        className="bg-white dark:bg-gray-800 border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
        onClick={(e) => {
          e.stopPropagation() // Stop event propagation
          setIsImporting(true)
        }}
        aria-label="Import expenses from file"
      >
        <UploadIcon className="mr-2 h-4 w-4" />
        Import
      </Button>

      {/* Hidden file input for import */}
      {isImporting && (
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
          ref={(input) => {
            if (input) {
              input.click()
              // Focus back to the button after file dialog opens
              input.onblur = () => setIsImporting(false)
            }
          }}
          onClick={(e) => e.stopPropagation()} // Stop propagation on click
        />
      )}

      {/* Export button */}
      <Button
        variant="outline"
        className="bg-white dark:bg-gray-800 border-secondary/20 text-secondary hover:text-secondary hover:bg-secondary/10"
        onClick={handleExport}
        disabled={expenses.length === 0}
        aria-label="Export expenses to file"
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        Export
      </Button>

      {/* Load mock data button */}
      <Button
        variant="outline"
        className="bg-white dark:bg-gray-800 border-accent/20 text-accent hover:text-accent hover:bg-accent/10"
        onClick={handleLoadMockData}
        aria-label="Load sample data"
      >
        <RefreshCwIcon className="mr-2 h-4 w-4" />
        Load Sample Data
      </Button>

      {/* Clear all data button with confirmation dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 border-destructive/20 text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={expenses.length === 0}
            aria-label="Clear all expense data"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all your expense data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Data
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

