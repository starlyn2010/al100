"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, BrainCircuit, Search, Info } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { sectors } from "@/lib/al100-data"

export default function SectorsPage() {
  const [search, setSearch] = useState("")

  const filteredSectors = useMemo(() => {
    const term = search.toLowerCase()
    return sectors.filter((sector) => {
      return (
        sector.name.toLowerCase().includes(term) ||
        sector.code.toLowerCase().includes(term) ||
        sector.freq.toLowerCase().includes(term)
      )
    })
  }, [search])

  const chartData = filteredSectors.map((sector) => ({
    name: sector.name,
    actual: sector.currentVolume,
    predicted: sector.predictedVolume,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold">Sectores</h1>
          <p className="text-muted-foreground">Gestión, búsqueda y predicciones por sector</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            placeholder="Buscar sector por nombre o código..."
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-accent" /> Predicciones de Volumen por Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const sector = filteredSectors.find((item) => item.name === label)
                    if (!sector) return null

                    return (
                      <div className="max-w-xs rounded-xl border border-border bg-card p-3 shadow-xl">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-accent" />
                          <p className="font-medium">{sector.name}</p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{sector.reason}</p>
                        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                          <p>Actual: {sector.currentVolume.toLocaleString()} kg</p>
                          <p>Predicción: {sector.predictedVolume.toLocaleString()} kg</p>
                          <p>Horario: {sector.freq}</p>
                          <p>Factores: {sector.factors.join(", ")}</p>
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="actual" fill="#22C55E" radius={[4, 4, 0, 0]} name="Vol. Actual (kg)" />
                <Bar dataKey="predicted" fill="#22C55E" fillOpacity={0.3} radius={[4, 4, 0, 0]} name="Predicción (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSectors.map((sector) => (
          <Card key={sector.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{sector.name}</p>
                <Badge variant="outline" className="text-[10px]">{sector.code}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Densidad:</span> {sector.density}</div>
                <div><span className="text-muted-foreground">Camiones:</span> {sector.trucks}</div>
                <div><span className="text-muted-foreground">Horario:</span> {sector.freq}</div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">IA:</span>
                    <span className={sector.trend === "up" ? "text-yellow-500" : "text-accent"}>
                      {sector.trend === "up" ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                      {" "}{sector.pct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Por qué la IA predice esto</p>
                <p className="mt-1 text-sm text-muted-foreground">{sector.reason}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Vol. Estimado</p>
                  <p className="text-sm font-bold">{sector.predictedVolume.toLocaleString()} kg</p>
                </div>
                <Badge
                  className={
                    sector.trend === "up" && sector.pct > 20
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-accent/20 text-accent"
                  }
                >
                  {sector.trend === "up" && sector.pct > 20 ? "Aumentar frecuencia" : "Mantener frecuencia"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
