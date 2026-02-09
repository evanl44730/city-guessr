"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchInput from '@/components/SearchInput';
import GameOverlay from '@/components/GameOverlay';
import MainMenu from '@/components/MainMenu';
import StoryMenu from '@/components/StoryMenu';
import MultiplayerMenu from '@/components/MultiplayerMenu';
import Lobby from '@/components/Lobby';
import MultiplayerGameOverlay from '@/components/MultiplayerGameOverlay';
import { useGame } from '@/hooks/useGame';

// Dynamically import MapWrapper to avoid SSR issues with Leaflet
const MapWrapper = dynamic(() => import('@/components/MapWrapper'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function Home() {
  const [inMenu, setInMenu] = useState(true);
  const [showStoryMenu, setShowStoryMenu] = useState(false);
  const [showMultiplayerMenu, setShowMultiplayerMenu] = useState(false);

  const {
    targetCity,
    guesses,
    attempts,
    gameState,
    currentZoom,
    gameMode,
    storyProgress,
    submitGuess,
    restartGame,
    // Online
    onlinePhase,
    roomId,
    players,
    isHost,
    currentRound,
    totalRounds,
    createRoom,
    joinRoom,
    startGame
  } = useGame();

  const handleStartGame = (mode: 'france' | 'capital' | 'story' | 'online') => {
    if (mode === 'story') {
      setShowStoryMenu(true);
    } else if (mode === 'online') {
      setShowMultiplayerMenu(true);
      restartGame('online');
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
    setShowMultiplayerMenu(false);
    setInMenu(true);
    restartGame('france'); // Reset to default mode to clear online state if needed
  };

  const handleRestart = () => {
    setInMenu(true);
  };

  const center: [number, number] = targetCity
    ? [targetCity.coords.lat, targetCity.coords.lng]
    : [46.603354, 1.888334];

  // Multiplayer Logic
  if (gameMode === 'online') {
    if (onlinePhase === 'menu') {
      return (
        <MultiplayerMenu
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onBack={handleBackToMenu}
        />
      );
    }

    if (onlinePhase === 'lobby') {
      return (
        <Lobby
          roomId={roomId}
          players={players}
          isHost={isHost}
          onStartGame={startGame}
        />
      );
    }

    // If onlinePhase is 'game', fall through to main render but with MP overlay
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 md:p-8 bg-[url('/grid.svg')] bg-cover relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 pointer-events-none" />

      {inMenu && !showStoryMenu && !showMultiplayerMenu && <MainMenu onSelectMode={handleStartGame} />}

      {showStoryMenu && (
        <StoryMenu
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToMenu}
          progress={storyProgress}
        />
      )}

      {(!inMenu || (gameMode === 'online' && onlinePhase === 'game')) && (
        <div className="z-50 max-w-5xl w-full flex flex-col items-center gap-4 md:gap-6 mb-2 md:mb-4 animate-in fade-in slide-in-from-top-4 duration-700 pointer-events-none">
          <h1 className="text-2xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter drop-shadow-2xl pointer-events-auto">
            CityGuessr
          </h1>

          <div className="w-full max-w-md z-50 pointer-events-auto px-4 md:px-0">
            <SearchInput
              onSelect={submitGuess}
              disabled={gameState !== 'playing'}
            />
          </div>
        </div>
      )}

      {(!inMenu || (gameMode === 'online' && onlinePhase === 'game')) && (
        <div className="w-full max-w-5xl flex flex-col gap-4 relative z-0 animate-in fade-in zoom-in duration-700 delay-100 flex-1 min-h-0">
          <div className="absolute inset-0 z-10 pointer-events-none">
            {gameMode === 'online' ? (
              <MultiplayerGameOverlay
                roomId={roomId}
                currentRound={currentRound}
                totalRounds={totalRounds}
                players={players}
                attempts={attempts}
                finishedRound={gameState === 'waiting' || gameState === 'ended'}
                hasWonRound={attempts < 6}
                targetCity={targetCity}
                isGameOver={gameState === 'ended'}
                onReturnToMenu={handleBackToMenu}
              />
            ) : (
              <GameOverlay
                attempts={attempts}
                guesses={guesses}
                gameState={gameState}
                targetCity={targetCity}
                onRestart={handleRestart}
                onMenu={() => setInMenu(true)}
                gameMode={gameMode as 'france' | 'capital' | 'story'}
              />
            )}
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-800/50 shadow-2xl backdrop-blur-sm h-full ring-1 ring-white/5">
            <MapWrapper
              center={center}
              zoom={currentZoom}
              guesses={guesses}
              targetCity={targetCity}
              gameState={gameState}
            />
          </div>
        </div>
      )}

      <footer className="mt-4 md:mt-8 pb-2 text-center text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase z-10 opacity-70 hover:opacity-100 transition-opacity">
        Devinez la ville • Zoom progressif • v1.0
      </footer>
    </main>
  );
}
