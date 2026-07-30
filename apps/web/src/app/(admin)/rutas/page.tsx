"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Play } from "lucide-react"

const ROUTES = [
  { id: "R-001", truck: "CAM-001", driver: "Carlos M.", sector: "Zona Colonial", status: "active", start: "7:30 AM", duration: "2h 15m" },
  { id: "R-002", truck: "CAM-002", driver: "María P.", sector: "Piantini", status: "active", start: "8:00 AM", duration: "1h 50m" },
  { id: "R-003", truck: "CAM-003", driver: "Pedro R.", sector: "Los Prados", status: "completed", start: "6:00 AM", duration: "3h 00m" },
  { id: "R-004", truck: "CAM-004", driver: "Ana L.", sector: "Ensanche Ozama", status: "completed", start: "6:30 AM", duration: "2h 45m" },
  { id: "R-005", truck: "CAM-005", driver: "Luis F.", sector: "Villa Consuelo", status: "pending", start: "10:00 AM", duration: "—" },
]

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Rutas</h1>
        <p className="text-muted-foreground">Historial de rutas de recolección</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Rutas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ROUTES.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    r.status === "active" ? "bg-accent/20" :
                    r.status === "completed" ? "bg-green-500/20" : "bg-muted/30"
                  }`}>
                    {r.status === "active" ? <Play className="w-4 h-4 text-accent" /> :
                     r.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                     <Clock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{r.truck}</p>
                      <Badge variant="outline" className="text-[10px]">{r.id}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.driver} · {r.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={r.status === "active" ? "default" : r.status === "completed" ? "secondary" : "outline"}
                    className={r.status === "active" ? "bg-accent/20 text-accent" : ""}>
                    {r.status === "active" ? "En curso" : r.status === "completed" ? "Completada" : "Pendiente"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{r.start} · {r.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
