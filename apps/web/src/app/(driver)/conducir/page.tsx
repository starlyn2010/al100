"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Play, Square, MapPin, Signal, Clock, ChevronRight, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { updateContainerFill, getContainersBySector, type ContainerRecord } from "@/lib/al100-data"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const INITIAL_POSITION = { lat: 18.486, lng: -69.889 }
const ROUTE_PATH: [number, number][] = [
  [18.486, -69.889],
  [18.487, -69.8878],
  [18.4884, -69.8866],
  [18.4894, -69.8848],
  [18.4888, -69.8828],
  [18.4874, -69.8818],
  [18.4862, -69.8834],
  [18.4856, -69.8858],
  [18.4858, -69.8884],
]

export default function DriverPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [routeActive, setRouteActive] = useState(false)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [elapsed, setElapsed] = useState(0)
  const [routePoints, setRoutePoints] = useState<Array<{ lat: number; lng: number }>>([])
  const [containers, setContainers] = useState<ContainerRecord[]>([])
  const [selectedContainer, setSelectedContainer] = useState<string>("")
  const [containerFill, setContainerFill] = useState(50)
  const [showContainerPanel, setShowContainerPanel] = useState(false)

  useEffect(() => {
    setContainers(getContainersBySector("Zona Colonial"))
  }, [])
  const animationRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number | null>(null)
  const segmentRef = useRef(0)
  const progressRef = useRef(0)

  const resetAnimation = () => {
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    lastFrameRef.current = null
    segmentRef.current = 0
    progressRef.current = 0
  }

  useEffect(() => {
    if (!routeActive) return
    const interval = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [routeActive])

  useEffect(() => {
    if (!routeActive) return

    const animate = (timestamp: number) => {
      if (lastFrameRef.current == null) {
        lastFrameRef.current = timestamp
      }

      const delta = timestamp - lastFrameRef.current
      lastFrameRef.current = timestamp

      const segmentDuration = 2000
      progressRef.current += delta / segmentDuration

      while (progressRef.current >= 1 && segmentRef.current < ROUTE_PATH.length - 2) {
        progressRef.current = 0
        segmentRef.current += 1
        const nextPoint = ROUTE_PATH[segmentRef.current]
        setRoutePoints((points) => [...points.slice(-24), { lat: nextPoint[0], lng: nextPoint[1] }])
      }

      const from = ROUTE_PATH[segmentRef.current]
      const to = ROUTE_PATH[Math.min(segmentRef.current + 1, ROUTE_PATH.length - 1)]
      const p = Math.min(progressRef.current, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const nextPosition = {
        lat: from[0] + (to[0] - from[0]) * eased,
        lng: from[1] + (to[1] - from[1]) * eased,
      }

      setPosition(nextPosition)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return resetAnimation
  }, [routeActive])

  useEffect(() => {
    return () => resetAnimation()
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const startRoute = () => {
    resetAnimation()
    setRouteActive(true)
    setElapsed(0)
    setPosition(INITIAL_POSITION)
    setRoutePoints([{ lat: INITIAL_POSITION.lat, lng: INITIAL_POSITION.lng }])
    toast.success("Ruta iniciada", { description: "Compartiendo ubicación en tiempo real" })
  }

  const endRoute = () => {
    setRouteActive(false)
    resetAnimation()
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
              center={[position.lat, position.lng]}
              zoom={15}
              dark={isDark}
              routePaths={[
                ...(routePoints.length > 1 ? [{
                  id: "driver-route-history",
                  points: routePoints.map((p) => [p.lat, p.lng] as [number, number]),
                  color: "#38BDF8",
                  label: "Recorrido",
                }] : []),
                {
                  id: "driver-route",
                  points: ROUTE_PATH,
                  color: "#22C55E",
                  label: "Ruta sugerida",
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {routeActive && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-accent" /> Actualizar Contenedores
            </CardTitle>
            <Button variant="ghost" size="icon-sm" onClick={() => setShowContainerPanel(!showContainerPanel)}>
              <ChevronRight className={`w-4 h-4 transition-transform ${showContainerPanel ? "rotate-90" : ""}`} />
            </Button>
          </CardHeader>
          {showContainerPanel && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selecciona un contenedor</Label>
                <select
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm"
                  value={selectedContainer}
                  onChange={(e) => {
                    setSelectedContainer(e.target.value)
                    const c = containers.find((c) => c.id === e.target.value)
                    if (c) setContainerFill(c.fill_level)
                  }}
                >
                  <option value="">Seleccionar...</option>
                  {containers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.address} · {c.fill_level}% · {c.status}
                    </option>
                  ))}
                </select>
              </div>
              {selectedContainer && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Nivel de llenado: {containerFill}%</Label>
                    <span className={`text-xs font-medium ${
                      containerFill >= 90 ? "text-destructive" : containerFill >= 80 ? "text-yellow-500" : "text-accent"
                    }`}>
                      {containerFill >= 90 ? "Crítico" : containerFill >= 80 ? "Advertencia" : "Normal"}
                    </span>
                  </div>
                  <input
                    type="range"
                    value={containerFill}
                    onChange={(e) => setContainerFill(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-[#22C55E]"
                  />
                  <Button
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => {
                      updateContainerFill(selectedContainer, containerFill)
                      setContainers(getContainersBySector("Zona Colonial"))
                      toast.success("Contenedor actualizado", {
                        description: `Nivel: ${containerFill}%`,
                      })
                      if (containerFill >= 90) {
                        toast.warning("Contenedor crítico — programar recolección urgente", { duration: 5000 })
                      }
                    }}
                  >
                    Guardar nivel
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

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
