"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Wrench, ShieldAlert, CheckCircle2 } from "lucide-react"

const INCIDENTS = [
  { id: "INC-001", type: "overflow", desc: "Contenedor lleno en Duarte esq. Mercedes", reporter: "Juan P.", date: "Hoy 9:30 AM", status: "reported" },
  { id: "INC-002", type: "trash_spill", desc: "Basura esparcida en Av. Independencia", reporter: "María G.", date: "Hoy 8:15 AM", status: "in_progress" },
  { id: "INC-003", type: "blocked_road", desc: "Calle cerrada por construcción en Del Monte", reporter: "Chofer CAM-002", date: "Hoy 7:00 AM", status: "resolved" },
  { id: "INC-004", type: "breakdown", desc: "Camión 3 necesita mantenimiento de frenos", reporter: "Pedro R.", date: "Ayer 4:30 PM", status: "resolved" },
  { id: "INC-005", type: "overflow", desc: "Contenedores saturados en Calle Principal", reporter: "Ana L.", date: "Ayer 2:00 PM", status: "in_progress" },
]

const TYPE_ICONS: Record<string, any> = {
  overflow: AlertTriangle,
  trash_spill: AlertTriangle,
  blocked_road: ShieldAlert,
  breakdown: Wrench,
}

export default function IncidentsPage() {
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all" ? INCIDENTS : INCIDENTS.filter((i) => i.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold">Incidencias</h1>
          <p className="text-muted-foreground">{INCIDENTS.length} reportes totales</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todas" },
            { key: "reported", label: "Reportadas" },
            { key: "in_progress", label: "En Progreso" },
            { key: "resolved", label: "Resueltas" },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
              className={filter === f.key ? "bg-accent" : ""}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map((inc) => {
              const Icon = TYPE_ICONS[inc.type]
              return (
                <div key={inc.id} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    inc.status === "reported" ? "bg-destructive/20" :
                    inc.status === "in_progress" ? "bg-yellow-500/20" : "bg-accent/20"
                  }`}>
                    {Icon && <Icon className={`w-4 h-4 ${
                      inc.status === "reported" ? "text-destructive" :
                      inc.status === "in_progress" ? "text-yellow-500" : "text-accent"
                    }`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{inc.desc}</p>
                      <Badge variant="outline" className="text-[10px]">{inc.id}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{inc.reporter} · {inc.date}</p>
                  </div>
                  <Badge className={
                    inc.status === "reported" ? "bg-destructive/20 text-destructive" :
                    inc.status === "in_progress" ? "bg-yellow-500/20 text-yellow-500" :
                    "bg-accent/20 text-accent"
                  }>
                    {inc.status === "reported" ? "Reportada" : inc.status === "in_progress" ? "En Progreso" : "Resuelta"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
