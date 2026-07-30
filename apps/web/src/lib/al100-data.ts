"use client"

import { createClient } from "@/lib/supabase"

export type IncidentStatus = "reported" | "in_progress" | "resolved"
export type IncidentType = "blocked_road" | "breakdown" | "trash_spill" | "overflow" | "other"
export type UserRole = "citizen" | "driver" | "admin"

export interface IncidentRecord {
  id: string
  type: IncidentType
  description: string
  status: IncidentStatus
  created_at: string
  reporter_name: string
  reporter_role: UserRole
  sector: string
  location?: {
    lat: number
    lng: number
  } | null
}

export interface NotificationRecord {
  id: string
  title: string
  message: string
  created_at: string
  read: boolean
  kind: "info" | "warning" | "success" | "alert"
}

export interface SectorRecord {
  id: string
  code: string
  name: string
  density: "Alta" | "Media" | "Baja"
  trucks: number
  currentVolume: number
  predictedVolume: number
  trend: "up" | "down" | "flat"
  pct: number
  freq: string
  reason: string
  factors: string[]
}

export interface TruckRecord {
  id: string
  name: string
  plate: string
  driver: string
  sector: string
  status: "on_route" | "available" | "maintenance"
  fuel: number
  speed: number
  load: number
  lastGps: string
  routeColor: string
  routeName: string
}

export interface RouteRecord {
  id: string
  truck: string
  driver: string
  sector: string
  status: "active" | "completed" | "pending"
  start: string
  duration: string
  color: string
  notes: string
}

const INCIDENTS_KEY = "al100_incidents"
const NOTIFICATIONS_KEY = "al100_notifications"

export const sectors: SectorRecord[] = [
  {
    id: "S-001",
    code: "ZG-001",
    name: "Zona Colonial",
    density: "Alta",
    trucks: 2,
    currentVolume: 3200,
    predictedVolume: 3680,
    trend: "up",
    pct: 15,
    freq: "Lun-Vie · 8:00 AM",
    reason: "Turismo, alto flujo peatonal y actividad comercial elevan el volumen.",
    factors: ["turismo", "comercio", "alta densidad"],
  },
  {
    id: "S-002",
    code: "PT-002",
    name: "Piantini",
    density: "Alta",
    trucks: 1,
    currentVolume: 4800,
    predictedVolume: 6720,
    trend: "up",
    pct: 40,
    freq: "Lun-Vie · 7:30 AM",
    reason: "Sube por oficinas, restaurantes y eventos corporativos.",
    factors: ["oficinas", "eventos", "restaurantes"],
  },
  {
    id: "S-003",
    code: "LP-003",
    name: "Los Prados",
    density: "Media",
    trucks: 1,
    currentVolume: 2100,
    predictedVolume: 1932,
    trend: "down",
    pct: 8,
    freq: "Lun, Mié, Vie · 8:30 AM",
    reason: "La IA proyecta menor generación por menor actividad comercial hoy.",
    factors: ["histórico bajo", "sin eventos", "clima estable"],
  },
  {
    id: "S-004",
    code: "EO-004",
    name: "Ensanche Ozama",
    density: "Media",
    trucks: 1,
    currentVolume: 2800,
    predictedVolume: 3080,
    trend: "up",
    pct: 10,
    freq: "Lun-Vie · 8:15 AM",
    reason: "Crecimiento moderado por densidad residencial y comercio local.",
    factors: ["residencial", "comercio local", "tráfico moderado"],
  },
  {
    id: "S-005",
    code: "VC-005",
    name: "Villa Consuelo",
    density: "Alta",
    trucks: 1,
    currentVolume: 3500,
    predictedVolume: 3850,
    trend: "up",
    pct: 10,
    freq: "Mar, Jue, Sáb · 8:45 AM",
    reason: "Mercados y movimiento nocturno sostienen el aumento esperado.",
    factors: ["mercados", "vida nocturna", "densidad alta"],
  },
  {
    id: "S-006",
    code: "SP-006",
    name: "Sabana Perdida",
    density: "Alta",
    trucks: 1,
    currentVolume: 2900,
    predictedVolume: 3190,
    trend: "up",
    pct: 10,
    freq: "Lun, Mié, Vie · 7:00 AM",
    reason: "Crecimiento poblacional en Santo Domingo Norte incrementa el volumen de residuos.",
    factors: ["alta densidad", "crecimiento urbano", "comercio local"],
  },
  {
    id: "S-007",
    code: "LG-007",
    name: "Los Guaricanos",
    density: "Alta",
    trucks: 1,
    currentVolume: 3100,
    predictedVolume: 3410,
    trend: "up",
    pct: 10,
    freq: "Mar, Jue, Sáb · 6:30 AM",
    reason: "Alta densidad poblacional y actividad comercial generan volumen constante.",
    factors: ["alta densidad", "comercio", "tráfico pesado"],
  },
  {
    id: "S-008",
    code: "SDN-008",
    name: "Santo Domingo Norte",
    density: "Alta",
    trucks: 2,
    currentVolume: 3800,
    predictedVolume: 4180,
    trend: "up",
    pct: 10,
    freq: "Lun-Sáb · 6:00 AM",
    reason: "Zona de crecimiento urbano continuo con alta densidad poblacional.",
    factors: ["crecimiento urbano", "alta densidad", "comercio diverso"],
  },
]

export const trucks: TruckRecord[] = [
  {
    id: "CAM-001",
    name: "Camión 1",
    plate: "ABC-123",
    driver: "Carlos M.",
    sector: "Zona Colonial",
    status: "on_route",
    fuel: 84,
    speed: 28,
    load: 62,
    lastGps: "hace 18 s",
    routeColor: "#22C55E",
    routeName: "Ruta Colonial",
  },
  {
    id: "CAM-002",
    name: "Camión 2",
    plate: "DEF-456",
    driver: "María P.",
    sector: "Piantini",
    status: "on_route",
    fuel: 72,
    speed: 31,
    load: 54,
    lastGps: "hace 27 s",
    routeColor: "#38BDF8",
    routeName: "Ruta Piantini",
  },
  {
    id: "CAM-003",
    name: "Camión 3",
    plate: "GHI-789",
    driver: "Pedro R.",
    sector: "Los Prados",
    status: "available",
    fuel: 91,
    speed: 0,
    load: 18,
    lastGps: "hace 2 min",
    routeColor: "#A78BFA",
    routeName: "Ruta Prados",
  },
  {
    id: "CAM-004",
    name: "Camión 4",
    plate: "JKL-012",
    driver: "Ana L.",
    sector: "Ens. Ozama",
    status: "maintenance",
    fuel: 43,
    speed: 0,
    load: 0,
    lastGps: "hace 11 min",
    routeColor: "#F97316",
    routeName: "Ruta Ozama",
  },
  {
    id: "CAM-005",
    name: "Camión 5",
    plate: "MNO-345",
    driver: "Luis F.",
    sector: "Villa Consuelo",
    status: "available",
    fuel: 67,
    speed: 0,
    load: 22,
    lastGps: "hace 4 min",
    routeColor: "#F43F5E",
    routeName: "Ruta Consuelo",
  },
  {
    id: "CAM-006",
    name: "Camión 6",
    plate: "PQR-678",
    driver: "Rosa M.",
    sector: "Sabana Perdida",
    status: "available",
    fuel: 88,
    speed: 0,
    load: 15,
    lastGps: "hace 6 min",
    routeColor: "#FBBF24",
    routeName: "Ruta Sabana Perdida",
  },
  {
    id: "CAM-007",
    name: "Camión 7",
    plate: "STU-901",
    driver: "José R.",
    sector: "Los Guaricanos",
    status: "available",
    fuel: 76,
    speed: 0,
    load: 20,
    lastGps: "hace 5 min",
    routeColor: "#EC4899",
    routeName: "Ruta Guaricanos",
  },
]

export const routes: RouteRecord[] = [
  {
    id: "R-001",
    truck: "CAM-001",
    driver: "Carlos M.",
    sector: "Zona Colonial",
    status: "active",
    start: "7:30 AM",
    duration: "2h 15m",
    color: "#22C55E",
    notes: "Prioridad por reportes ciudadanos y alto tránsito turístico.",
  },
  {
    id: "R-002",
    truck: "CAM-002",
    driver: "María P.",
    sector: "Piantini",
    status: "active",
    start: "8:00 AM",
    duration: "1h 50m",
    color: "#38BDF8",
    notes: "Recorrido rápido con paradas en torres y avenidas principales.",
  },
  {
    id: "R-003",
    truck: "CAM-003",
    driver: "Pedro R.",
    sector: "Los Prados",
    status: "completed",
    start: "6:00 AM",
    duration: "3h 00m",
    color: "#A78BFA",
    notes: "Cierre completo de ruta con baja densidad actual.",
  },
  {
    id: "R-004",
    truck: "CAM-004",
    driver: "Ana L.",
    sector: "Ensanche Ozama",
    status: "completed",
    start: "6:30 AM",
    duration: "2h 45m",
    color: "#F97316",
    notes: "Ruta consolidada con paradas de control en avenidas internas.",
  },
  {
    id: "R-005",
    truck: "CAM-005",
    driver: "Luis F.",
    sector: "Villa Consuelo",
    status: "pending",
    start: "10:00 AM",
    duration: "—",
    color: "#F43F5E",
    notes: "Pendiente de despacho para cubrir mercado y perímetro residencial.",
  },
  {
    id: "R-006",
    truck: "CAM-006",
    driver: "Rosa M.",
    sector: "Sabana Perdida",
    status: "pending",
    start: "7:00 AM",
    duration: "—",
    color: "#FBBF24",
    notes: "Cubre sector Santo Domingo Norte con paradas en avenidas principales.",
  },
  {
    id: "R-007",
    truck: "CAM-007",
    driver: "José R.",
    sector: "Los Guaricanos",
    status: "pending",
    start: "6:30 AM",
    duration: "—",
    color: "#EC4899",
    notes: "Cobertura de calles principales y avenida Los Guaricanos.",
  },
]

export const sectorSchedules: Record<string, { sector: string; days: string; time: string }> = {
  "Zona Colonial": { sector: "Zona Colonial", days: "Lun-Vie", time: "8:00 AM" },
  Piantini: { sector: "Piantini", days: "Lun-Vie", time: "7:30 AM" },
  "Los Prados": { sector: "Los Prados", days: "Lun, Mié, Vie", time: "8:30 AM" },
  "Ensanche Ozama": { sector: "Ensanche Ozama", days: "Lun-Vie", time: "8:15 AM" },
  "Villa Consuelo": { sector: "Villa Consuelo", days: "Mar, Jue, Sáb", time: "8:45 AM" },
  "Sabana Perdida": { sector: "Sabana Perdida", days: "Lun, Mié, Vie", time: "7:00 AM" },
  "Los Guaricanos": { sector: "Los Guaricanos", days: "Mar, Jue, Sáb", time: "6:30 AM" },
  "Santo Domingo Norte": { sector: "Santo Domingo Norte", days: "Lun-Sáb", time: "6:00 AM" },
}

const defaultIncidents: IncidentRecord[] = [
  {
    id: "INC-001",
    type: "overflow",
    description: "Contenedor lleno en Duarte esq. Mercedes",
    status: "reported",
    created_at: new Date().toISOString(),
    reporter_name: "Juan P.",
    reporter_role: "citizen",
    sector: "Zona Colonial",
    location: { lat: 18.48, lng: -69.89 },
  },
  {
    id: "INC-002",
    type: "trash_spill",
    description: "Basura esparcida en Av. Independencia",
    status: "in_progress",
    created_at: new Date().toISOString(),
    reporter_name: "María G.",
    reporter_role: "citizen",
    sector: "Piantini",
    location: { lat: 18.475, lng: -69.92 },
  },
]

export const incidents = defaultIncidents

function hasWindow() {
  return typeof window !== "undefined"
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!hasWindow()) return
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent("al100-data-changed", { detail: { key } }))
}

function getSupabaseClient() {
  return createClient()
}

function mapIncidentRow(row: Record<string, unknown>): IncidentRecord {
  const location = row.location as { lat?: number; lng?: number } | null | undefined
  return {
    id: String(row.id),
    type: (row.type as IncidentType) || "other",
    description: String(row.description || ""),
    status: (row.status as IncidentStatus) || "reported",
    created_at: String(row.created_at || new Date().toISOString()),
    reporter_name: String(row.reporter_name || row.user_id || "Desconocido"),
    reporter_role: (row.reporter_role as UserRole) || "citizen",
    sector: String(row.sector || "Sin sector"),
    location: location?.lat != null && location?.lng != null ? { lat: Number(location.lat), lng: Number(location.lng) } : null,
  }
}

export async function getIncidents() {
  const fallback = readJson<IncidentRecord[]>(INCIDENTS_KEY, defaultIncidents)
  const supabase = getSupabaseClient()

  if (!supabase) return fallback

  const { data } = await supabase
    .from("incidents")
    .select("id,user_id,type,description,photo_url,location,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (!data?.length) return fallback
  return data.map((row) => mapIncidentRow(row as Record<string, unknown>))
}

export async function saveIncident(input: Omit<IncidentRecord, "id" | "created_at" | "status"> & { status?: IncidentStatus }) {
  const record: IncidentRecord = {
    ...input,
    id: `INC-${Date.now()}`,
    status: input.status || "reported",
    created_at: new Date().toISOString(),
  }

  const current = readJson<IncidentRecord[]>(INCIDENTS_KEY, defaultIncidents)
  writeJson(INCIDENTS_KEY, [record, ...current].slice(0, 100))

  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      await supabase.from("incidents").insert({
        type: record.type,
        description: record.description,
        location: record.location ? { lat: record.location.lat, lng: record.location.lng } : null,
        status: record.status,
      })
    } catch {
      // Offline or missing RLS policy. Local store remains the source of truth in that case.
    }
  }

  return record
}

export function getNotifications() {
  return readJson<NotificationRecord[]>(NOTIFICATIONS_KEY, [
    {
      id: "NOTIF-001",
      title: "Incidencia recibida",
      message: "Se registró un nuevo reporte ciudadano.",
      created_at: new Date().toISOString(),
      read: false,
      kind: "info",
    },
  ])
}

export function saveNotification(notification: NotificationRecord) {
  const current = getNotifications()
  writeJson(NOTIFICATIONS_KEY, [notification, ...current].slice(0, 50))
}

export function seedNotificationFromIncident(incident: IncidentRecord) {
  saveNotification({
    id: `NOTIF-${incident.id}`,
    title: `Reporte ${incident.id}`,
    message: incident.description,
    created_at: incident.created_at,
    read: false,
    kind: "alert",
  })
}

export function markNotificationsRead(ids: string[]) {
  const current = getNotifications().map((item) => (ids.includes(item.id) ? { ...item, read: true } : item))
  writeJson(NOTIFICATIONS_KEY, current)
}

export function getSectorByName(name: string) {
  return sectors.find((sector) => sector.name === name)
}

export function guessSectorFromLocation(lat: number, lng: number) {
  if (lat >= 18.478 && lat <= 18.491 && lng >= -69.896 && lng <= -69.879) return "Zona Colonial"
  if (lat >= 18.469 && lat <= 18.481 && lng >= -69.926 && lng <= -69.909) return "Piantini"
  if (lat >= 18.489 && lat <= 18.501 && lng >= -69.876 && lng <= -69.864) return "Los Prados"
  if (lat >= 18.454 && lat <= 18.466 && lng >= -69.906 && lng <= -69.894) return "Ensanche Ozama"
  if (lat >= 18.499 && lat <= 18.512 && lng >= -69.891 && lng <= -69.879) return "Villa Consuelo"
  if (lat >= 18.53 && lat <= 18.57 && lng >= -69.88 && lng <= -69.84) return "Sabana Perdida"
  if (lat >= 18.52 && lat <= 18.56 && lng >= -69.95 && lng <= -69.91) return "Los Guaricanos"
  if (lat >= 18.50 && lat <= 18.60 && lng >= -69.97 && lng <= -69.83) return "Santo Domingo Norte"
  return "Desconocido"
}

export function normalizeSectorSchedule(sectorName: string) {
  return sectorSchedules[sectorName] || null
}

export function routeColorList(): string[] {
  return ["#22C55E", "#38BDF8", "#A78BFA", "#F97316", "#F43F5E"]
}

export function storageKeyForInsidents() {
  return INCIDENTS_KEY
}

export function storageKeyForNotifications() {
  return NOTIFICATIONS_KEY
}
