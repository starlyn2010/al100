"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getNotifications, markNotificationsRead, type NotificationRecord } from "@/lib/al100-data"
import { cn } from "@/lib/utils"

export function NotificationSheet() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])

  useEffect(() => {
    const load = () => {
      setNotifications(getNotifications())
    }

    load()
    window.addEventListener("storage", load)
    window.addEventListener("al100-data-changed", load)

    const interval = setInterval(load, 5000)

    return () => {
      window.removeEventListener("storage", load)
      window.removeEventListener("al100-data-changed", load)
      clearInterval(interval)
    }
  }, [])

  const unread = notifications.filter((notification) => !notification.read)

  const markAllAsRead = () => {
    markNotificationsRead(unread.map((item) => item.id))
    setNotifications(getNotifications())
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative border border-border/60 bg-background/40"
        onClick={() => setOpen(true)}
      >
        <Bell className="w-5 h-5" />
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
            {unread.length}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <SheetTitle>Notificaciones</SheetTitle>
                  <SheetDescription>
                    Reportes, alertas y actividad reciente en la operación.
                  </SheetDescription>
                </div>
                <Button size="sm" variant="outline" onClick={markAllAsRead} disabled={unread.length === 0}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Marcar leídas
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-3 overflow-auto p-4">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando notificaciones...
                </div>
              ) : notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
                  No hay notificaciones todavía.
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "rounded-xl border border-border/70 p-4 transition-colors",
                      notification.read ? "bg-muted/15" : "bg-accent/10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{notification.title}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase",
                          notification.read ? "text-muted-foreground" : "text-accent"
                        )}
                      >
                        {notification.kind}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{notification.message}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString("es-DO")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
