"use client";

import dynamic from "next/dynamic";

// Define the props interface to match MapComponent
import type { CityData } from "@/utils/gameUtils";
import type { Guess, GameState } from "@/hooks/useGame";

interface MapWrapperProps {
    center: [number, number];
    zoom: number;
    guesses: Guess[];
    targetCity: CityData | null;
    gameState: GameState;
}

const MapComponent = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => <div className="h-[60vh] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>,
});

export default function MapWrapper(props: MapWrapperProps) {
    return <MapComponent {...props} />;
}
