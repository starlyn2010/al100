"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Clock, MapPin, RefreshCw, LocateFixed, AlertTriangle, Radio, CheckCheck } from "lucide-react"
import { guessSectorFromLocation, normalizeSectorSchedule, sectorSchedules, sectors, reportDelay, estimateTruckArrival, getStreetRoute } from "@/lib/al100-data"
import { fetchStreetRoute } from "@/lib/routing"
import { toast } from "sonner"

const TruckMap = dynamic(() => import("@/components/map/TruckMap"), { ssr: false })

const MOCK_TRUCK = {
  id: "CAM-001",
  name: "Camión 1",
  lat: 18.4866,
  lng: -69.8894,
  status: "on_route",
  lastUpdate: "hace 2 min",
  nextPass: "en 15 min",
  sector: "Zona Colonial",
}

const SECTOR_CENTERS: Record<string, [number, number]> = {
  "Zona Colonial": [18.4866, -69.8894],
  Piantini: [18.4760, -69.9180],
  "Los Prados": [18.4950, -69.8730],
  "Ensanche Ozama": [18.4590, -69.9010],
  "Villa Consuelo": [18.5050, -69.8860],
  "Sabana Perdida": [18.5450, -69.8630],
  "Los Guaricanos": [18.5420, -69.9330],
  "Santo Domingo Norte": [18.5500, -69.9000],
}

export default function CitizenRoutePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [truck, setTruck] = useState(MOCK_TRUCK)
  const [sector, setSector] = useState(MOCK_TRUCK.sector)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [location, setLocation] = useState<[number, number]>([18.4866, -69.8894])
  const [streetRoute, setStreetRoute] = useState<[number, number][]>(getStreetRoute("Zona Colonial"))
  const [gpsTransmitting, setGpsTransmitting] = useState(false)
  const [lastCheckin, setLastCheckin] = useState<string | null>(null)
  const watchRef = useRef<number | null>(null)

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

  useEffect(() => {
    const loadRoute = async () => {
      const hardcoded = getStreetRoute(sector)
      setStreetRoute(hardcoded)
      const live = await fetchStreetRoute(hardcoded)
      if (live && live.points.length > 2) {
        setStreetRoute(live.points)
      }
    }
    loadRoute()
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
        const detected = guessSectorFromLocation(nextLocation[0], nextLocation[1])
        if (detected !== "Desconocido") setSector(detected)
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        setLocationError(error.message || "No se pudo detectar tu ubicación.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleToggleGpsTransmission = () => {
    if (gpsTransmitting) {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current)
        watchRef.current = null
      }
      setGpsTransmitting(false)
      toast.info("Transmisión GPS desactivada")
      return
    }

    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización")
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5))
        const lng = Number(pos.coords.longitude.toFixed(5))
        setTruck((prev) => ({
          ...prev,
          lat,
          lng,
          lastUpdate: "hace unos segundos",
        }))
        const detected = guessSectorFromLocation(lat, lng)
        if (detected !== "Desconocido") setSector(detected)
      },
      () => {
        toast.error("Error en transmisión GPS")
        setGpsTransmitting(false)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    )
    watchRef.current = id
    setGpsTransmitting(true)
    toast.success("Transmitiendo ubicación en tiempo real")
  }

  const handleCitizenCheckin = () => {
    const now = new Date().toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })
    setLastCheckin(now)
    toast.success("¡Confirmación registrada!", {
      description: `Paso del camión confirmado en ${sector} a las ${now}.`,
    })
  }

  const handleReportDelayWithCheckin = () => {
    const arrival = estimateTruckArrival(sector)
    reportDelay({
      sector,
      truck_id: "CAM-001",
      reported_by: currentUser?.name || "Ciudadano",
      expected_time: schedule?.time || "—",
      delay_minutes: arrival.isLate ? Math.abs(arrival.minutes) : 15,
    })
    toast.success("Retraso reportado", { description: "Las autoridades han sido notificadas." })
  }

  const [currentUser] = useState<{ name?: string } | null>(() => {
    if (typeof window === "undefined") return null
    try { return JSON.parse(window.localStorage.getItem("al100_user") || "null") } catch { return null }
  })

  const schedule = normalizeSectorSchedule(sector)
  const activeSchedule = schedule ?? normalizeSectorSchedule("Zona Colonial")
  const arrival = estimateTruckArrival(sector)

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
              <div>
                <p className="text-xs text-muted-foreground">
                  Ubicación detectada: {location[0].toFixed(5)}, {location[1].toFixed(5)}
                </p>
              </div>
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

      <Card className="border-accent/20">
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-medium">
                {arrival.isLate
                  ? `Retraso estimado: ${Math.abs(arrival.minutes)} min`
                  : arrival.minutes > 0
                    ? `Próximo paso en ~${arrival.minutes} min`
                    : "Camión en ruta ahora"}
              </p>
              <p className="text-xs text-muted-foreground">
                Horario esperado: {schedule?.time || "—"} · {schedule?.days || "—"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10" onClick={handleReportDelayWithCheckin}>
            <AlertTriangle className="w-4 h-4" /> Reportar Retraso
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="absolute top-3 left-3 z-[1000]">
              <Badge className="bg-accent/90 text-white text-[10px] gap-1 backdrop-blur-sm shadow-lg">
                <Radio className="w-3 h-3" /> Ruta Colaborativa Ciudadana (Crowdsourced GPS)
              </Badge>
            </div>
            <div className="h-[500px] w-full">
            <TruckMap
              trucks={[{ ...truck, lat: truck.lat, lng: truck.lng }]}
              center={[truck.lat, truck.lng]}
              zoom={14}
              dark={isDark}
              routePaths={[
                {
                  id: `route-${sector}`,
                  points: streetRoute,
                  color: "#22C55E",
                  label: sector,
                },
              ]}
            />
          </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <Button
              variant={gpsTransmitting ? "default" : "outline"}
              size="lg"
              className={`w-full gap-3 h-12 text-base ${gpsTransmitting ? "bg-accent animate-pulse" : ""}`}
              onClick={handleToggleGpsTransmission}
            >
              <Radio className={`w-5 h-5 ${gpsTransmitting ? "animate-pulse" : ""}`} />
              {gpsTransmitting ? "Desactivar transmisión GPS" : "Activar transmisión GPS del Camión"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {gpsTransmitting
                ? "Transmitiendo ubicación en tiempo real desde tu dispositivo"
                : "Activa para compartir tu ubicación como conductor"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-3 h-12 text-base"
              onClick={handleCitizenCheckin}
            >
              <CheckCheck className="w-5 h-5 text-accent" />
              Confirmar paso del camión aquí
            </Button>
            {lastCheckin && (
              <p className="text-xs text-accent mt-2 text-center">
                Última confirmación en {sector}: {lastCheckin} (vía reporte ciudadano)
              </p>
            )}
            {!lastCheckin && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Confirma cuando el camión pase por tu zona
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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
          {sector === "Desconocido" && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-600 mb-2">
              Ubicación no reconocida. Selecciona un sector manualmente para ver su horario.
            </div>
          )}
          {Object.values(sectorSchedules).map((s) => (
            <div
              key={s.sector}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                s.sector === sector
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
              {s.sector === sector && (
                <div className="text-[10px] text-accent font-medium">Seleccionado</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
