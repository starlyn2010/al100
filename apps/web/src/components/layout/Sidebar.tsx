"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard, Truck, Route, Map, Users, AlertTriangle,
  Trash2, LogOut, ChevronLeft, ChevronRight, Crosshair, BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type UserRole = "citizen" | "driver" | "admin"

const navItems: Record<UserRole, Array<{ href: string; label: string; icon: LucideIcon }>> = {
  citizen: [
    { href: "/ruta", label: "Ruta en Vivo", icon: Crosshair },
    { href: "/reportar", label: "Reportar", icon: AlertTriangle },
  ],
  driver: [
    { href: "/conducir", label: "Conducir", icon: Route },
    { href: "/reporte", label: "Reportar", icon: AlertTriangle },
  ],
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/rutas", label: "Rutas", icon: Route },
    { href: "/camiones", label: "Camiones", icon: Truck },
    { href: "/sectores", label: "Sectores", icon: Trash2 },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/usuarios", label: "Usuarios", icon: Users },
    { href: "/incidencias", label: "Incidencias", icon: AlertTriangle },
  ],
}

export function Sidebar({ role, onLogout }: { role: UserRole; onLogout: () => void }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const items = navItems[role] || []

  return (
    <aside
      className={cn(
        "h-screen bg-card/90 backdrop-blur-xl border-r border-border/70 flex flex-col transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.35)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border/70">
        {!collapsed && (
          <span className="font-heading text-lg font-bold text-accent">AL100</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:bg-muted/50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                active
                    ? "bg-accent/15 text-accent font-medium shadow-[inset_0_0_0_1px_rgba(34,197,94,0.22)]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-border/70">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!collapsed && <span className="text-sm">Salir</span>}
        </Button>
      </div>
    </aside>
  )
}
