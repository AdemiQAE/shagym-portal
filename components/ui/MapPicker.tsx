"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return lat && lng ? (
    <Marker position={[lat, lng]} icon={icon} />
  ) : null;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="map-placeholder" />;

  const defaultPos: [number, number] = [43.2389, 76.8897]; // Almaty

  return (
    <div className="map-wrapper">
      <MapContainer
        center={lat && lng ? [lat, lng] : defaultPos}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>

      <style jsx>{`
        .map-wrapper {
          width: 100%;
          height: 300px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .map-placeholder {
          width: 100%;
          height: 300px;
          background: var(--bg-2);
          border-radius: var(--radius-md);
        }
        :global(.map-container) {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
