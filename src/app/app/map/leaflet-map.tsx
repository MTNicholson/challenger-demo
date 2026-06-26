"use client";

import L from "leaflet";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import type { MapChallengePoint } from "@/data/map-challenges";
import styles from "./user-map.module.css";

const center: [number, number] = [59.9386, 30.3141];

type LeafletChallengeMapProps = {
  points: MapChallengePoint[];
  selectedPointId: string;
  onSelectPoint: (point: MapChallengePoint) => void;
};

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
    html: `<span class="challenge-map-marker${selected ? " is-selected" : ""}"><span>${point.emoji}</span></span>`,
    iconSize: selected ? [52, 58] : [44, 50],
    iconAnchor: selected ? [26, 54] : [22, 46],
  });
}

export function LeafletChallengeMap({
  points,
  selectedPointId,
  onSelectPoint,
}: LeafletChallengeMapProps) {
  return (
    <MapContainer
      className={styles.mapCanvas}
      center={center}
      zoom={13}
      minZoom={11}
      maxZoom={18}
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ZoomControl position="topright" />
      <MapSizeFix />

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
