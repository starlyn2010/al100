"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import { useEffect } from "react"
import { mapConfig } from "@/lib/mapbox"

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
}

const truckIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;background:#22C55E;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #0F172A;box-shadow:0 0 20px rgba(34,197,94,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M5 17H3V6a1 1 0 0 1 1-1h9v12H7"/><path d="M15 17h2v-4l-2-3h-4v7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function TruckMap({
  trucks,
  center = mapConfig.defaultCenter,
  zoom = mapConfig.defaultZoom,
  routePaths = [],
}: TruckMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer url={mapConfig.tileUrl} attribution={mapConfig.attribution} />
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
      {trucks.map((truck) => (
        <Marker
          key={truck.id}
          position={[truck.lat, truck.lng]}
          icon={truckIcon}
        >
          <Popup>
            <div className="text-sm">
              <strong>{truck.name}</strong>
              <br />
              <span className="text-gray-500">{truck.status === "on_route" ? "En ruta" : truck.status}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
