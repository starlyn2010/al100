"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const ALL_TRUCKS = [
  { id: "CAM-001", name: "Camión 1", lat: 18.486, lng: -69.889, status: "on_route" },
  { id: "CAM-002", name: "Camión 2", lat: 18.475, lng: -69.920, status: "on_route" },
  { id: "CAM-003", name: "Camión 3", lat: 18.495, lng: -69.870, status: "available" },
  { id: "CAM-004", name: "Camión 4", lat: 18.460, lng: -69.900, status: "maintenance" },
  { id: "CAM-005", name: "Camión 5", lat: 18.505, lng: -69.885, status: "available" },
]

export default function AdminMapPage() {
  const [filter, setFilter] = useState<string>("all")

  const filtered = filter === "all" ? ALL_TRUCKS : ALL_TRUCKS.filter((t) => t.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold">Mapa de Flota</h1>
          <p className="text-muted-foreground">{ALL_TRUCKS.length} camiones registrados</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todos" },
            { key: "on_route", label: "En ruta" },
            { key: "available", label: "Disponibles" },
            { key: "maintenance", label: "Mantenimiento" },
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

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <TruckMap trucks={filtered} zoom={13} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {ALL_TRUCKS.map((t) => (
          <div key={t.id} className="p-3 rounded-lg bg-card border border-border space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                t.status === "on_route" ? "bg-accent animate-pulse" :
                t.status === "maintenance" ? "bg-yellow-500" : "bg-muted-foreground"
              }`} />
              <p className="font-medium text-sm">{t.name}</p>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              {t.lat.toFixed(4)}, {t.lng.toFixed(4)}
            </p>
            <Badge variant="outline" className="text-[10px]">{t.id}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
