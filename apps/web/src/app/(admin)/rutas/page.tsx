"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Play, MapPin } from "lucide-react"
import { routes } from "@/lib/al100-data"

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Rutas</h1>
        <p className="text-muted-foreground">Historial de rutas con color individual por recorrido</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Rutas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-10 w-1 rounded-full" style={{ backgroundColor: route.color }} />
                    <div
                      className={`p-2 rounded-lg ${
                        route.status === "active" ? "bg-accent/20" :
                        route.status === "completed" ? "bg-green-500/20" : "bg-muted/30"
                      }`}
                    >
                      {route.status === "active" ? <Play className="w-4 h-4 text-accent" /> :
                       route.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                       <Clock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{route.truck}</p>
                      <Badge variant="outline" className="text-[10px]">{route.id}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{route.driver} · {route.sector}</p>
                    <p className="text-xs text-muted-foreground">{route.notes}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={route.status === "active" ? "default" : route.status === "completed" ? "secondary" : "outline"}
                    className={route.status === "active" ? "bg-accent/20 text-accent" : ""}
                  >
                    {route.status === "active" ? "En curso" : route.status === "completed" ? "Completada" : "Pendiente"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{route.start} · {route.duration}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Línea: {route.color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
