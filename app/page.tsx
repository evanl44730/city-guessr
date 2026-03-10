"use client";

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import SearchInput from '@/components/SearchInput';
import GameOverlay from '@/components/GameOverlay';
import MainMenu from '@/components/MainMenu';
import StoryMenu from '@/components/StoryMenu';
import MultiplayerMenu from '@/components/MultiplayerMenu';
import Lobby from '@/components/Lobby';
import MultiplayerGameOverlay from '@/components/MultiplayerGameOverlay';
import DepartmentMenu from '@/components/DepartmentMenu';
import { useGame } from '@/hooks/useGame';
import { generateStoryLevelsForDepartment, generateStoryLevelsForCountry } from '@/data/storyLevels';
import EuropeMenu from '@/components/EuropeMenu';
import DailyMenu from '@/components/DailyMenu';

// Dynamically import MapWrapper to avoid SSR issues with Leaflet
const MapWrapper = dynamic(() => import('@/components/MapWrapper'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function Home() {
  const [inMenu, setInMenu] = useState(true);
  const [showStoryMenu, setShowStoryMenu] = useState(false);
  const [showMultiplayerMenu, setShowMultiplayerMenu] = useState(false);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);
  const [showEuropeMenu, setShowEuropeMenu] = useState(false);
  const [showDailyMenu, setShowDailyMenu] = useState(false);

  const [storyCategory, setStoryCategory] = useState<string>('france');

  const {
    // ... useGame hook (no change here)
    targetCity,
    guesses,
    attempts,
    gameState,
    currentZoom,
    gameMode,
    storyProgress,
    dynamicStoryLevels,
    setDynamicStoryLevels,
    submitGuess,
    restartGame,
    // Time Attack
    score,
    timeLeft,
    leaderboard,
    submitTimeAttackScore,
    // Online
    onlinePhase,
    roomId,
    players,
    isHost,
    currentRound,
    totalRounds,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    citiesData,
    isCitiesLoaded,
    selectedDepartment,
    selectedCountry,
    gameSettings,
    updateGameSettings,
    selectedDate,
    dailyProgress,
    currentLevelId
  } = useGame();

  // Filter the search suggestions based on the current game mode
  const filteredSearchPool = useMemo(() => {
    if (gameMode === 'france' || gameMode === 'time_attack') {
      return citiesData.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
    } else if (gameMode === 'capital') {
      return citiesData.filter(c => c.category.includes('world_capital'));
    } else if (gameMode === 'department') {
      return citiesData.filter(c => c.zip && c.zip.startsWith(selectedDepartment));
    } else if (gameMode === 'europe') {
      return citiesData.filter(c => c.category && c.category.includes(`country_${selectedCountry}`));
    } else if (gameMode === 'story') {
      // For story mode, filter by the current story category
      if (storyCategory.startsWith('dept_')) {
        const depId = storyCategory.replace('dept_', '');
        return citiesData.filter(c => c.zip && c.zip.startsWith(depId));
      } else if (storyCategory.startsWith('country_')) {
        const countryId = storyCategory.replace('country_', '');
        return citiesData.filter(c => c.category && c.category.includes(`country_${countryId}`));
      } else if (storyCategory === 'capital') {
        return citiesData.filter(c => c.category.includes('world_capital'));
      } else {
        return citiesData.filter(c => c.category.includes('france_metropole') || c.category.includes('france_dom'));
      }
    }
    return citiesData;
  }, [gameMode, citiesData, selectedDepartment, selectedCountry, storyCategory]);

  const handleStartGame = (mode: 'france' | 'capital' | 'story' | 'online' | 'time_attack' | 'department' | 'europe' | 'daily') => {
    if (mode === 'story') {
      setShowStoryMenu(true);
    } else if (mode === 'online') {
      setShowMultiplayerMenu(true);
      restartGame('online');
    } else if (mode === 'department') {
      setShowDepartmentMenu(true);
    } else if (mode === 'europe') {
      setShowEuropeMenu(true);
    } else if (mode === 'daily') {
      setShowDailyMenu(true);
    } else {
      restartGame(mode);
      setInMenu(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setStoryCategory(category);
    if (category.startsWith('dept_')) {
      const depId = category.replace('dept_', '');
      // Filter cities for this department
      const depCities = citiesData.filter(c => c.zip && c.zip.startsWith(depId));
      if (depCities.length > 0) {
        const levels = generateStoryLevelsForDepartment(depId, depCities);
        setDynamicStoryLevels(levels);
      } else {
        setDynamicStoryLevels([]);
      }
    } else if (category.startsWith('country_')) {
      const countryId = category.replace('country_', '');
      const countryCities = citiesData.filter(c => c.category && c.category.includes(`country_${countryId}`));
      if (countryCities.length > 0) {
        const levels = generateStoryLevelsForCountry(countryId, countryCities);
        setDynamicStoryLevels(levels);
      } else {
        setDynamicStoryLevels([]);
      }
    }
  };

  const handleLevelSelect = (levelId: number) => {
    restartGame('story', levelId);
    setShowStoryMenu(false);
    setInMenu(false);
  };

  const handleDepartmentSelect = (departmentId: string) => {
    restartGame('department', undefined, departmentId);
    setShowDepartmentMenu(false);
    setInMenu(false);
  };

  const handleEuropeSelect = (countryId: string) => {
    restartGame('europe', undefined, undefined, countryId);
    setShowEuropeMenu(false);
    setInMenu(false);
  };

  const handleBackToMenu = () => {
    setShowStoryMenu(false);
    setShowMultiplayerMenu(false);
    setShowDepartmentMenu(false);
    setShowEuropeMenu(false);
    setShowDailyMenu(false);
    setInMenu(true);
    restartGame('france'); // Reset to default mode to clear online state if needed
  };

  const handleRestart = () => {
    setInMenu(true);
  };

  const center: [number, number] = targetCity
    ? [targetCity.coords.lat, targetCity.coords.lng]
    : [46.603354, 1.888334];

  // Daily Menu
  if (inMenu && showDailyMenu) {
    return (
      <DailyMenu
        onBack={handleBackToMenu}
        onPlayDate={(dateStr) => {
          restartGame('daily', undefined, undefined, undefined, dateStr);
          setShowDailyMenu(false);
          setInMenu(false);
        }}
        dailyProgress={dailyProgress}
        citiesData={citiesData}
      />
    );
  }

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
          settings={gameSettings}
          onStartGame={startGame}
          onUpdateSettings={updateGameSettings}
          onLeaveRoom={() => {
            leaveRoom();
          }}
        />
      );
    }

    // If onlinePhase is 'game', fall through to main render but with MP overlay
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 md:p-8 bg-[url('/grid.svg')] bg-cover relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 pointer-events-none" />

      {/* Loading Overlay */}
      {!isCitiesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {inMenu && !showStoryMenu && !showMultiplayerMenu && !showDepartmentMenu && !showEuropeMenu && <MainMenu onSelectMode={handleStartGame} />}

      {showStoryMenu && (
        <StoryMenu
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToMenu}
          progress={storyProgress}
          selectedCategory={storyCategory}
          onSelectCategory={handleCategorySelect}
          dynamicLevels={dynamicStoryLevels}
        />
      )}

      {showDepartmentMenu && (
        <DepartmentMenu
          onSelectDepartment={handleDepartmentSelect}
          onBack={handleBackToMenu}
        />
      )}

      {showEuropeMenu && (
        <EuropeMenu
          onSelectCountry={handleEuropeSelect}
          onBack={handleBackToMenu}
        />
      )}

      {(!inMenu || (gameMode === 'online' && onlinePhase === 'game')) && (
        <div className={`max-w-5xl w-full flex flex-col items-center gap-4 md:gap-6 mb-2 md:mb-4 animate-in fade-in slide-in-from-top-4 duration-700 pointer-events-none ${gameState === 'playing' ? 'z-50' : 'z-0'}`}>
          <h1 className="text-2xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tighter drop-shadow-2xl pointer-events-auto">
            CityGuessr
          </h1>

          <div className="w-full max-w-md pointer-events-auto px-4 md:px-0">
            <SearchInput
              citiesData={filteredSearchPool}
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
                onMenu={() => {
                  setInMenu(true);
                  if (gameMode === 'story') {
                    setShowStoryMenu(true);
                  }
                }}
                onNextLevel={gameMode === 'story' && currentLevelId ? () => {
                   restartGame('story', currentLevelId + 1);
                } : undefined}
                gameMode={gameMode as 'france' | 'capital' | 'story' | 'time_attack' | 'department' | 'europe' | 'daily'}
                score={score}
                timeLeft={timeLeft}
                leaderboard={leaderboard}
                onSubmitScore={submitTimeAttackScore}
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
