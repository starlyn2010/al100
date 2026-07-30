"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const TRUCKS = [
  { id: "CAM-001", name: "Camión 1", plate: "ABC-123", driver: "Carlos M.", sector: "Zona Colonial", status: "on_route" },
  { id: "CAM-002", name: "Camión 2", plate: "DEF-456", driver: "María P.", sector: "Piantini", status: "on_route" },
  { id: "CAM-003", name: "Camión 3", plate: "GHI-789", driver: "Pedro R.", sector: "Los Prados", status: "available" },
  { id: "CAM-004", name: "Camión 4", plate: "JKL-012", driver: "Ana L.", sector: "Ens. Ozama", status: "maintenance" },
  { id: "CAM-005", name: "Camión 5", plate: "MNO-345", driver: "Luis F.", sector: "Villa Consuelo", status: "available" },
]

export default function TrucksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Camiones</h1>
          <p className="text-muted-foreground">Gestión de flota de recolección</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Añadir Camión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TRUCKS.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    t.status === "on_route" ? "bg-accent animate-pulse" :
                    t.status === "maintenance" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <p className="font-medium">{t.name}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{t.id}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Placa:</span> {t.plate}</div>
                <div><span className="text-muted-foreground">Chofer:</span> {t.driver}</div>
                <div><span className="text-muted-foreground">Sector:</span> {t.sector}</div>
                <div>
                  <Badge variant={t.status === "on_route" ? "default" : "secondary"}
                    className={t.status === "on_route" ? "bg-accent/20 text-accent text-[10px]" : "text-[10px]"}>
                    {t.status === "on_route" ? "En ruta" : t.status === "maintenance" ? "Mantenimiento" : "Disponible"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
