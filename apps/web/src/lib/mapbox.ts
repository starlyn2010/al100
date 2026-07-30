export const mapboxConfig = {
  token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
  style: "mapbox://styles/mapbox/dark-v11",
  defaultCenter: [-69.889, 18.486] as [number, number],
  defaultZoom: 12,
};
