"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ComplaintMapProps {
  lat: number;
  lng: number;
}

export default function ComplaintMap({ lat, lng }: ComplaintMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="map-placeholder" />;

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>

      <style jsx>{`
        .map-wrapper {
          width: 100%;
          height: 250px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
          margin-top: 16px;
        }
        .map-placeholder {
          width: 100%;
          height: 250px;
          background: var(--bg-2);
          border-radius: var(--radius-md);
          margin-top: 16px;
        }
        :global(.map-container) {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
