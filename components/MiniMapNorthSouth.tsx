"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Maximize2 } from 'lucide-react';

interface MiniMapNorthSouthProps {
    lat: number;
    lng: number;
    cityName: string;
}

export default function MiniMapNorthSouth({ lat, lng, cityName }: MiniMapNorthSouthProps) {
    const miniRef = useRef<HTMLDivElement>(null);
    const expandedRef = useRef<HTMLDivElement>(null);
    const miniMapRef = useRef<L.Map | null>(null);
    const expandedMapRef = useRef<L.Map | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Track whether we're in the browser (for portal)
    useEffect(() => { setMounted(true); }, []);

    // Mini map effect
    useEffect(() => {
        if (!miniRef.current || expanded) return;

        if (miniMapRef.current) {
            miniMapRef.current.remove();
            miniMapRef.current = null;
        }

        const map = L.map(miniRef.current, {
            center: [lat, lng],
            zoom: 5,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            keyboard: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        const markerIcon = L.divIcon({
            className: 'custom-marker-mini',
            html: `<div style="
                width: 12px; height: 12px;
                background: #3b82f6;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 8px rgba(59,130,246,0.6);
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });

        L.marker([lat, lng], { icon: markerIcon }).addTo(map);
        miniMapRef.current = map;

        setTimeout(() => map.invalidateSize(), 50);

        return () => {
            if (miniMapRef.current) {
                miniMapRef.current.remove();
                miniMapRef.current = null;
            }
        };
    }, [lat, lng, expanded]);

    // Expanded map effect
    useEffect(() => {
        if (!expandedRef.current || !expanded) return;

        if (expandedMapRef.current) {
            expandedMapRef.current.remove();
            expandedMapRef.current = null;
        }

        const timer = setTimeout(() => {
            if (!expandedRef.current) return;

            const map = L.map(expandedRef.current, {
                center: [lat, lng],
                zoom: 7,
                zoomControl: true,
                attributionControl: false,
                dragging: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                touchZoom: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map);

            const markerIcon = L.divIcon({
                className: 'custom-marker-expanded',
                html: `<div style="
                    width: 16px; height: 16px;
                    background: #3b82f6;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 12px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.3);
                "></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });

            L.marker([lat, lng], { icon: markerIcon }).addTo(map);
            expandedMapRef.current = map;

            map.invalidateSize();
            setTimeout(() => map.invalidateSize(), 200);
            setTimeout(() => map.invalidateSize(), 500);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (expandedMapRef.current) {
                expandedMapRef.current.remove();
                expandedMapRef.current = null;
            }
        };
    }, [lat, lng, expanded]);

    // The expanded overlay — rendered via Portal to escape the CSS transform stacking context
    const expandedOverlay = expanded && mounted ? createPortal(
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
            style={{ zIndex: 9999 }}
            onClick={(e) => { if (e.target === e.currentTarget) setExpanded(false); }}
        >
            <div 
                className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl"
                style={{ width: '90vw', maxWidth: '700px', height: '70vh', maxHeight: '600px' }}
            >
                <div ref={expandedRef} style={{ width: '100%', height: '100%' }} />
                
                {/* North/South gradient overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 500 }}>
                    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-orange-500/10 to-transparent" />
                </div>

                {/* N / S labels */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-white border border-white/20" style={{ zIndex: 600 }}>
                    ⬆ Nord
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-orange-500/15 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-orange-300 border border-orange-500/20" style={{ zIndex: 600 }}>
                    ⬇ Sud
                </div>

                {/* City name label */}
                <div className="absolute top-3 left-3 bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-blue-300 border border-blue-500/20" style={{ zIndex: 600 }}>
                    📍 {cityName}
                </div>

                {/* Close button */}
                <button
                    onClick={() => setExpanded(false)}
                    className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
                    style={{ zIndex: 600 }}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {/* Mini version - circular map */}
            <div
                onClick={() => setExpanded(true)}
                className="cursor-pointer group relative"
                title="Cliquer pour agrandir"
                style={{ display: expanded ? 'none' : 'block' }}
            >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl relative">
                    <div ref={miniRef} className="w-full h-full" />
                    
                    {/* North/South gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden" style={{ zIndex: 500 }}>
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-500/25 to-transparent" />
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/30 -translate-y-1/2" />
                    </div>

                    {/* N / S labels */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" style={{ zIndex: 600 }}>N</div>
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-orange-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" style={{ zIndex: 600 }}>S</div>
                </div>

                {/* Expand icon hint */}
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ zIndex: 700 }}>
                    <Maximize2 className="w-3 h-3 text-white" />
                </div>
            </div>

            {/* Portal-rendered expanded overlay */}
            {expandedOverlay}
        </>
    );
}
