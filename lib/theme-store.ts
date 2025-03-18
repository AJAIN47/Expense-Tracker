"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === "light" ? "dark" : "light"

        // Apply theme to document
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(newTheme)
        }

        set({ theme: newTheme })
      },
      setTheme: (theme) => {
        // Apply theme to document
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(theme)
        }

        set({ theme })
      },
    }),
    {
      name: "theme-storage",
    },
  ),
)

