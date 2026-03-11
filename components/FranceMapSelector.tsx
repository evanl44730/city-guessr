import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEPARTMENTS } from '@/data/departments';

interface FranceMapSelectorProps {
    onSelectDepartment: (deptId: string) => void;
    progress: Record<number, number>;
}

export default function FranceMapSelector({ onSelectDepartment, progress }: FranceMapSelectorProps) {
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        fetch('/data/france-departments-dom.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Error loading France GeoJSON:", err));
    }, []);

    if (!geoData) {
        return (
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Function to calculate department progress
    const getDeptStatus = (deptId: string) => {
        // Find if any level for this department is completed or played
        // Typically dept keys are like dept_01, but levels are just IDs
        // The StoryMenu itself filters levels and passes progress. 
        // For visual, we can just say: if they have any progress > 0, light it up.
        // Actually, let's just use the DEPARTMENTS list to check if it's supported

        const isSupported = DEPARTMENTS.some(d => d.id === deptId);
        return isSupported;
    };

    const style = (feature: any) => {
        const deptId = feature.properties.code;
        const isSupported = getDeptStatus(deptId);

        return {
            fillColor: isSupported ? '#3b82f6' : '#1e293b', // Blue if supported, dark slate if not
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: isSupported ? 0.3 : 0.1
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        const deptId = feature.properties.code;
        const deptName = feature.properties.nom;
        const isSupported = getDeptStatus(deptId);

        if (isSupported) {
            layer.on({
                mouseover: (e: any) => {
                    const l = e.target;
                    l.setStyle({
                        weight: 2,
                        color: '#60a5fa',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                    l.bringToFront();
                },
                mouseout: (e: any) => {
                    layer.setStyle(style(feature));
                },
                click: () => {
                    onSelectDepartment(`dept_${deptId}`);
                }
            });
            layer.bindTooltip(`${deptId} - ${deptName}`, { sticky: true, className: 'bg-slate-900 text-white font-bold border-white/20 px-3 py-1 rounded-xl shadow-xl' });
        } else {
            layer.bindTooltip(`${deptId} - ${deptName} (Non disponible)`, { sticky: true, className: 'bg-slate-900/80 text-slate-400 border-white/10 px-3 py-1 rounded-xl' });
        }
    };

    // Dynamic bounds fitter for sub-maps
    const MapFitter = ({ data }: { data: any }) => {
        const map = useMap();
        useEffect(() => {
            if (data && data.features && data.features.length > 0) {
                const layer = L.geoJSON(data);
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [5, 5] });
                }
            }
        }, [map, data]);
        return null;
    };

    // Sub-component for rendering a DOM inset map
    const DomInsetMap = ({ id, title }: { id: string, title: string }) => {
        // Filter the geoData for just this specific DOM
        const domFeature = geoData.features.find((f: any) => f.properties.code === id);
        if (!domFeature) return null;

        const singleGeoData = {
            type: "FeatureCollection" as const,
            features: [domFeature]
        };

        return (
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">{title}</span>
                <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900/50 border border-white/20 rounded-xl overflow-hidden shadow-lg relative group transition-all hover:scale-110 hover:border-blue-400 hover:shadow-blue-500/20 hover:z-50 cursor-pointer"
                    onClick={() => {
                        if (getDeptStatus(id)) onSelectDepartment(`dept_${id}`);
                    }}
                >
                    <MapContainer
                        zoomControl={false}
                        scrollWheelZoom={false}
                        dragging={false}
                        doubleClickZoom={false}
                        attributionControl={false}
                        className="w-full h-full bg-transparent pointer-events-none"
                        style={{ background: 'transparent' }}
                    >
                        <MapFitter data={singleGeoData as any} />
                        <GeoJSON
                            data={singleGeoData as any}
                            style={style}
                        />
                    </MapContainer>
                    <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/10 pointer-events-none transition-colors" />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-[50vh] md:h-[65vh] min-h-[400px] rounded-2xl overflow-hidden border border-white/10 relative bg-slate-800/50 shadow-inner flex flex-col md:flex-row">

            {/* Main map container */}
            <div className="flex-1 relative h-full">
                <MapContainer
                    center={[46.603354, 1.888334]}
                    zoom={5.5}
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
                        filter={(feature) => !['971', '972', '973', '974', '976'].includes(feature.properties.code)}
                    />
                </MapContainer>
            </div>

            {/* DOM Insets Panel */}
            <div className="absolute bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:w-32 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 p-2 md:p-3 shadow-2xl flex flex-row md:flex-col gap-2 md:gap-4 justify-around md:justify-start overflow-x-auto md:overflow-y-auto z-[500]">
                <DomInsetMap id="971" title="Guadeloupe" />
                <DomInsetMap id="972" title="Martinique" />
                <DomInsetMap id="973" title="Guyane" />
                <DomInsetMap id="974" title="La Réunion" />
                <DomInsetMap id="976" title="Mayotte" />
            </div>

            {/* Overlay Gradient to blend with background (only on main map) */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] z-[400]"></div>
        </div>
    );
}
