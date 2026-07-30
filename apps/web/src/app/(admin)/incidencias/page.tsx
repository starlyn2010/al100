"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { AlertTriangle, Wrench, ShieldAlert, Search, CheckCircle2, Clock3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getIncidents, type IncidentRecord } from "@/lib/al100-data"
import { cn } from "@/lib/utils"

const TYPE_ICONS: Record<string, LucideIcon> = {
  overflow: AlertTriangle,
  trash_spill: AlertTriangle,
  blocked_road: ShieldAlert,
  breakdown: Wrench,
  other: AlertTriangle,
}

export default function IncidentsPage() {
  const [filter, setFilter] = useState<"all" | "reported" | "in_progress" | "resolved">("all")
  const [search, setSearch] = useState("")
  const [incidents, setIncidents] = useState<IncidentRecord[]>([])

  useEffect(() => {
    let active = true

    const load = async () => {
      const data = await getIncidents()
      if (active) setIncidents(data)
    }

    load()
    window.addEventListener("storage", load)
    window.addEventListener("al100-data-changed", load)

    return () => {
      active = false
      window.removeEventListener("storage", load)
      window.removeEventListener("al100-data-changed", load)
    }
  }, [])

  const filtered = incidents.filter((incident) => {
    const matchesFilter = filter === "all" ? true : incident.status === filter
    const haystack = `${incident.id} ${incident.description} ${incident.reporter_name} ${incident.sector}`.toLowerCase()
    const matchesSearch = haystack.includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const reported = incidents.filter((item) => item.status === "reported").length
  const inProgress = incidents.filter((item) => item.status === "in_progress").length
  const resolved = incidents.filter((item) => item.status === "resolved").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold">Incidencias</h1>
          <p className="text-muted-foreground">{incidents.length} reportes sincronizados</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todas" },
            { key: "reported", label: "Reportadas" },
            { key: "in_progress", label: "En Progreso" },
            { key: "resolved", label: "Resueltas" },
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(item.key as typeof filter)}
              className={filter === item.key ? "bg-accent" : ""}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Totales</p>
            <p className="text-2xl font-bold">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Reportadas</p>
            <p className="text-2xl font-bold text-destructive">{reported}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">En progreso</p>
            <p className="text-2xl font-bold text-yellow-500">{inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Resueltas</p>
            <p className="text-2xl font-bold text-accent">{resolved}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por id, reporte, sector o persona..."
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No hay incidencias para este filtro.</div>
            ) : (
              filtered.map((incident) => {
                const Icon = TYPE_ICONS[incident.type] || AlertTriangle
                return (
                  <div key={incident.id} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        incident.status === "reported"
                          ? "bg-destructive/20"
                          : incident.status === "in_progress"
                            ? "bg-yellow-500/20"
                            : "bg-accent/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          incident.status === "reported"
                            ? "text-destructive"
                            : incident.status === "in_progress"
                              ? "text-yellow-500"
                              : "text-accent"
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{incident.description}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {incident.id}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {incident.sector}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {incident.reporter_name} · {new Date(incident.created_at).toLocaleString("es-DO")}
                      </p>
                      {incident.location && (
                        <p className="text-xs text-muted-foreground">
                          {incident.location.lat.toFixed(5)}, {incident.location.lng.toFixed(5)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={cn(
                          incident.status === "reported"
                            ? "bg-destructive/20 text-destructive"
                            : incident.status === "in_progress"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-accent/20 text-accent"
                        )}
                      >
                        {incident.status === "reported"
                          ? "Reportada"
                          : incident.status === "in_progress"
                            ? "En Progreso"
                            : "Resuelta"}
                      </Badge>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {incident.status === "reported" ? (
                          <Clock3 className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {incident.status === "reported" ? "Pendiente" : "Asignada"}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
