"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="border border-border/60 bg-background/40">
        <div className="w-5 h-5" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="border border-border/60 bg-background/40"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun
        className={`w-5 h-5 transition-all duration-300 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        style={{ position: isDark ? "absolute" : "relative" }}
      />
      <Moon
        className={`w-5 h-5 transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
        style={{ position: isDark ? "relative" : "absolute" }}
      />
    </Button>
  )
}
