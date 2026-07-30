"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle2, Camera, MapPin } from "lucide-react"
import { toast } from "sonner"

const INCIDENT_TYPES = [
  { value: "overflow", label: "Contenedor lleno", icon: AlertTriangle },
  { value: "trash_spill", label: "Basura en la calle", icon: AlertTriangle },
  { value: "blocked_road", label: "Calle bloqueada", icon: AlertTriangle },
  { value: "other", label: "Otro", icon: AlertTriangle },
]

export default function CitizenReportPage() {
  const [selectedType, setSelectedType] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Reporte enviado", { description: "Gracias por ayudar a mantener limpia tu ciudad" })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <div className="p-4 bg-accent/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-heading font-bold">¡Reporte Enviado!</h1>
        <p className="text-muted-foreground">Tu reporte ha sido recibido. El equipo de recolección lo revisará pronto.</p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setSelectedType(""); setDescription("") }}>
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
              {INCIDENT_TYPES.map((type) => {
                const Icon = type.icon
                return (
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
                    <Icon className="w-5 h-5 mb-2 text-accent" />
                    <p className="font-medium text-sm">{type.label}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

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

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="gap-2">
                <Camera className="w-4 h-4" /> Adjuntar Foto
              </Button>
              <Button type="button" variant="outline" className="gap-2">
                <MapPin className="w-4 h-4" /> Ubicación Actual
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90" disabled={!selectedType}>
          Enviar Reporte
        </Button>
      </form>
    </div>
  )
}
