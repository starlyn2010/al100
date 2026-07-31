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
    [18.485590, -69.888790],
    [18.485515, -69.888740],
    [18.485441, -69.888690],
    [18.485366, -69.888640],
    [18.485292, -69.888590],
    [18.485217, -69.888540],
    [18.485143, -69.888490],
    [18.485068, -69.888440],
    [18.484994, -69.888390],
    [18.484919, -69.888340],
    [18.484845, -69.888290],
    [18.484770, -69.888240],
    [18.484710, -69.888320],
    [18.484650, -69.888400],
    [18.484590, -69.888480],
    [18.484530, -69.888560],
    [18.484470, -69.888640],
    [18.484418, -69.888713],
    [18.484367, -69.888787],
    [18.484315, -69.888860],
    [18.484263, -69.888933],
    [18.484212, -69.889007],
    [18.484160, -69.889080],
    [18.484234, -69.889135],
    [18.484307, -69.889191],
    [18.484381, -69.889246],
    [18.484455, -69.889302],
    [18.484528, -69.889357],
    [18.484602, -69.889413],
    [18.484675, -69.889468],
    [18.484749, -69.889524],
    [18.484823, -69.889579],
    [18.484896, -69.889635],
    [18.484970, -69.889690],
    [18.485022, -69.889613],
    [18.485073, -69.889537],
    [18.485125, -69.889460],
    [18.485177, -69.889383],
    [18.485228, -69.889307],
    [18.485280, -69.889230],
    [18.485332, -69.889157],
    [18.485383, -69.889083],
    [18.485435, -69.889010],
    [18.485487, -69.888937],
    [18.485538, -69.888863],
    [18.485590, -69.888790],
  ],
  Piantini: [
    [18.475820, -69.916770],
    [18.475835, -69.916675],
    [18.475849, -69.916579],
    [18.475864, -69.916484],
    [18.475878, -69.916388],
    [18.475893, -69.916293],
    [18.475908, -69.916198],
    [18.475922, -69.916102],
    [18.475937, -69.916007],
    [18.475952, -69.915912],
    [18.475966, -69.915816],
    [18.475981, -69.915721],
    [18.475995, -69.915625],
    [18.476010, -69.915530],
    [18.476101, -69.915534],
    [18.476192, -69.915539],
    [18.476284, -69.915543],
    [18.476375, -69.915548],
    [18.476466, -69.915552],
    [18.476557, -69.915556],
    [18.476648, -69.915561],
    [18.476740, -69.915565],
    [18.476831, -69.915570],
    [18.476922, -69.915574],
    [18.477013, -69.915578],
    [18.477104, -69.915583],
    [18.477196, -69.915587],
    [18.477287, -69.915592],
    [18.477378, -69.915596],
    [18.477469, -69.915600],
    [18.477560, -69.915605],
    [18.477652, -69.915609],
    [18.477743, -69.915614],
    [18.477834, -69.915618],
    [18.477925, -69.915622],
    [18.478016, -69.915627],
    [18.478108, -69.915631],
    [18.478199, -69.915636],
    [18.478290, -69.915640],
    [18.478288, -69.915738],
    [18.478285, -69.915837],
    [18.478282, -69.915935],
    [18.478280, -69.916033],
    [18.478278, -69.916132],
    [18.478275, -69.916230],
    [18.478272, -69.916328],
    [18.478270, -69.916427],
    [18.478268, -69.916525],
    [18.478265, -69.916623],
    [18.478262, -69.916722],
    [18.478260, -69.916820],
    [18.478170, -69.916818],
    [18.478079, -69.916816],
    [18.477989, -69.916814],
    [18.477899, -69.916813],
    [18.477808, -69.916811],
    [18.477718, -69.916809],
    [18.477627, -69.916807],
    [18.477537, -69.916805],
    [18.477447, -69.916803],
    [18.477356, -69.916801],
    [18.477266, -69.916800],
    [18.477176, -69.916798],
    [18.477085, -69.916796],
    [18.476995, -69.916794],
    [18.476904, -69.916792],
    [18.476814, -69.916790],
    [18.476724, -69.916789],
    [18.476633, -69.916787],
    [18.476543, -69.916785],
    [18.476453, -69.916783],
    [18.476362, -69.916781],
    [18.476272, -69.916779],
    [18.476181, -69.916777],
    [18.476091, -69.916776],
    [18.476001, -69.916774],
    [18.475910, -69.916772],
    [18.475820, -69.916770],
  ],
  "Los Prados": [
    [18.494890, -69.871680],
    [18.494884, -69.871588],
    [18.494878, -69.871497],
    [18.494872, -69.871405],
    [18.494867, -69.871313],
    [18.494861, -69.871222],
    [18.494855, -69.871130],
    [18.494849, -69.871038],
    [18.494843, -69.870947],
    [18.494838, -69.870855],
    [18.494832, -69.870763],
    [18.494826, -69.870672],
    [18.494820, -69.870580],
    [18.494733, -69.870587],
    [18.494645, -69.870593],
    [18.494557, -69.870600],
    [18.494470, -69.870607],
    [18.494383, -69.870613],
    [18.494295, -69.870620],
    [18.494208, -69.870627],
    [18.494120, -69.870633],
    [18.494033, -69.870640],
    [18.493945, -69.870647],
    [18.493858, -69.870653],
    [18.493770, -69.870660],
    [18.493778, -69.870752],
    [18.493785, -69.870843],
    [18.493793, -69.870935],
    [18.493800, -69.871027],
    [18.493808, -69.871118],
    [18.493815, -69.871210],
    [18.493823, -69.871302],
    [18.493830, -69.871393],
    [18.493838, -69.871485],
    [18.493845, -69.871577],
    [18.493853, -69.871668],
    [18.493860, -69.871760],
    [18.493954, -69.871753],
    [18.494047, -69.871745],
    [18.494141, -69.871738],
    [18.494235, -69.871731],
    [18.494328, -69.871724],
    [18.494422, -69.871716],
    [18.494515, -69.871709],
    [18.494609, -69.871702],
    [18.494703, -69.871695],
    [18.494796, -69.871687],
    [18.494890, -69.871680],
  ],
  "Ensanche Ozama": [
    [18.461200, -69.900410],
    [18.461179, -69.900500],
    [18.461157, -69.900590],
    [18.461136, -69.900680],
    [18.461115, -69.900770],
    [18.461093, -69.900860],
    [18.461072, -69.900950],
    [18.461051, -69.901040],
    [18.461029, -69.901130],
    [18.461008, -69.901220],
    [18.460987, -69.901310],
    [18.460965, -69.901400],
    [18.460944, -69.901490],
    [18.460923, -69.901580],
    [18.460901, -69.901670],
    [18.460880, -69.901760],
    [18.460964, -69.901791],
    [18.461049, -69.901821],
    [18.461133, -69.901852],
    [18.461217, -69.901883],
    [18.461301, -69.901914],
    [18.461386, -69.901944],
    [18.461470, -69.901975],
    [18.461554, -69.902006],
    [18.461639, -69.902036],
    [18.461723, -69.902067],
    [18.461807, -69.902098],
    [18.461891, -69.902129],
    [18.461976, -69.902159],
    [18.462060, -69.902190],
    [18.462144, -69.902217],
    [18.462227, -69.902244],
    [18.462311, -69.902271],
    [18.462394, -69.902299],
    [18.462478, -69.902326],
    [18.462561, -69.902353],
    [18.462645, -69.902380],
    [18.462729, -69.902407],
    [18.462812, -69.902434],
    [18.462896, -69.902461],
    [18.462979, -69.902489],
    [18.463063, -69.902516],
    [18.463146, -69.902543],
    [18.463230, -69.902570],
    [18.463269, -69.902482],
    [18.463309, -69.902395],
    [18.463348, -69.902307],
    [18.463388, -69.902220],
    [18.463428, -69.902132],
    [18.463467, -69.902045],
    [18.463507, -69.901957],
    [18.463546, -69.901870],
    [18.463586, -69.901782],
    [18.463625, -69.901695],
    [18.463665, -69.901607],
    [18.463704, -69.901520],
    [18.463743, -69.901432],
    [18.463783, -69.901345],
    [18.463822, -69.901257],
    [18.463862, -69.901170],
    [18.463902, -69.901083],
    [18.463941, -69.900995],
    [18.463981, -69.900908],
    [18.464020, -69.900820],
    [18.463932, -69.900807],
    [18.463844, -69.900794],
    [18.463756, -69.900782],
    [18.463667, -69.900769],
    [18.463579, -69.900756],
    [18.463491, -69.900743],
    [18.463403, -69.900730],
    [18.463315, -69.900717],
    [18.463227, -69.900705],
    [18.463139, -69.900692],
    [18.463051, -69.900679],
    [18.462963, -69.900666],
    [18.462874, -69.900653],
    [18.462786, -69.900641],
    [18.462698, -69.900628],
    [18.462610, -69.900615],
    [18.462522, -69.900602],
    [18.462434, -69.900589],
    [18.462346, -69.900577],
    [18.462257, -69.900564],
    [18.462169, -69.900551],
    [18.462081, -69.900538],
    [18.461993, -69.900525],
    [18.461905, -69.900512],
    [18.461817, -69.900500],
    [18.461729, -69.900487],
    [18.461641, -69.900474],
    [18.461553, -69.900461],
    [18.461464, -69.900448],
    [18.461376, -69.900436],
    [18.461288, -69.900423],
    [18.461200, -69.900410],
  ],
  "Villa Consuelo": [
    [18.505550, -69.884930],
    [18.505607, -69.884860],
    [18.505665, -69.884790],
    [18.505723, -69.884720],
    [18.505780, -69.884650],
    [18.505859, -69.884693],
    [18.505938, -69.884737],
    [18.506017, -69.884780],
    [18.506096, -69.884823],
    [18.506174, -69.884867],
    [18.506253, -69.884910],
    [18.506332, -69.884953],
    [18.506411, -69.884997],
    [18.506490, -69.885040],
    [18.506446, -69.885114],
    [18.506402, -69.885188],
    [18.506358, -69.885262],
    [18.506314, -69.885336],
    [18.506270, -69.885410],
    [18.506190, -69.885357],
    [18.506110, -69.885303],
    [18.506030, -69.885250],
    [18.505950, -69.885197],
    [18.505870, -69.885143],
    [18.505790, -69.885090],
    [18.505710, -69.885037],
    [18.505630, -69.884983],
    [18.505550, -69.884930],
  ],
  "Sabana Perdida": [
    [18.546320, -69.862840],
    [18.546358, -69.862752],
    [18.546395, -69.862665],
    [18.546433, -69.862577],
    [18.546470, -69.862490],
    [18.546508, -69.862402],
    [18.546546, -69.862314],
    [18.546583, -69.862227],
    [18.546621, -69.862139],
    [18.546658, -69.862052],
    [18.546696, -69.861964],
    [18.546734, -69.861876],
    [18.546771, -69.861789],
    [18.546809, -69.861701],
    [18.546846, -69.861614],
    [18.546884, -69.861526],
    [18.546922, -69.861438],
    [18.546959, -69.861351],
    [18.546997, -69.861263],
    [18.547034, -69.861176],
    [18.547072, -69.861088],
    [18.547110, -69.861000],
    [18.547147, -69.860913],
    [18.547185, -69.860825],
    [18.547222, -69.860738],
    [18.547260, -69.860650],
    [18.547276, -69.860742],
    [18.547293, -69.860835],
    [18.547309, -69.860927],
    [18.547325, -69.861019],
    [18.547342, -69.861112],
    [18.547358, -69.861204],
    [18.547374, -69.861296],
    [18.547391, -69.861389],
    [18.547407, -69.861481],
    [18.547423, -69.861573],
    [18.547440, -69.861666],
    [18.547456, -69.861758],
    [18.547472, -69.861850],
    [18.547489, -69.861943],
    [18.547505, -69.862035],
    [18.547521, -69.862127],
    [18.547538, -69.862220],
    [18.547554, -69.862312],
    [18.547570, -69.862404],
    [18.547587, -69.862497],
    [18.547603, -69.862589],
    [18.547619, -69.862681],
    [18.547636, -69.862774],
    [18.547652, -69.862866],
    [18.547668, -69.862958],
    [18.547685, -69.863051],
    [18.547701, -69.863143],
    [18.547717, -69.863235],
    [18.547734, -69.863328],
    [18.547750, -69.863420],
    [18.547666, -69.863386],
    [18.547582, -69.863352],
    [18.547498, -69.863318],
    [18.547414, -69.863284],
    [18.547329, -69.863249],
    [18.547245, -69.863215],
    [18.547161, -69.863181],
    [18.547077, -69.863147],
    [18.546993, -69.863113],
    [18.546909, -69.863079],
    [18.546825, -69.863045],
    [18.546741, -69.863011],
    [18.546656, -69.862976],
    [18.546572, -69.862942],
    [18.546488, -69.862908],
    [18.546404, -69.862874],
    [18.546320, -69.862840],
  ],
  "Los Guaricanos": [
    [18.542980, -69.932750],
    [18.543067, -69.932737],
    [18.543154, -69.932724],
    [18.543241, -69.932711],
    [18.543328, -69.932698],
    [18.543415, -69.932685],
    [18.543502, -69.932672],
    [18.543589, -69.932659],
    [18.543676, -69.932646],
    [18.543763, -69.932633],
    [18.543850, -69.932620],
    [18.543867, -69.932530],
    [18.543884, -69.932440],
    [18.543901, -69.932350],
    [18.543919, -69.932260],
    [18.543936, -69.932170],
    [18.543953, -69.932080],
    [18.543970, -69.931990],
    [18.543887, -69.931944],
    [18.543804, -69.931898],
    [18.543721, -69.931852],
    [18.543638, -69.931806],
    [18.543555, -69.931760],
    [18.543472, -69.931714],
    [18.543389, -69.931668],
    [18.543306, -69.931622],
    [18.543223, -69.931576],
    [18.543140, -69.931530],
    [18.543128, -69.931624],
    [18.543115, -69.931718],
    [18.543103, -69.931812],
    [18.543091, -69.931905],
    [18.543078, -69.931999],
    [18.543066, -69.932093],
    [18.543054, -69.932187],
    [18.543042, -69.932281],
    [18.543029, -69.932375],
    [18.543017, -69.932468],
    [18.543005, -69.932562],
    [18.542992, -69.932656],
    [18.542980, -69.932750],
  ],
  "Santo Domingo Norte": [
    [18.551370, -69.899340],
    [18.551456, -69.899320],
    [18.551542, -69.899300],
    [18.551628, -69.899280],
    [18.551714, -69.899260],
    [18.551800, -69.899240],
    [18.551823, -69.899327],
    [18.551846, -69.899414],
    [18.551869, -69.899501],
    [18.551892, -69.899588],
    [18.551915, -69.899675],
    [18.551938, -69.899762],
    [18.551961, -69.899849],
    [18.551984, -69.899936],
    [18.552007, -69.900023],
    [18.552030, -69.900110],
    [18.551939, -69.900136],
    [18.551847, -69.900161],
    [18.551756, -69.900187],
    [18.551664, -69.900213],
    [18.551573, -69.900239],
    [18.551481, -69.900264],
    [18.551390, -69.900290],
    [18.551388, -69.900195],
    [18.551386, -69.900100],
    [18.551384, -69.900005],
    [18.551382, -69.899910],
    [18.551380, -69.899815],
    [18.551378, -69.899720],
    [18.551376, -69.899625],
    [18.551374, -69.899530],
    [18.551372, -69.899435],
    [18.551370, -69.899340],
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
