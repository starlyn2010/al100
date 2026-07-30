"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/admin/StatsCard"
import { Truck, Route, AlertTriangle, Trash2, TrendingUp, TrendingDown } from "lucide-react"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const TRUCKS = [
  { id: "CAM-001", name: "Camión 1", lat: 18.486, lng: -69.889, status: "on_route" },
  { id: "CAM-002", name: "Camión 2", lat: 18.475, lng: -69.920, status: "on_route" },
  { id: "CAM-003", name: "Camión 3", lat: 18.495, lng: -69.870, status: "available" },
]

const ALERTS = [
  { id: 1, type: "incident", message: "Contenedor lleno en Zona Colonial", time: "hace 10 min", severity: "high" },
  { id: 2, type: "prediction", message: "Sector Piantini: +40% volumen mañana (festivo)", time: "hace 1 h", severity: "medium" },
  { id: 3, type: "delay", message: "Camión 2 retrasado 15 min por tráfico", time: "hace 5 min", severity: "low" },
]

export default function AdminDashboard() {
  const [trucks] = useState(TRUCKS)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Panel de control del Ayuntamiento</p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          Santo Domingo · {new Date().toLocaleDateString("es-DO", { weekday: "long", day: "numeric", month: "long" })}
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Camiones Activos" value="2/3" icon={Truck} description="3 registrados" />
        <StatsCard title="Rutas Hoy" value="4" icon={Route} description="2 completadas" />
        <StatsCard title="Incidencias" value="7" icon={AlertTriangle} description="3 pendientes" />
        <StatsCard title="Residuos Recolectados" value="12.4 t" icon={Trash2} description="+18% vs ayer" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mapa en Vivo</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[350px] w-full">
              <TruckMap trucks={trucks} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ALERTS.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === "high" ? "bg-destructive" :
                    alert.severity === "medium" ? "bg-yellow-500" : "bg-accent"
                  }`} />
                  <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-xs">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Predicciones IA</CardTitle>
            <Badge variant="outline" className="text-[10px]">Reglas determinísticas</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { sector: "Zona Colonial", vol: "3,200 kg", trend: "up", pct: "+15%" },
              { sector: "Piantini", vol: "4,800 kg", trend: "up", pct: "+40%" },
              { sector: "Los Prados", vol: "2,100 kg", trend: "down", pct: "-8%" },
            ].map((s) => (
              <div key={s.sector} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="text-sm font-medium">{s.sector}</p>
                  <p className="text-xs text-muted-foreground">Vol. estimado: {s.vol}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  s.trend === "up" ? "text-yellow-500" : "text-accent"
                }`}>
                  {s.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {s.pct}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado de Flota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trucks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    t.status === "on_route" ? "bg-accent animate-pulse" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.id}</p>
                  </div>
                </div>
                <Badge variant={t.status === "on_route" ? "default" : "secondary"}
                  className={t.status === "on_route" ? "bg-accent/20 text-accent" : ""}>
                  {t.status === "on_route" ? "En ruta" : "Disponible"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
