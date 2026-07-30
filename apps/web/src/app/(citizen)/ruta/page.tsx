"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Clock, MapPin, RefreshCw, LocateFixed } from "lucide-react"
import { guessSectorFromLocation, normalizeSectorSchedule, sectorSchedules, sectors } from "@/lib/al100-data"

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

const SECTOR_CENTERS: Record<string, [number, number]> = {
  "Zona Colonial": [18.486, -69.889],
  Piantini: [18.476, -69.918],
  "Los Prados": [18.495, -69.87],
  "Ensanche Ozama": [18.46, -69.9],
  "Villa Consuelo": [18.505, -69.885],
}

const buildRoutePath = (sector: string) => {
  const center = SECTOR_CENTERS[sector] || SECTOR_CENTERS["Zona Colonial"]
  return [
    [center[0] - 0.0025, center[1] - 0.003],
    [center[0] - 0.0012, center[1] - 0.001],
    [center[0], center[1]],
    [center[0] + 0.0012, center[1] + 0.0014],
    [center[0] + 0.0025, center[1] + 0.001],
  ] as [number, number][]
}

export default function CitizenRoutePage() {
  const [truck, setTruck] = useState(MOCK_TRUCK)
  const [sector, setSector] = useState(MOCK_TRUCK.sector)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [location, setLocation] = useState<[number, number]>([18.486, -69.889])

  useEffect(() => {
    const interval = setInterval(() => {
      setTruck((prev) => {
        const nextPoint = SECTOR_CENTERS[sector] || SECTOR_CENTERS["Zona Colonial"]
        return {
          ...prev,
          lat: prev.lat + (nextPoint[0] - prev.lat) * 0.06,
          lng: prev.lng + (nextPoint[1] - prev.lng) * 0.06,
          lastUpdate: "hace unos segundos",
        }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [sector])

  const handleLocateSector = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.")
      return
    }

    setLocationLoading(true)
    setLocationError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextLocation: [number, number] = [
          Number(pos.coords.latitude.toFixed(5)),
          Number(pos.coords.longitude.toFixed(5)),
        ]
        setLocation(nextLocation)
        setSector(guessSectorFromLocation(nextLocation[0], nextLocation[1]))
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        setLocationError(error.message || "No se pudo detectar tu ubicación.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const schedule = normalizeSectorSchedule(sector)

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

      <Card className="border-accent/20">
        <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">Sector activo</p>
            <p className="text-sm text-muted-foreground">
              El horario cambia según el sector que selecciones o detectes por ubicación.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={sector} onValueChange={(value) => { if (value) setSector(value) }}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleLocateSector} disabled={locationLoading}>
              <LocateFixed className="mr-2 h-4 w-4" />
              {locationLoading ? "Detectando..." : "Usar mi ubicación"}
            </Button>
          </div>
        </CardContent>
        {(location || locationError) && (
          <CardContent className="px-4 pb-4 pt-0">
            {location && (
              <p className="text-xs text-muted-foreground">
                Ubicación detectada: {location[0].toFixed(5)}, {location[1].toFixed(5)}
              </p>
            )}
            {locationError && <p className="text-xs text-destructive">{locationError}</p>}
          </CardContent>
        )}
      </Card>

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
              center={[truck.lat, truck.lng]}
              zoom={14}
              routePaths={[
                {
                  id: `route-${sector}`,
                  points: buildRoutePath(sector),
                  color: "#22C55E",
                  label: sector,
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Horarios de Recolección
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Todos los sectores · Seleccionado resaltado
          </p>
          {Object.values(sectorSchedules).map((s) => (
            <div
              key={s.sector}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                s.sector === schedule.sector
                  ? "border-accent/50 bg-accent/10"
                  : "border-border/70 bg-muted/15"
              }`}
            >
              <div>
                <p className="font-medium text-sm">{s.sector}</p>
                <p className="text-xs text-muted-foreground">
                  {s.days} · {s.time}
                </p>
              </div>
              {s.sector === schedule.sector && (
                <div className="text-[10px] text-accent font-medium">Seleccionado</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
