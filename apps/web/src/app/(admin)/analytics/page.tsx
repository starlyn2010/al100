"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts"
import { Clock, Trash2, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react"
import { getAnalytics, type AnalyticsData } from "@/lib/al100-data"

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#A78BFA", "#F43F5E", "#EC4899", "#14B8A6", "#F97316"]

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    setData(getAnalytics())
    const onDataChange = () => setData(getAnalytics())
    window.addEventListener("al100-data-changed", onDataChange)
    return () => window.removeEventListener("al100-data-changed", onDataChange)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Analytics</h1>
          <p className="text-muted-foreground">Estadísticas operativas en tiempo real</p>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent gap-1">
          <RefreshCw className="w-3 h-3" /> Tiempo real
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg"><Clock className="w-5 h-5 text-accent" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Retrasos totales</p>
              <p className="text-xl font-bold">{data.totalDelays}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Retrasos sin resolver</p>
              <p className="text-xl font-bold text-destructive">{data.unresolvedDelays}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg"><Trash2 className="w-5 h-5 text-yellow-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Contenedores críticos</p>
              <p className="text-xl font-bold text-yellow-500">{data.criticalContainers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg"><TrendingUp className="w-5 h-5 text-accent" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Prom. retraso</p>
              <p className="text-xl font-bold">{data.avgDelayMinutes} min</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Retrasos por Sector</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.delaysBySector}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="sector" tick={{ fill: "var(--chart-text)", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                          <p className="font-medium">{d.sector}</p>
                          <p className="text-muted-foreground">{d.count} retrasos · Prom. {d.avgMinutes} min</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} name="Retrasos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Llenado de Contenedores</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Crítico (>90%)", value: data.criticalContainers },
                      { name: "Advertencia (80-90%)", value: data.warningContainers },
                      { name: "Normal (<80%)", value: data.totalContainers - data.criticalContainers - data.warningContainers },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {["#EF4444", "#F59E0B", "#22C55E"].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]
                      return (
                        <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                          <p className="font-medium">{d.name}</p>
                          <p className="text-muted-foreground">{d.value} contenedores</p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Llenado Promedio por Sector</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.containersBySector} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                  <YAxis dataKey="sector" type="category" tick={{ fill: "var(--chart-text)", fontSize: 10 }} width={110} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                          <p className="font-medium">{d.sector}</p>
                          <p className="text-muted-foreground">Prom. {d.avgFill}% · {d.critical} críticos</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="avgFill" fill="#22C55E" radius={[0, 4, 4, 0]} name="Llenado promedio %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Incidencias por Sector</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.incidentsBySector}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="sector" tick={{ fill: "var(--chart-text)", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                          <p className="font-medium">{d.sector}</p>
                          <p className="text-muted-foreground">{d.count} incidencias</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Incidencias" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Resumen por Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Sector</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Retrasos</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Prom. retraso</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Contenedores</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Llenado prom.</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Críticos</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Incidencias</th>
                </tr>
              </thead>
              <tbody>
                {data.delaysBySector.map((delay) => {
                  const container = data.containersBySector.find((c) => c.sector === delay.sector)
                  const incident = data.incidentsBySector.find((i) => i.sector === delay.sector)
                  return (
                    <tr key={delay.sector} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-2 px-3 font-medium">{delay.sector}</td>
                      <td className="text-right py-2 px-3">{delay.count}</td>
                      <td className="text-right py-2 px-3">{delay.avgMinutes} min</td>
                      <td className="text-right py-2 px-3">{container?.count || 0}</td>
                      <td className="text-right py-2 px-3">{container?.avgFill || 0}%</td>
                      <td className="text-right py-2 px-3">
                        <span className={container && container.critical > 0 ? "text-destructive font-medium" : ""}>
                          {container?.critical || 0}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">{incident?.count || 0}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
