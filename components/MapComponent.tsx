"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CityData } from "@/utils/gameUtils";
import { Guess, GameState } from "@/hooks/useGame";

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  center: [number, number]; // Lat, Lng
  zoom: number;
  guesses: Guess[];
  targetCity: CityData | null;
  gameState: GameState;
}

function MapController({ center, zoom, gameState }: { center: [number, number]; zoom: number; gameState: GameState }) {
  const map = useMap();

  useEffect(() => {
    // 1. Clear constraints to allow movement
    map.setMinZoom(1);
    map.setMaxBounds(null as any);

    // 2. Fly to the new view
    map.flyTo(center, zoom, {
      duration: 2,
      easeLinearity: 0.5
    });

    // 3. Set constraints after movement (or immediately if not playing to ensure responsiveness)
    if (gameState === 'playing') {
      const applyConstraints = () => {
        // Calculate bounds for the current zoom level to restrict panning
        const delta = 360 / Math.pow(2, zoom) * 1.5;
        const southWest = L.latLng(center[0] - delta, center[1] - delta);
        const northEast = L.latLng(center[0] + delta, center[1] + delta);
        const bounds = L.latLngBounds(southWest, northEast);


        map.setMinZoom(zoom);
        map.setMaxBounds(bounds);
      };

      // Apply constraints only after the fly animation finishes to prevent "shaking"
      // caused by the current view being outside the new target bounds
      map.once('moveend', applyConstraints);

      // Cleanup listener if effect re-runs
      return () => {
        map.off('moveend', applyConstraints);
      };
    }
  }, [center, zoom, map, gameState]);

  return null;
}

export default function MapComponent({ center, zoom, guesses, targetCity, gameState }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-slate-100 flex items-center justify-center">Loading Map...</div>;
  }

  const targetMarkerRef = (node: L.Marker | null) => {
    if (node) {
      node.openPopup();
    }
  };

  return (
    <div className="h-[60vh] w-full relative z-0">
      <MapContainer
        center={[46.603354, 1.888334]} // Static initial center (France)
        zoom={6} // Static initial zoom
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        zoomControl={false}
        minZoom={zoom}
        maxBoundsViscosity={1.0}
        className="h-full w-full rounded-lg shadow-md"
      >
        <MapController center={center} zoom={zoom} gameState={gameState} />

        {/* Esri World Imagery (Satellite) */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Guesses Markers */}
        {guesses.map((guess, idx) => (
          <Marker
            key={`${guess.city.name}-${idx}`}
            position={[guess.city.coords.lat, guess.city.coords.lng]}
            icon={redIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>{guess.city.name}</strong><br />
                {Math.round(guess.distance)} km<br />
                {guess.direction}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Target City Marker - Show only if Game Over */}
        {gameState !== 'playing' && targetCity && (
          <Marker
            position={[targetCity.coords.lat, targetCity.coords.lng]}
            icon={greenIcon}
            ref={targetMarkerRef}
          >
            <Popup autoClose={false} closeOnClick={false}>
              <div className="text-center">
                <strong className="text-green-600">CIBLE</strong><br />
                {targetCity.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Line showing path from last guess to target on defeat */}
        {gameState === 'lost' && targetCity && guesses.length > 0 && (
          <Polyline
            positions={[
              [guesses[guesses.length - 1].city.coords.lat, guesses[guesses.length - 1].city.coords.lng],
              [targetCity.coords.lat, targetCity.coords.lng]
            ]}
            color="red"
            dashArray="10, 10"
          />
        )}

      </MapContainer>
    </div>
  );
}
