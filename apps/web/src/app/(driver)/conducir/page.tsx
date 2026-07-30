"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, MapPin, Signal, Clock, ChevronRight } from "lucide-react"
import { toast } from "sonner"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const INITIAL_POSITION = { lat: 18.486, lng: -69.889 }
const SECTOR_POLYGON = [
  { lat: 18.48, lng: -69.895 },
  { lat: 18.49, lng: -69.895 },
  { lat: 18.49, lng: -69.880 },
  { lat: 18.48, lng: -69.880 },
]

export default function DriverPage() {
  const [routeActive, setRouteActive] = useState(false)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [elapsed, setElapsed] = useState(0)
  const [routePoints, setRoutePoints] = useState<Array<{ lat: number; lng: number }>>([])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (routeActive) {
      interval = setInterval(() => {
        setElapsed((e) => e + 1)
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [routeActive])

  useEffect(() => {
    if (!routeActive) return
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = {
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        }
        setRoutePoints((points) => [...points.slice(-50), newPos])
        return newPos
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [routeActive])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const startRoute = () => {
    setRouteActive(true)
    setElapsed(0)
    setRoutePoints([INITIAL_POSITION])
    toast.success("Ruta iniciada", { description: "Compartiendo ubicación en tiempo real" })
  }

  const endRoute = () => {
    setRouteActive(false)
    toast.success("Ruta finalizada", { description: `Duración: ${formatTime(elapsed)}` })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Conducir Ruta</h1>
          <p className="text-muted-foreground">Sector Zona Colonial</p>
        </div>
        <Badge variant={routeActive ? "default" : "secondary"} className={routeActive ? "bg-accent gap-1" : ""}>
          <Signal className={`w-3 h-3 ${routeActive ? "animate-pulse" : ""}`} />
          {routeActive ? "Transmitiendo GPS" : "Detenido"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Tiempo</p>
              <p className="text-lg font-mono font-bold">{formatTime(elapsed)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Ubicación</p>
              <p className="text-sm font-mono">{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ChevronRight className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Puntos registrados</p>
              <p className="text-lg font-bold">{routePoints.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="h-[400px] w-full">
            <TruckMap
              trucks={[{ id: "my-truck", name: "Mi Camión", ...position, status: "on_route" }]}
              center={[position.lng, position.lat]}
              zoom={15}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {!routeActive ? (
          <Button onClick={startRoute} size="lg" className="flex-1 bg-accent hover:bg-accent/90 gap-2 h-12 text-base">
            <Play className="w-5 h-5" /> Iniciar Ruta
          </Button>
        ) : (
          <Button onClick={endRoute} size="lg" variant="destructive" className="flex-1 gap-2 h-12 text-base">
            <Square className="w-5 h-5" /> Finalizar Ruta
          </Button>
        )}
      </div>
    </div>
  )
}
