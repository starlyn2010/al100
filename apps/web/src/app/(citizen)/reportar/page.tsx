"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle2, Camera, MapPin, Loader2, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { guessSectorFromLocation, saveIncident, seedNotificationFromIncident, updateContainerFill, type IncidentType, sectors } from "@/lib/al100-data"

const INCIDENT_TYPES: Array<{ value: IncidentType; label: string }> = [
  { value: "overflow", label: "Contenedor lleno" },
  { value: "trash_spill", label: "Basura en la calle" },
  { value: "blocked_road", label: "Calle bloqueada" },
  { value: "breakdown", label: "Camión averiado" },
  { value: "other", label: "Otro" },
]

export default function CitizenReportPage() {
  const [selectedType, setSelectedType] = useState("")
  const [description, setDescription] = useState("")
  const [fillLevel, setFillLevel] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentUser] = useState<{ name?: string; role?: string } | null>(() => {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem("al100_user")
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La foto no puede superar 5 MB")
      return
    }
    setPhotoLoading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string)
      setPhotoLoading(false)
    }
    reader.onerror = () => {
      toast.error("Error al leer la foto")
      setPhotoLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.")
      toast.error("Geolocalización no soportada")
      return
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setLocationError("La geolocalización requiere HTTPS. Ejecuta localmente o usa HTTPS.")
      toast.error("HTTPS requerido para geolocalización")
      return
    }

    setLocationError("")
    setLocationLoading(true)
    toast.info("Solicitando ubicación...", { duration: 3000 })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        }
        setLocation(newLoc)
        setLocationLoading(false)
        const sector = guessSectorFromLocation(newLoc.lat, newLoc.lng)
        if (sector !== "Desconocido") setSelectedSector(sector)
        toast.success(`Ubicación capturada · ${sector}`)
      },
      (error) => {
        setLocationLoading(false)
        const msg =
          error.code === 1
            ? "Permiso denegado. Activa la ubicación en tu navegador."
            : error.code === 2
              ? "Señal GPS no disponible. Intenta desde un lugar abierto."
              : error.message || "No se pudo obtener la ubicación."
        setLocationError(msg)
        toast.error(msg)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sector = location ? guessSectorFromLocation(location.lat, location.lng) : selectedSector || "Sin sector"
    const reporterName = currentUser?.name || "Ciudadano"

    saveIncident({
      type: selectedType as IncidentType,
      description,
      photo,
      reporter_name: reporterName,
      reporter_role: (currentUser?.role as "citizen" | "driver" | "admin") || "citizen",
      sector,
      location,
    }).then((incident) => {
      seedNotificationFromIncident(incident)
      toast.success("Reporte enviado", {
        description: `Gracias por ayudar a mantener limpia tu ciudad. Sector: ${incident.sector}.`,
      })
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <div className="p-4 bg-accent/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-heading font-bold">¡Reporte Enviado!</h1>
        <p className="text-muted-foreground">Tu reporte ha sido recibido. El equipo de recolección lo revisará pronto.</p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setSelectedType(""); setDescription(""); setPhoto(null); setFillLevel("") }}>
          Reportar Otra Incidencia
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Reportar Incidencia</h1>
        <p className="text-muted-foreground">Ayúdanos a mejorar la recolección en tu sector</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Tipo de Incidencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedType === type.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 mb-2 text-accent" />
                  <p className="font-medium text-sm">{type.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {(selectedType === "overflow" || selectedType === "trash_spill") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-accent" /> Nivel de Llenado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>¿Qué tan lleno está el contenedor o la zona?</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "25", label: "1/4" },
                    { value: "50", label: "1/2" },
                    { value: "75", label: "3/4" },
                    { value: "100", label: "Desbordado" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFillLevel(opt.value)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        fillLevel === opt.value
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <p className="font-medium text-sm">{opt.label}</p>
                      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${opt.value}%`,
                            backgroundColor: Number(opt.value) >= 90 ? "#EF4444" : Number(opt.value) >= 75 ? "#F59E0B" : "#22C55E",
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desc">Describe el problema</Label>
              <Textarea
                id="desc"
                placeholder="Ej: El contenedor de la esquina está desbordado desde hace 3 días..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button type="button" variant="outline" className="gap-2" onClick={handlePhotoCapture} disabled={photoLoading}>
                {photoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {photo ? "Cambiar Foto" : "Tomar Foto"}
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleUseLocation} disabled={locationLoading}>
                {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {location ? "Ubicación Guardada" : "Ubicación Actual"}
              </Button>
            </div>

            {photo && (
              <div className="relative rounded-xl overflow-hidden border border-border/70">
                <img src={photo} alt="Evidencia" className="w-full max-h-48 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-7 h-7"
                  onClick={() => setPhoto(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {location && (
              <div className="rounded-xl border border-border/70 bg-muted/15 p-3 text-sm">
                <p className="font-medium">Ubicación detectada</p>
                <p className="text-muted-foreground">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
                <p className="text-muted-foreground">Sector: {guessSectorFromLocation(location.lat, location.lng)}</p>
              </div>
            )}
            {!location && (
              <div className="space-y-2">
                <Label htmlFor="sector">O selecciona tu sector manualmente</Label>
                <Select value={selectedSector} onValueChange={(v) => v && setSelectedSector(v)}>
                  <SelectTrigger id="sector" className="w-full">
                    <SelectValue placeholder="Selecciona un sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {locationError && <p className="text-sm text-destructive">{locationError}</p>}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90" disabled={!selectedType}>
          Enviar Reporte
        </Button>
      </form>
    </div>
  )
}
