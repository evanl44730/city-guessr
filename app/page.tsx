"use client";

import MapWrapper from '@/components/MapWrapper';
import SearchInput from '@/components/SearchInput';
import GameOverlay from '@/components/GameOverlay';
import { useGame } from '@/hooks/useGame';

export default function Home() {
  const {
    targetCity,
    guesses,
    attempts,
    gameState,
    currentZoom,
    submitGuess,
    restartGame
  } = useGame();

  const center: [number, number] = targetCity
    ? [targetCity.coords.lat, targetCity.coords.lng]
    : [46.603354, 1.888334]; // Default to France center if not ready (though useGame inits it)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-slate-50">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-6 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 tracking-tight">
          City<span className="text-blue-600">Guessr</span>
        </h1>

        <div className="w-full max-w-md z-20">
          <SearchInput
            onSelect={submitGuess}
            disabled={gameState !== 'playing'}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-4 relative">
        <div className="absolute top-4 right-4 z-10 w-full max-w-xs pointer-events-none">
          <div className="pointer-events-auto">
            <GameOverlay
              attempts={attempts}
              guesses={guesses}
              gameState={gameState}
              targetCity={targetCity}
              onRestart={restartGame}
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white p-1 shadow-sm h-[60vh] md:h-[70vh]">
          <MapWrapper
            center={center}
            zoom={currentZoom}
            guesses={guesses}
            targetCity={targetCity}
            gameState={gameState}
          />
        </div>
      </div>

      <footer className="mt-8 text-center text-slate-400 text-sm">
        Devinez la ville cachée • Zoom progressif à chaque erreur
      </footer>
    </main>
  );
}
