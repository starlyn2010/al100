"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, RefreshCw } from "lucide-react"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const MOCK_TRUCK = {
  id: "CAM-001",
  name: "Camión 1",
  lat: 18.486,
  lng: -69.889,
  status: "on_route",
  lastUpdate: "hace 2 min",
  nextPass: "en 15 min",
  sector: "Zona Colonial",
}

export default function CitizenRoutePage() {
  const [truck, setTruck] = useState(MOCK_TRUCK)

  useEffect(() => {
    const interval = setInterval(() => {
      setTruck((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.002,
        lng: prev.lng + (Math.random() - 0.5) * 0.002,
        lastUpdate: "hace unos segundos",
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Ruta en Vivo</h1>
          <p className="text-muted-foreground">Sigue el camión recolector en tiempo real</p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent gap-1">
          <RefreshCw className="w-3 h-3 animate-spin" /> Tiempo real
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Camión</p>
              <p className="font-medium">{truck.name}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Último paso</p>
              <p className="font-medium">{truck.lastUpdate}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Próximo paso</p>
              <p className="font-medium">{truck.nextPass}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[500px] w-full">
            <TruckMap
              trucks={[{ ...truck, lat: truck.lat, lng: truck.lng }]}
              center={[truck.lng, truck.lat]}
              zoom={14}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Horario del Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
              <div
                key={day}
                className={`p-2 rounded-lg text-center text-sm ${
                  i < 5 ? "bg-accent/10 text-accent" : "bg-muted/30 text-muted-foreground"
                }`}
              >
                <p className="font-medium">{day}</p>
                <p className="text-xs">{i < 5 ? "8:00 AM" : "—"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
