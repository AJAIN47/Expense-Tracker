"use client"

import type React from "react"

import { MoonIcon, SunIcon, DollarSignIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useThemeStore } from "@/lib/theme-store"

export function ExpenseHeader() {
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  // Only show the theme toggle after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme toggle with explicit event prevention
  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Theme toggle clicked, current theme:", theme)
    toggleTheme()
    console.log("Theme after toggle:", theme === "light" ? "dark" : "light")
  }

  return (
    <header className="w-full py-6 px-4 bg-gradient-to-r from-primary to-secondary text-white relative z-20">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-white/20 p-3 rounded-full mr-3">
            <DollarSignIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Expense Tracker</h1>
        </div>

        <div className="flex items-center space-x-4">
          {mounted && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="bg-white/20 hover:bg-white/30 text-white relative z-50"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              style={{ pointerEvents: "auto" }}
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

