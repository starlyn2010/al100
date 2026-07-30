"use client"

import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { useState } from "react"
import { Truck } from "lucide-react"

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
  height?: string
}

export default function TruckMap({
  trucks,
  center = [-69.889, 18.486],
  zoom = 12,
}: TruckMapProps) {
  const [popup, setPopup] = useState<TruckData | null>(null)

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ longitude: center[0], latitude: center[1], zoom }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      <NavigationControl position="top-right" />

      {trucks.map((truck) => (
        <Marker
          key={truck.id}
          longitude={truck.lng}
          latitude={truck.lat}
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            setPopup(truck)
          }}
        >
          <div className="relative cursor-pointer">
            <div className="absolute -inset-2 bg-accent/20 rounded-full animate-ping" />
            <div className="relative w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30 border-2 border-background">
              <Truck className="w-5 h-5 text-white" />
            </div>
          </div>
        </Marker>
      ))}

      {popup && (
        <Popup
          longitude={popup.lng}
          latitude={popup.lat}
          onClose={() => setPopup(null)}
          closeButton={true}
          className="z-50"
        >
          <div className="p-2 min-w-[150px]">
            <p className="font-bold text-sm">{popup.name}</p>
            <p className="text-xs text-muted-foreground">
              {popup.status === "on_route" ? "En ruta" : popup.status}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  )
}
