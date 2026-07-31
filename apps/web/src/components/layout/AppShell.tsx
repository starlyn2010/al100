"use client"

import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { NotificationSheet } from "./NotificationSheet"
import { ThemeToggle } from "@/components/ThemeToggle"

type UserRole = "citizen" | "driver" | "admin"

interface AppShellProps {
  children: React.ReactNode
  role: UserRole
}

export function AppShell({ children, role }: AppShellProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("al100_user")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar role={role} onLogout={handleLogout} />
      </div>

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_24%)]" />
        <header className="relative z-10 h-14 border-b border-border/70 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-60">
                <Sidebar role={role} onLogout={handleLogout} />
              </SheetContent>
            </Sheet>
            <span className="font-heading font-bold text-accent md:hidden">AL100</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationSheet />
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
