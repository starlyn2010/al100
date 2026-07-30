"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Fuel, Gauge, Clock3, MapPin, ShieldCheck } from "lucide-react"
import { trucks } from "@/lib/al100-data"

export default function TrucksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold">Camiones</h1>
          <p className="text-muted-foreground">Gestión de flota con estado, consumo y ruta asignada</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Añadir Camión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trucks.map((truck) => (
          <Card key={truck.id} className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: truck.routeColor }} />
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      truck.status === "on_route"
                        ? "bg-accent animate-pulse"
                        : truck.status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <p className="font-medium">{truck.name}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {truck.id}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Placa:</span> {truck.plate}</div>
                <div><span className="text-muted-foreground">Chofer:</span> {truck.driver}</div>
                <div><span className="text-muted-foreground">Sector:</span> {truck.sector}</div>
                <div><span className="text-muted-foreground">Ruta:</span> {truck.routeName}</div>
                <div className="flex items-center gap-1"><Fuel className="h-3 w-3 text-muted-foreground" /> {truck.fuel}% combustible</div>
                <div className="flex items-center gap-1"><Gauge className="h-3 w-3 text-muted-foreground" /> {truck.speed} km/h</div>
                <div className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-muted-foreground" /> {truck.lastGps}</div>
                <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> Carga {truck.load}%</div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/15 p-3">
                <div className="text-xs text-muted-foreground">
                  <p>Estado operativo</p>
                  <p className="text-foreground">
                    {truck.status === "on_route" ? "En ruta" : truck.status === "maintenance" ? "Mantenimiento" : "Disponible"}
                  </p>
                </div>
                <Badge className={truck.status === "on_route" ? "bg-accent/20 text-accent" : ""} variant={truck.status === "on_route" ? "default" : "secondary"}>
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {truck.status === "on_route" ? "Activo" : "Listo"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
