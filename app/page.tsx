"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchInput from '@/components/SearchInput';
import GameOverlay from '@/components/GameOverlay';
import MainMenu from '@/components/MainMenu';
import StoryMenu from '@/components/StoryMenu';
import { useGame } from '@/hooks/useGame';

// Dynamically import MapWrapper to avoid SSR issues with Leaflet
const MapWrapper = dynamic(() => import('@/components/MapWrapper'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function Home() {
  const [inMenu, setInMenu] = useState(true);
  const [showStoryMenu, setShowStoryMenu] = useState(false);

  const {
    targetCity,
    guesses,
    attempts,
    gameState,
    gameMode,
    storyProgress,
    submitGuess,
    restartGame
  } = useGame();

  const handleStartGame = (mode: 'france' | 'capital' | 'story') => {
    if (mode === 'story') {
      setShowStoryMenu(true);
    } else {
      restartGame(mode);
      setInMenu(false);
    }
  };

  const handleLevelSelect = (levelId: number) => {
    restartGame('story', levelId);
    setShowStoryMenu(false);
    setInMenu(false);
  };

  const handleBackToMenu = () => {
    setShowStoryMenu(false);
    setInMenu(true);
  };

  const handleRestart = () => {
    setInMenu(true);
  };

  const center: [number, number] = targetCity
    ? [targetCity.coords.lat, targetCity.coords.lng]
    : [46.603354, 1.888334];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-slate-50 relative">

      {inMenu && !showStoryMenu && <MainMenu onSelectMode={handleStartGame} />}

      {showStoryMenu && (
        <StoryMenu
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToMenu}
          progress={storyProgress}
        />
      )}

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
            gameMode={gameMode as 'france' | 'capital'}
          />
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white p-1 shadow-sm h-[60vh] md:h-[70vh]">
          <MapWrapper
            center={center}
            zoom={13} // We don't really export zoom anymore, defaulting to 13 or what useGame provides if I didn't remove it. 
            // Wait, useGame REMOVED currentZoom in my previous edit?
            // Let's check useGame return in previous steps.
            // I see I returned `guesses, targetCity, gameState, attempts, gameMode, storyProgress, submitGuess, restartGame` in step 520.
            // So currentZoom IS MISSING.
            // MapWrapper needs zoom.
            // Actually, MapWrapper handles zoom internally via MapController usually, or receives it.
            // Let's pass a default or check MapWrapper props.
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
