import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EUROPEAN_COUNTRIES } from '@/data/europe';

interface EuropeMapSelectorProps {
    onSelectCountry: (countryId: string) => void;
    progress: Record<number, number>;
}

export default function EuropeMapSelector({ onSelectCountry, progress }: EuropeMapSelectorProps) {
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        fetch('/data/europe.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Error loading Europe GeoJSON:", err));
    }, []);

    if (!geoData) {
        return (
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const getCountryStatus = (isoA2: string) => {
        // europe.geojson typically uses ISO_A2 or ISO_A3 or FIPS
        // Let's assume it has properties.iso_a2
        return EUROPEAN_COUNTRIES.some(c => c.id === isoA2);
    };

    const style = (feature: any) => {
        // LeakyMirror's europe.geojson uses 'iso_a2'
        const isoA2 = feature.properties.iso_a2 || feature.properties.ISO2;
        const isSupported = getCountryStatus(isoA2);

        return {
            fillColor: isSupported ? '#10b981' : '#1e293b', // Emerald if supported
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: isSupported ? 0.4 : 0.1
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const isoA2 = feature.properties.iso_a2 || feature.properties.ISO2;
        const countryName = feature.properties.name || feature.properties.NAME;
        const isSupported = getCountryStatus(isoA2);

        if (isSupported) {
            const countryMeta = EUROPEAN_COUNTRIES.find(c => c.id === isoA2);
            const flagUrl = `https://flagcdn.com/w40/${isoA2.toLowerCase()}.png`;

            layer.on({
                mouseover: (e: any) => {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 2,
                        color: '#34d399',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                    layer.bringToFront();
                },
                mouseout: (e: any) => {
                    layer.setStyle(style(feature));
                },
                click: () => {
                    onSelectCountry(`country_${isoA2}`);
                }
            });

            const popupContent = `
                <div class="flex items-center gap-2">
                    <img src="${flagUrl}" class="h-4 w-6 rounded-sm shadow-sm" />
                    <span>${countryName}</span>
                </div>
            `;

            layer.bindTooltip(popupContent, {
                sticky: true,
                direction: 'auto',
                className: 'bg-slate-900 text-white font-bold border-white/20 px-3 py-1.5 rounded-xl shadow-xl'
            });
        } else {
            layer.bindTooltip(`${countryName} (Non disponible)`, {
                sticky: true,
                className: 'bg-slate-900/80 text-slate-400 border-white/10 px-3 py-1 rounded-xl'
            });
        }
    };

    return (
        <div className="w-full h-[50vh] md:h-[65vh] min-h-[400px] rounded-2xl overflow-hidden border border-white/10 relative bg-slate-800/50 shadow-inner">
            <MapContainer
                center={[54.5260, 15.2551]} // Center of Europe
                zoom={3.5}
                zoomControl={false}
                scrollWheelZoom={true}
                dragging={true}
                className="w-full h-full bg-transparent"
                style={{ background: 'transparent' }}
            >
                <GeoJSON
                    data={geoData}
                    style={style}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>

            {/* Overlay Gradient to blend with background */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] z-[400]"></div>
        </div>
    );
}
