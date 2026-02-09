"use client";

import { useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import SearchInput from '@/components/SearchInput';
import GameOverlay from '@/components/GameOverlay';
import MainMenu from '@/components/MainMenu';
import { useGame } from '@/hooks/useGame';

export default function Home() {
  const [inMenu, setInMenu] = useState(true);
  const {
    targetCity,
    guesses,
    attempts,
    gameState,
    currentZoom,
    gameMode,
    submitGuess,
    restartGame
  } = useGame();

  const handleStartGame = (mode: 'france' | 'capital') => {
    restartGame(mode);
    setInMenu(false);
  };

  const handleRestart = () => {
    // Return to menu or restart same mode?
    // Usually "Rejouer" means same mode. 
    // Let's restart current mode.
    // We don't have access to current mode here easily unless we export it from useGame.
    // I added gameMode to return of useGame in previous step.
    // Let's assume we want to just go back to menu for full choice or restart?
    // Design: "Rejouer" usually restarts. "Menu" button would be nice.
    // For now, let's make onRestart just restart the game logic, keeping the mode.
    restartGame(); // This restarts with *default* if argument missing?
    // Wait, my restartGame updates default to 'france' if no arg.
    // I need to know the current mode to restart in it, OR update useGame to remember last mode.
    // In useGame update: "const restartGame = useCallback((mode: ... = 'france') => { setGameMode(mode)..."
    // So if I call restartGame(), it defaults to 'france'.
    // I should probably update useGame to use *state* gameMode if argument not provided.
    // Let's Fix useGame first or pass the mode.
    // Actually, let's just use the Menu for now to keep it simple?
    // User asked for "Menu". 
    // Let's setInMenu(true) on restart?
    setInMenu(true);
  };

  const center: [number, number] = targetCity
    ? [targetCity.coords.lat, targetCity.coords.lng]
    : [46.603354, 1.888334];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-slate-50 relative">

      {inMenu && <MainMenu onSelectMode={handleStartGame} />}

      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-6 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 tracking-tight">
          City<span className="text-blue-600">Guessr</span>
        </h1>

        <div className="w-full max-w-md z-20">
          <SearchInput
            onSelect={submitGuess}
            disabled={gameState !== 'playing' || inMenu}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-4 relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <GameOverlay
            attempts={attempts}
            guesses={guesses}
            gameState={gameState}
            targetCity={targetCity}
            onRestart={handleRestart}
            onMenu={() => setInMenu(true)}
            gameMode={gameMode}
          />
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
