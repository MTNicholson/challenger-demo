"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  ZoomControl,
  useMap,
} from "react-leaflet";
import type { MapChallengePoint } from "@/data/map-challenges";
import type { MapBrandLocation } from "./map-screen";
import styles from "./user-map.module.css";

const center: [number, number] = [59.9386, 30.3141];

type LeafletChallengeMapProps = {
  points: MapChallengePoint[];
  locations: MapBrandLocation[];
  selectedPointId: string;
  selectedLocationId: string | null;
  selectedLocation?: MapBrandLocation | null;
  onSelectPoint: (point: MapChallengePoint) => void;
  onSelectLocation: (location: MapBrandLocation) => void;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function MapSizeFix() {
  const map = useMap();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [map]);

  return null;
}

function createMarkerIcon(point: MapChallengePoint, selected: boolean) {
  return L.divIcon({
    className: "challenge-map-marker-wrap",
    html: `<span class="challenge-map-marker${selected ? " is-selected" : ""}"><span>${escapeHtml(point.emoji)}</span></span>`,
    iconSize: selected ? [52, 58] : [44, 50],
    iconAnchor: selected ? [26, 54] : [22, 46],
  });
}

function createLocationIcon(location: MapBrandLocation, selected: boolean, showBrandName: boolean) {
  const logo = location.brand.logoUrl
    ? `<img src="${escapeHtml(location.brand.logoUrl)}" alt="" />`
    : `<span>${escapeHtml(location.brand.name.trim()[0]?.toLocaleUpperCase("ru-RU") ?? "Б")}</span>`;
  return L.divIcon({
    className: "challenge-map-marker-wrap",
    html: `<span class="challenge-map-marker brand-location-marker${selected ? " is-selected" : ""}"><span class="brand-marker-logo">${logo}</span></span>${showBrandName ? `<span class="brand-marker-label">${escapeHtml(location.brand.name)}</span>` : ""}`,
    iconSize: showBrandName ? [150, selected ? 80 : 72] : selected ? [54, 60] : [46, 52],
    iconAnchor: selected ? [27, 56] : [23, 48],
  });
}

function MapZoomObserver({ onChange }: { onChange: (zoom: number) => void }) {
  const map = useMapEvents({ zoomend: () => onChange(map.getZoom()) });
  useEffect(() => onChange(map.getZoom()), [map, onChange]);
  return null;
}

function SelectedLocationCenter({
  selectedLocation,
}: {
  selectedLocation?: MapBrandLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocation || selectedLocation.lat === null || selectedLocation.lng === null) return;
    map.setView([selectedLocation.lat, selectedLocation.lng], 16, { animate: true });
  }, [map, selectedLocation]);

  return null;
}

export function LeafletChallengeMap({
  points,
  locations,
  selectedPointId,
  selectedLocationId,
  selectedLocation,
  onSelectPoint,
  onSelectLocation,
}: LeafletChallengeMapProps) {
  const [zoom, setZoom] = useState(12);
  const initialCenter: [number, number] =
    selectedLocation && selectedLocation.lat !== null && selectedLocation.lng !== null
      ? [selectedLocation.lat, selectedLocation.lng]
      : center;

  return (
    <MapContainer
      className={styles.mapCanvas}
      center={initialCenter}
      zoom={initialCenter === center ? 12 : 16}
      minZoom={10}
      maxZoom={18}
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        maxZoom={19}
      />
      <ZoomControl position="topright" />
      <MapSizeFix />
      <MapZoomObserver onChange={setZoom} />
      <SelectedLocationCenter selectedLocation={selectedLocation} />

      {locations.map((location) => (
        location.lat !== null && location.lng !== null ? (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createLocationIcon(location, location.id === selectedLocationId, zoom >= 15)}
            title={`${location.brand.name}: ${location.name ?? "Точка бренда"}`}
            eventHandlers={{ click: () => onSelectLocation(location) }}
          />
        ) : null
      ))}

      {points.map((point) => (
        <Marker
          key={point.id}
          position={point.coordinates}
          icon={createMarkerIcon(point, point.id === selectedPointId)}
          title={`${point.brand}: ${point.challenge}`}
          eventHandlers={{ click: () => onSelectPoint(point) }}
        />
      ))}
    </MapContainer>
  );
}
