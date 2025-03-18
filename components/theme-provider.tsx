"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useThemeStore } from "@/lib/theme-store"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  // Apply theme to document on initial load
  useEffect(() => {
    // Check for system preference on first load
    if (!mounted && typeof window !== "undefined") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        setTheme("dark")
      }
    }

    // Apply current theme
    if (mounted && typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
      console.log("Theme applied:", theme)
    }
  }, [theme, mounted, setTheme])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <div className={theme}>{children}</div>
}

