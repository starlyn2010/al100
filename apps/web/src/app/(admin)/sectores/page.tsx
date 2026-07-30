"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BrainCircuit } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const SECTORS = [
  { id: "S-001", name: "Zona Colonial", density: "Alta", trucks: 2, volume: 3200, prediction: 3680, trend: "up", pct: 15, freq: "Lun-Vie" },
  { id: "S-002", name: "Piantini", density: "Alta", trucks: 1, volume: 4800, prediction: 6720, trend: "up", pct: 40, freq: "Lun-Vie" },
  { id: "S-003", name: "Los Prados", density: "Media", trucks: 1, volume: 2100, prediction: 1932, trend: "down", pct: 8, freq: "Lun, Mié, Vie" },
  { id: "S-004", name: "Ensanche Ozama", density: "Media", trucks: 1, volume: 2800, prediction: 3080, trend: "up", pct: 10, freq: "Lun-Vie" },
  { id: "S-005", name: "Villa Consuelo", density: "Alta", trucks: 1, volume: 3500, prediction: 3850, trend: "up", pct: 10, freq: "Mar, Jue, Sáb" },
]

const chartData = SECTORS.map((s) => ({ name: s.name, actual: s.volume, predicted: s.prediction }))

export default function SectorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Sectores</h1>
        <p className="text-muted-foreground">Gestión y predicciones por sector</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-accent" /> Predicciones de Volumen por Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272F42" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#1E293B", border: "1px solid #475569", borderRadius: "8px" }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Bar dataKey="actual" fill="#22C55E" radius={[4, 4, 0, 0]} name="Vol. Actual (kg)" />
                <Bar dataKey="predicted" fill="#22C55E" fillOpacity={0.3} radius={[4, 4, 0, 0]} name="Predicción (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTORS.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{s.name}</p>
                <Badge variant="outline" className="text-[10px]">{s.id}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Densidad:</span> {s.density}</div>
                <div><span className="text-muted-foreground">Camiones:</span> {s.trucks}</div>
                <div><span className="text-muted-foreground">Frecuencia:</span> {s.freq}</div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">IA:</span>
                    <span className={s.trend === "up" ? "text-yellow-500" : "text-accent"}>
                      {s.trend === "up" ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                      {" "}{s.pct}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Vol. Estimado</p>
                  <p className="text-sm font-bold">{s.prediction.toLocaleString()} kg</p>
                </div>
                <Badge className={
                  s.trend === "up" && s.pct > 20 ? "bg-yellow-500/20 text-yellow-500" : "bg-accent/20 text-accent"
                }>
                  {s.trend === "up" && s.pct > 20 ? "Aumentar frecuencia" : "Mantener frecuencia"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
