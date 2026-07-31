const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

export interface RouteResult {
  points: [number, number][]
  distance: number
  duration: number
}

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export async function fetchStreetRoute(
  waypoints: [number, number][]
): Promise<RouteResult | null> {
  if (waypoints.length < 2) return null

  const coords = waypoints
    .map(([lat, lng]) => `${lng},${lat}`)
    .join(";")

  const directDistance = waypoints
    .slice(1)
    .reduce((sum, point, i) => sum + haversine(waypoints[i], point), 0)

  try {
    const res = await fetch(
      `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=false`
    )
    if (!res.ok) return null

    const data = await res.json()
    if (!data.routes?.length) return null

    const route = data.routes[0]
    const coordsArray = route.geometry.coordinates as [number, number][]

    const routeDistance = route.distance as number
    if (routeDistance > directDistance * 4) {
      return null
    }

    return {
      points: coordsArray.map(([lng, lat]) => [lat, lng] as [number, number]),
      distance: Math.round(routeDistance),
      duration: Math.round(route.duration),
    }
  } catch {
    return null
  }
}

export async function fetchSingleRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteResult | null> {
  return fetchStreetRoute([start, end])
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}
