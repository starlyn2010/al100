const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

export interface RouteResult {
  points: [number, number][]
  distance: number
  duration: number
}

export async function fetchStreetRoute(
  waypoints: [number, number][]
): Promise<RouteResult | null> {
  if (waypoints.length < 2) return null

  const coords = waypoints
    .map(([lat, lng]) => `${lng},${lat}`)
    .join(";")

  try {
    const res = await fetch(
      `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=false`
    )
    if (!res.ok) return null

    const data = await res.json()
    if (!data.routes?.length) return null

    const route = data.routes[0]
    const coordsArray = route.geometry.coordinates as [number, number][]

    return {
      points: coordsArray.map(([lng, lat]) => [lat, lng] as [number, number]),
      distance: Math.round(route.distance),
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
