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
  photo?: string | null
}

export interface DelayRecord {
  id: string
  sector: string
  truck_id: string
  reported_by: string
  reported_at: string
  expected_time: string
  delay_minutes: number
  status: "reported" | "resolved"
  resolved_at?: string
}

export interface ContainerRecord {
  id: string
  sector: string
  location: { lat: number; lng: number }
  fill_level: number
  last_updated: string
  status: "normal" | "warning" | "critical"
  address?: string
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
const DELAYS_KEY = "al100_delays"
const CONTAINERS_KEY = "al100_containers"

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

const defaultDelays: DelayRecord[] = [
  {
    id: "DEL-001",
    sector: "Los Prados",
    truck_id: "CAM-003",
    reported_by: "Pedro R.",
    reported_at: new Date(Date.now() - 3600000).toISOString(),
    expected_time: "8:30 AM",
    delay_minutes: 25,
    status: "resolved",
    resolved_at: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: "DEL-002",
    sector: "Villa Consuelo",
    truck_id: "CAM-005",
    reported_by: "Luis F.",
    reported_at: new Date(Date.now() - 7200000).toISOString(),
    expected_time: "10:00 AM",
    delay_minutes: 15,
    status: "reported",
  },
]

const defaultContainers: ContainerRecord[] = [
  { id: "CNT-001", sector: "Zona Colonial", location: { lat: 18.483, lng: -69.888 }, fill_level: 88, last_updated: new Date().toISOString(), status: "warning", address: "Calle El Conde esq. Duarte" },
  { id: "CNT-002", sector: "Zona Colonial", location: { lat: 18.486, lng: -69.891 }, fill_level: 95, last_updated: new Date().toISOString(), status: "critical", address: "Parque Colón" },
  { id: "CNT-003", sector: "Piantini", location: { lat: 18.474, lng: -69.919 }, fill_level: 72, last_updated: new Date().toISOString(), status: "normal", address: "Av. Winston Churchill esq. Sarasota" },
  { id: "CNT-004", sector: "Piantini", location: { lat: 18.477, lng: -69.916 }, fill_level: 91, last_updated: new Date().toISOString(), status: "critical", address: "Calle Gustavo Mejía Ricart" },
  { id: "CNT-005", sector: "Los Prados", location: { lat: 18.494, lng: -69.873 }, fill_level: 50, last_updated: new Date().toISOString(), status: "normal", address: "Calle Cervantes" },
  { id: "CNT-006", sector: "Ensanche Ozama", location: { lat: 18.459, lng: -69.901 }, fill_level: 82, last_updated: new Date().toISOString(), status: "warning", address: "Av. Ecológica" },
  { id: "CNT-007", sector: "Villa Consuelo", location: { lat: 18.503, lng: -69.886 }, fill_level: 67, last_updated: new Date().toISOString(), status: "normal", address: "Calle Benito Juárez" },
  { id: "CNT-008", sector: "Sabana Perdida", location: { lat: 18.545, lng: -69.863 }, fill_level: 78, last_updated: new Date().toISOString(), status: "warning", address: "Av. Sabana Perdida" },
  { id: "CNT-009", sector: "Los Guaricanos", location: { lat: 18.542, lng: -69.933 }, fill_level: 85, last_updated: new Date().toISOString(), status: "warning", address: "Calle Principal" },
  { id: "CNT-010", sector: "Santo Domingo Norte", location: { lat: 18.55, lng: -69.90 }, fill_level: 93, last_updated: new Date().toISOString(), status: "critical", address: "Km 12 Autopista Duarte" },
]

export const delays = defaultDelays
export const containers = defaultContainers

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

export async function saveIncident(input: Omit<IncidentRecord, "id" | "created_at" | "status"> & { status?: IncidentStatus; photo?: string | null }) {
  const record: IncidentRecord = {
    ...input,
    photo: input.photo || null,
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

export const sectorStreetRoutes: Record<string, [number, number][]> = {
  "Zona Colonial": [
    [18.4866, -69.8894],
    [18.4863, -69.8888],
    [18.4860, -69.8882],
    [18.4858, -69.8875],
    [18.4855, -69.8868],
    [18.4853, -69.8860],
    [18.4850, -69.8853],
    [18.4847, -69.8845],
    [18.4845, -69.8838],
    [18.4842, -69.8830],
    [18.4838, -69.8823],
    [18.4835, -69.8818],
    [18.4830, -69.8815],
    [18.4825, -69.8818],
    [18.4820, -69.8822],
    [18.4815, -69.8820],
    [18.4810, -69.8825],
    [18.4808, -69.8832],
    [18.4805, -69.8840],
    [18.4803, -69.8848],
    [18.4802, -69.8855],
    [18.4804, -69.8862],
    [18.4806, -69.8870],
    [18.4810, -69.8878],
    [18.4812, -69.8885],
    [18.4815, -69.8892],
    [18.4818, -69.8900],
    [18.4822, -69.8905],
    [18.4828, -69.8908],
    [18.4835, -69.8910],
    [18.4842, -69.8908],
    [18.4848, -69.8905],
    [18.4855, -69.8902],
    [18.4860, -69.8898],
    [18.4866, -69.8894],
  ],
  Piantini: [
    [18.4780, -69.9190],
    [18.4778, -69.9182],
    [18.4775, -69.9175],
    [18.4772, -69.9168],
    [18.4768, -69.9160],
    [18.4765, -69.9153],
    [18.4762, -69.9145],
    [18.4758, -69.9138],
    [18.4753, -69.9132],
    [18.4748, -69.9128],
    [18.4742, -69.9125],
    [18.4738, -69.9130],
    [18.4735, -69.9138],
    [18.4732, -69.9145],
    [18.4730, -69.9153],
    [18.4732, -69.9160],
    [18.4735, -69.9168],
    [18.4738, -69.9175],
    [18.4742, -69.9182],
    [18.4748, -69.9188],
    [18.4755, -69.9195],
    [18.4760, -69.9200],
    [18.4765, -69.9202],
    [18.4770, -69.9200],
    [18.4775, -69.9195],
    [18.4780, -69.9190],
  ],
  "Los Prados": [
    [18.4945, -69.8730],
    [18.4950, -69.8722],
    [18.4955, -69.8715],
    [18.4960, -69.8708],
    [18.4965, -69.8700],
    [18.4968, -69.8692],
    [18.4970, -69.8685],
    [18.4970, -69.8678],
    [18.4968, -69.8670],
    [18.4965, -69.8663],
    [18.4960, -69.8658],
    [18.4955, -69.8658],
    [18.4950, -69.8660],
    [18.4945, -69.8665],
    [18.4940, -69.8670],
    [18.4938, -69.8675],
    [18.4935, -69.8682],
    [18.4932, -69.8690],
    [18.4930, -69.8698],
    [18.4932, -69.8705],
    [18.4935, -69.8712],
    [18.4940, -69.8720],
    [18.4945, -69.8730],
  ],
  "Ensanche Ozama": [
    [18.4590, -69.9010],
    [18.4595, -69.9005],
    [18.4600, -69.9000],
    [18.4605, -69.8995],
    [18.4610, -69.8990],
    [18.4615, -69.8985],
    [18.4620, -69.8980],
    [18.4625, -69.8978],
    [18.4630, -69.8975],
    [18.4635, -69.8978],
    [18.4640, -69.8982],
    [18.4640, -69.8988],
    [18.4638, -69.8995],
    [18.4635, -69.9000],
    [18.4630, -69.9005],
    [18.4625, -69.9010],
    [18.4620, -69.9015],
    [18.4615, -69.9020],
    [18.4610, -69.9022],
    [18.4605, -69.9020],
    [18.4600, -69.9015],
    [18.4595, -69.9012],
    [18.4590, -69.9010],
  ],
  "Villa Consuelo": [
    [18.5035, -69.8865],
    [18.5040, -69.8860],
    [18.5045, -69.8855],
    [18.5050, -69.8850],
    [18.5055, -69.8845],
    [18.5060, -69.8840],
    [18.5065, -69.8835],
    [18.5068, -69.8830],
    [18.5070, -69.8825],
    [18.5072, -69.8828],
    [18.5075, -69.8832],
    [18.5075, -69.8838],
    [18.5073, -69.8845],
    [18.5070, -69.8850],
    [18.5065, -69.8855],
    [18.5060, -69.8860],
    [18.5055, -69.8865],
    [18.5050, -69.8870],
    [18.5045, -69.8872],
    [18.5040, -69.8870],
    [18.5038, -69.8868],
    [18.5035, -69.8865],
  ],
  "Sabana Perdida": [
    [18.5450, -69.8630],
    [18.5455, -69.8625],
    [18.5460, -69.8620],
    [18.5465, -69.8615],
    [18.5470, -69.8610],
    [18.5475, -69.8605],
    [18.5480, -69.8603],
    [18.5482, -69.8605],
    [18.5480, -69.8610],
    [18.5478, -69.8615],
    [18.5475, -69.8620],
    [18.5470, -69.8625],
    [18.5465, -69.8630],
    [18.5460, -69.8635],
    [18.5455, -69.8640],
    [18.5452, -69.8642],
    [18.5450, -69.8640],
    [18.5450, -69.8635],
    [18.5450, -69.8630],
  ],
  "Los Guaricanos": [
    [18.5420, -69.9330],
    [18.5425, -69.9325],
    [18.5430, -69.9320],
    [18.5435, -69.9315],
    [18.5440, -69.9310],
    [18.5445, -69.9305],
    [18.5450, -69.9300],
    [18.5452, -69.9295],
    [18.5450, -69.9298],
    [18.5455, -69.9302],
    [18.5455, -69.9308],
    [18.5452, -69.9315],
    [18.5450, -69.9320],
    [18.5445, -69.9325],
    [18.5440, -69.9330],
    [18.5435, -69.9335],
    [18.5430, -69.9340],
    [18.5425, -69.9342],
    [18.5422, -69.9340],
    [18.5420, -69.9335],
    [18.5420, -69.9330],
  ],
  "Santo Domingo Norte": [
    [18.5500, -69.9000],
    [18.5505, -69.8995],
    [18.5510, -69.8990],
    [18.5515, -69.8985],
    [18.5520, -69.8980],
    [18.5525, -69.8975],
    [18.5530, -69.8972],
    [18.5532, -69.8975],
    [18.5530, -69.8980],
    [18.5528, -69.8985],
    [18.5535, -69.8988],
    [18.5535, -69.8992],
    [18.5532, -69.8998],
    [18.5528, -69.9002],
    [18.5522, -69.9005],
    [18.5518, -69.9008],
    [18.5512, -69.9010],
    [18.5508, -69.9008],
    [18.5505, -69.9005],
    [18.5502, -69.9002],
    [18.5500, -69.9000],
  ],
}

export function getStreetRoute(sectorName: string): [number, number][] {
  return sectorStreetRoutes[sectorName] || sectorStreetRoutes["Zona Colonial"]
}

export function storageKeyForInsidents() {
  return INCIDENTS_KEY
}

export function storageKeyForNotifications() {
  return NOTIFICATIONS_KEY
}

export function getDelays() {
  return readJson<DelayRecord[]>(DELAYS_KEY, defaultDelays)
}

export function reportDelay(input: Omit<DelayRecord, "id" | "reported_at" | "status">) {
  const record: DelayRecord = {
    ...input,
    id: `DEL-${Date.now()}`,
    reported_at: new Date().toISOString(),
    status: "reported",
  }
  const current = getDelays()
  writeJson(DELAYS_KEY, [record, ...current])
  return record
}

export function resolveDelay(id: string) {
  const current = getDelays().map((d) => (d.id === id ? { ...d, status: "resolved" as const, resolved_at: new Date().toISOString() } : d))
  writeJson(DELAYS_KEY, current)
}

export function getContainers() {
  return readJson<ContainerRecord[]>(CONTAINERS_KEY, defaultContainers)
}

export function updateContainerFill(id: string, fill_level: number) {
  const current = getContainers().map((c) => {
    if (c.id !== id) return c
    const status: ContainerRecord["status"] = fill_level >= 90 ? "critical" : fill_level >= 80 ? "warning" : "normal"
    return { ...c, fill_level, status, last_updated: new Date().toISOString() }
  })
  writeJson(CONTAINERS_KEY, current)
  return current.find((c) => c.id === id)
}

export function getContainersBySector(sectorName: string) {
  return getContainers().filter((c) => c.sector === sectorName)
}

export function getCriticalContainers() {
  return getContainers().filter((c) => c.status === "critical")
}

export function getWarningContainers() {
  return getContainers().filter((c) => c.status === "warning")
}

export interface AnalyticsData {
  totalDelays: number
  unresolvedDelays: number
  avgDelayMinutes: number
  delaysBySector: Array<{ sector: string; count: number; avgMinutes: number }>
  totalContainers: number
  criticalContainers: number
  warningContainers: number
  containersBySector: Array<{ sector: string; count: number; avgFill: number; critical: number }>
  totalIncidents: number
  incidentsBySector: Array<{ sector: string; count: number }>
}

export function getAnalytics(): AnalyticsData {
  const allDelays = getDelays()
  const allContainers = getContainers()
  const allIncidents = readJson<IncidentRecord[]>(INCIDENTS_KEY, defaultIncidents)

  const unresolvedDelays = allDelays.filter((d) => d.status === "reported")

  const delaySectorMap = new Map<string, { count: number; totalMinutes: number }>()
  allDelays.forEach((d) => {
    const entry = delaySectorMap.get(d.sector) || { count: 0, totalMinutes: 0 }
    entry.count++
    entry.totalMinutes += d.delay_minutes
    delaySectorMap.set(d.sector, entry)
  })

  const containerSectorMap = new Map<string, { count: number; totalFill: number; critical: number }>()
  allContainers.forEach((c) => {
    const entry = containerSectorMap.get(c.sector) || { count: 0, totalFill: 0, critical: 0 }
    entry.count++
    entry.totalFill += c.fill_level
    if (c.status === "critical") entry.critical++
    containerSectorMap.set(c.sector, entry)
  })

  const incidentSectorMap = new Map<string, number>()
  allIncidents.forEach((inc) => {
    incidentSectorMap.set(inc.sector, (incidentSectorMap.get(inc.sector) || 0) + 1)
  })

  return {
    totalDelays: allDelays.length,
    unresolvedDelays: unresolvedDelays.length,
    avgDelayMinutes: allDelays.length > 0 ? Math.round(allDelays.reduce((s, d) => s + d.delay_minutes, 0) / allDelays.length) : 0,
    delaysBySector: Array.from(delaySectorMap.entries()).map(([sector, data]) => ({
      sector,
      count: data.count,
      avgMinutes: Math.round(data.totalMinutes / data.count),
    })),
    totalContainers: allContainers.length,
    criticalContainers: allContainers.filter((c) => c.status === "critical").length,
    warningContainers: allContainers.filter((c) => c.status === "warning").length,
    containersBySector: Array.from(containerSectorMap.entries()).map(([sector, data]) => ({
      sector,
      count: data.count,
      avgFill: Math.round(data.totalFill / data.count),
      critical: data.critical,
    })),
    totalIncidents: allIncidents.length,
    incidentsBySector: Array.from(incidentSectorMap.entries()).map(([sector, count]) => ({ sector, count })),
  }
}

export function estimateTruckArrival(sectorName: string): { minutes: number; isLate: boolean } {
  const schedule = sectorSchedules[sectorName]
  if (!schedule) return { minutes: 999, isLate: false }

  const now = new Date()
  const [h, m] = schedule.time.replace(" AM", "").replace(" PM", "").split(":").map(Number)
  const expected = new Date(now)
  expected.setHours(schedule.time.includes("PM") ? h + 12 : h, m, 0)

  const diffMs = expected.getTime() - now.getTime()
  const minutes = Math.round(diffMs / 60000)

  return { minutes, isLate: minutes < -30 }
}
