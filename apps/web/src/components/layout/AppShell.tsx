"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

type UserRole = "citizen" | "driver" | "admin"

interface AppShellProps {
  children: React.ReactNode
  role: UserRole
}

export function AppShell({ children, role }: AppShellProps) {
  const router = useRouter()
  const [notifCount] = useState(3)

  const handleLogout = () => {
    localStorage.removeItem("al100_user")
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar role={role} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
