"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/admin/StatsCard"
import { Truck, Route, AlertTriangle, Trash2, TrendingUp, TrendingDown, Fuel, Gauge, Clock3 } from "lucide-react"
import { getIncidents, incidents as seedIncidents, routes, trucks, getStreetRoute } from "@/lib/al100-data"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

export default function AdminDashboard() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [liveIncidents, setLiveIncidents] = useState(seedIncidents)

  useEffect(() => {
    let active = true
    const load = async () => {
      const data = await getIncidents()
      if (active) setLiveIncidents(data)
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

  const activeTrucks = trucks.filter((truck) => truck.status === "on_route").length
  const totalFuel = Math.round(trucks.reduce((sum, truck) => sum + truck.fuel, 0) / trucks.length)

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
        <StatsCard title="Camiones Activos" value={`${activeTrucks}/${trucks.length}`} icon={Truck} description="Flota operativa hoy" />
        <StatsCard title="Rutas Hoy" value={`${routes.filter((route) => route.status !== "pending").length}`} icon={Route} description="2 completadas" />
        <StatsCard title="Incidencias" value={`${liveIncidents.length}`} icon={AlertTriangle} description="Sincronizadas desde reportes" />
        <StatsCard title="Combustible Prom." value={`${totalFuel}%`} icon={Trash2} description="Promedio de la flota" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mapa en Vivo</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[360px] w-full">
              <TruckMap
                trucks={trucks.map((truck) => ({
                  id: truck.id,
                  name: truck.name,
                  lat: truck.id === "CAM-001" ? 18.486 : truck.id === "CAM-002" ? 18.475 : truck.id === "CAM-003" ? 18.495 : truck.id === "CAM-004" ? 18.46 : 18.505,
                  lng: truck.id === "CAM-001" ? -69.889 : truck.id === "CAM-002" ? -69.92 : truck.id === "CAM-003" ? -69.87 : truck.id === "CAM-004" ? -69.9 : -69.885,
                  status: truck.status,
                }))}
                routePaths={routes.map((route, index) => ({
                  id: route.id,
                  color: route.color || ["#22C55E", "#38BDF8", "#A78BFA", "#F97316", "#F43F5E"][index % 5],
                  label: route.sector,
                  points: getStreetRoute(route.sector),
                }))}
                center={[18.486, -69.889]}
                zoom={12}
                dark={isDark}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {liveIncidents.slice(0, 4).map((incident) => (
              <div key={incident.id} className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      incident.status === "reported"
                        ? "bg-destructive"
                        : incident.status === "in_progress"
                          ? "bg-yellow-500"
                          : "bg-accent"
                    }`}
                  />
                  <span className="text-[10px] text-muted-foreground">{new Date(incident.created_at).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-xs">{incident.description}</p>
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
              { sector: "Zona Colonial", vol: "3,680 kg", trend: "up", pct: "+15%", reason: "Turismo y actividad comercial elevan la carga." },
              { sector: "Piantini", vol: "6,720 kg", trend: "up", pct: "+40%", reason: "Oficinas, eventos y restaurantes suben el volumen." },
              { sector: "Los Prados", vol: "1,932 kg", trend: "down", pct: "-8%", reason: "La IA proyecta una caída por baja actividad hoy." },
            ].map((item) => (
              <div
                key={item.sector}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:border-accent/30"
                title={item.reason}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.sector}</p>
                  <p className="text-xs text-muted-foreground">Vol. estimado: {item.vol}</p>
                  <p className="text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {item.reason}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${item.trend === "up" ? "text-yellow-500" : "text-accent"}`}>
                  {item.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {item.pct}
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
            {trucks.map((truck) => (
              <div key={truck.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/15 p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 self-stretch rounded-full"
                    style={{ backgroundColor: truck.routeColor }}
                  />
                  <div>
                    <p className="text-sm font-medium">{truck.name}</p>
                    <p className="text-xs text-muted-foreground">{truck.id} · {truck.routeName}</p>
                    <p className="text-[10px] text-muted-foreground">{truck.driver} · {truck.sector}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <Badge variant={truck.status === "on_route" ? "default" : "secondary"} className={truck.status === "on_route" ? "bg-accent/20 text-accent" : ""}>
                    {truck.status === "on_route" ? "En ruta" : truck.status === "maintenance" ? "Mantenimiento" : "Disponible"}
                  </Badge>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Fuel className="h-3 w-3" /> {truck.fuel}%</span>
                    <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" /> {truck.speed} km/h</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {truck.lastGps}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Carga: {truck.load}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rutas activas por color</CardTitle>
          <Badge variant="outline" className="text-[10px]">
            Cada ruta usa una línea distinta
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {routes.map((route) => (
            <div key={route.id} className="rounded-xl border border-border/60 bg-muted/15 p-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: route.color }} />
                <p className="font-medium">{route.truck}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{route.sector}</p>
              <p className="text-xs text-muted-foreground">{route.notes}</p>
              <div className="mt-3 flex items-center justify-between">
                <Badge className="bg-transparent text-[10px]" style={{ color: route.color, borderColor: route.color }}>
                  {route.status === "active" ? "Activa" : route.status === "completed" ? "Completada" : "Pendiente"}
                </Badge>
                <p className="text-[10px] text-muted-foreground">{route.start} · {route.duration}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
