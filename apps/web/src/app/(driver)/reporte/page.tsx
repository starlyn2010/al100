"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Wrench, ShieldAlert, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function DriverReportPage() {
  const [type, setType] = useState("")
  const [desc, setDesc] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Reporte enviado a central")
    setDone(true)
  }

  if (done) return (
    <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
      <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
      <h1 className="text-2xl font-bold">Reporte Enviado</h1>
      <p className="text-muted-foreground">El ayuntamiento ha sido notificado.</p>
      <Button variant="outline" onClick={() => { setDone(false); setType(""); setDesc("") }}>
        Nuevo Reporte
      </Button>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Reportar Problema</h1>
        <p className="text-muted-foreground">Notifica a central sobre incidencias en tu ruta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Tipo</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {[
              { value: "blocked_road", label: "Calle Bloqueada", icon: ShieldAlert },
              { value: "breakdown", label: "Avería", icon: Wrench },
              { value: "other", label: "Otro", icon: AlertTriangle },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button key={item.value} type="button"
                  onClick={() => setType(item.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    type === item.value ? "border-accent bg-accent/10" : "border-border"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1 text-accent" />
                  <p className="text-xs">{item.label}</p>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
            placeholder="Describe el problema..." />
        </div>

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 h-11" disabled={!type}>
          Enviar Reporte
        </Button>
      </form>
    </div>
  )
}
