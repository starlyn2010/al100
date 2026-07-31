"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useEffect, useState } from "react"
import { getTileUrl, mapConfig } from "@/lib/mapbox"

interface TruckData {
  id: string
  name: string
  lat: number
  lng: number
  status: string
}

interface TruckMapProps {
  trucks: TruckData[]
  center?: [number, number]
  zoom?: number
  routePaths?: Array<{
    id: string
    points: [number, number][]
    color?: string
    label?: string
  }>
  dark?: boolean
}

const truckIcon = (isDark: boolean) => L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;background:#22C55E;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid ${isDark ? "#0F172A" : "#FFFFFF"};box-shadow:0 0 20px rgba(34,197,94,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M5 17H3V6a1 1 0 0 1 1-1h9v12H7"/><path d="M15 17h2v-4l-2-3h-4v7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const startIcon = (color: string, isDark: boolean) => L.divIcon({
  className: "",
  html: `<div style="position:relative;width:28px;height:30px;">
    <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:13px solid ${color};filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35));"></div>
    <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:11px;height:11px;background:${color};border-radius:50%;border:2px solid ${isDark ? "#0F172A" : "#FFFFFF"};"></div>
  </div>`,
  iconSize: [28, 30],
  iconAnchor: [14, 28],
})

function closestPointOnRoutes(
  lat: number,
  lng: number,
  routePaths: NonNullable<TruckMapProps["routePaths"]>
): [number, number] {
  let best: [number, number] | null = null
  let bestDist = Infinity
  for (const route of routePaths) {
    for (const [plat, plng] of route.points) {
      const d = (plat - lat) ** 2 + (plng - lng) ** 2
      if (d < bestDist) {
        bestDist = d
        best = [plat, plng]
      }
    }
  }
  return best || [lat, lng]
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function ZoomPersist() {
  useMapEvents({
    zoomend: (e) => {
      try { localStorage.setItem("al100_map_zoom", String(e.target.getZoom())) } catch {}
    },
  })
  return null
}

export default function TruckMap({
  trucks,
  center = mapConfig.defaultCenter,
  zoom: zoomProp = mapConfig.defaultZoom,
  routePaths = [],
  dark = true,
}: TruckMapProps) {
  const [zoom] = useState(() => {
    if (typeof window === "undefined") return zoomProp
    try {
      const saved = window.localStorage.getItem("al100_map_zoom")
      return saved ? Number(saved) : zoomProp
    } catch {
      return zoomProp
    }
  })

  const startMarkers = routePaths.filter((route) => route.points.length > 0)

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <ChangeView center={center} zoom={zoom} />
      <ZoomPersist />
      <TileLayer url={getTileUrl(dark)} attribution={mapConfig.attribution} />
      {routePaths.map((route, idx) => (
        <Polyline
          key={route.id}
          positions={route.points}
          pathOptions={{
            color: route.color || "#22C55E",
            weight: idx === 0 && route.id === "driver-route-history" ? 6 : 4,
            opacity: idx === 0 && route.id === "driver-route-history" ? 0.6 : 0.9,
            lineCap: "round",
            lineJoin: "round",
            dashArray: route.id === "driver-route-history" ? undefined : "6 6",
          }}
        />
      ))}
      {startMarkers.map((route) => (
        <Marker
          key={`start-${route.id}`}
          position={route.points[0]}
          icon={startIcon(route.color || "#22C55E", dark)}
        >
          <Popup>
            <div className="text-sm">
              <strong>Inicio de ruta</strong>
              {route.label && (
                <>
                  <br />
                  <span className="text-gray-500">{route.label}</span>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {trucks.map((truck) => {
        const snapped = closestPointOnRoutes(truck.lat, truck.lng, routePaths)
        return (
          <Marker
            key={truck.id}
            position={snapped}
            icon={truckIcon(dark)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{truck.name}</strong>
                <br />
                <span className="text-gray-500">{truck.status === "on_route" ? "En ruta" : truck.status}</span>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
