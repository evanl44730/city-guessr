import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CityData } from '@/utils/gameUtils';

interface HeatmapProps {
    foundCities: CityData[];
}

export default function Heatmap({ foundCities }: HeatmapProps) {
    return (
        <MapContainer
            center={[46.603354, 1.888334]}
            zoom={5}
            style={{ width: '100%', height: '100%', background: '#0f172a' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {foundCities.map((city, idx) => (
                <CircleMarker
                    key={`${city.name}-${idx}`}
                    center={[city.coords.lat, city.coords.lng]}
                    radius={7}
                    fillColor="#ef4444"
                    color="#b91c1c"
                    weight={1}
                    fillOpacity={0.6}
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <span className="font-bold text-slate-900">{city.name}</span>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
