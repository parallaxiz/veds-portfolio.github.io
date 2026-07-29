import React, { useState, useEffect } from "react";
import GameCanvas from "./Components/GameCanvas";
import Modal from "./Components/Modal";
import { CursorDrivenParticleTypography } from "./Components/ui/cursor-driven-particles-typography";
import { DotLoader } from "./Components/ui/dot-loader";

const loaderFrames = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    // Listen to loading progress from Phaser
    const handleProgress = (e) => {
      setProgress(Math.round(e.detail * 100));
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    const handleOpenModal = (e) => {
      setActiveModal(e.detail || null);
    };

    window.addEventListener("game-loading-progress", handleProgress);
    window.addEventListener("game-loading-complete", handleComplete);
    window.addEventListener("open-modal", handleOpenModal);

    return () => {
      window.removeEventListener("game-loading-progress", handleProgress);
      window.removeEventListener("game-loading-complete", handleComplete);
      window.removeEventListener("open-modal", handleOpenModal);
    };
  }, []);

  const handleStartGame = () => {
    // Resume audio context inside Phaser
    if (window.gameInstance && window.gameInstance.sound && window.gameInstance.sound.context) {
      window.gameInstance.sound.context.resume().catch((err) => console.log("Audio resume error:", err));
    }

    setIsFadingOut(true);
    // Allow transition animation to finish before removing start overlay
    setTimeout(() => {
      setIsStarted(true);
      setIsFadingOut(false);
      window.dispatchEvent(new CustomEvent("start-game"));
    }, 600);
  };

  const handleReturnToMenu = () => {
    // Lock player input in Phaser
    window.dispatchEvent(new CustomEvent("open-modal"));
    setIsStarted(false);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    window.dispatchEvent(new CustomEvent("close-modal"));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#3e3b66] font-mono select-none">
      {/* Phaser Canvas Container */}
      <GameCanvas isInteractive={isStarted && activeModal === null} />

      {/* Loading Progress Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#161426] flex flex-col items-center justify-center z-[500] p-4 text-white">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-[#e2933f] animate-pulse">
              VED'S PORTFOLIO
            </h1>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">
              Loading Assets...
            </p>
            
            {/* Custom DotLoader with theme colors */}
            <div className="flex flex-col items-center gap-6 py-4">
              <DotLoader
                frames={loaderFrames}
                className="gap-1 border-4 border-[#3e3b66] p-4 bg-[#161426] rounded-lg shadow-inner scale-150"
                dotClassName="bg-[#3e3b66] [&.active]:bg-[#e2933f] w-3 h-3 rounded-xs transition-colors duration-75"
              />
              <div className="text-xl font-bold text-[#e2933f] animate-pulse">
                {progress}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Screen Overlay */}
      {!isLoading && !isStarted && (
        <div 
          className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-[400] transition-opacity duration-500 ease-in-out p-4 text-white ${
            isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ fontFamily: "edit-undo" }}
        >
          <div className="max-w-4xl w-full text-center space-y-12">
            {/* Title Card */}
            <div className="space-y-4">
              <div className="text-[#e2933f] font-bold tracking-widest text-sm animate-bounce">
                &gt; VED_PORTFOLIO.EXE READY &lt;
              </div>
              <div className="w-full h-[160px] flex items-center justify-center">
                <CursorDrivenParticleTypography 
                  text="VED'S PORTFOLIO" 
                  fontSize={100} 
                  particleDensity={4} 
                  dispersionStrength={25}
                  color="#ffffff"
                />
              </div>
              <h2 className="text-[#e2933f] text-xl md:text-2xl font-bold uppercase tracking-wider mt-2">
                Computer Science Student | AI & Full Stack Dev
              </h2>
              <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">
                Select your path to enter the bedroom
              </p>
            </div>

            {/* Path Selection Buttons */}
            <div className="grid md:grid-cols-2 gap-8 px-6 max-w-3xl mx-auto">
              {/* Recruiters View */}
              <button
                onClick={() => {
                  window.location.href = "/recruiters";
                }}
                className="bg-[#242238] border-4 border-[#3e3b66] text-white p-6 rounded-lg text-left transition-all duration-200 transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_#e2933f] hover:shadow-[8px_8px_0px_0px_#e2933f] group flex flex-col justify-between min-h-[200px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-200">💼</span>
                  <span className="text-xs border-2 border-[#e2933f] px-2 py-0.5 rounded text-[#e2933f] group-hover:bg-[#e2933f] group-hover:text-white transition font-bold uppercase tracking-wider">
                    Fast Track
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-2xl text-[#e2933f] group-hover:text-white transition tracking-wide">
                    RECRUITERS
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed font-sans">
                    Sleek document view mapping skills, projects, and contact details directly from my CV.
                  </p>
                </div>
                <div className="text-left mt-4 text-[#e2933f] font-bold text-xs group-hover:translate-x-1 transition-transform duration-200">
                  [ READ RESUME &rarr; ]
                </div>
              </button>

              {/* Playable Game */}
              <button
                onClick={handleStartGame}
                className="bg-[#fcecd1] border-4 border-[#3e3b66] text-[#3e3b66] p-6 rounded-lg text-left transition-all duration-200 transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_#3e3b66] hover:shadow-[8px_8px_0px_0px_#e2933f] group flex flex-col justify-between min-h-[200px] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-4xl group-hover:animate-bounce">👀</span>
                  <span className="text-xs border-2 border-[#3e3b66] px-2 py-0.5 rounded text-[#3e3b66] group-hover:bg-[#3e3b66] group-hover:text-white transition font-bold uppercase tracking-wider">
                    Interactive
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-2xl text-[#3e3b66] group-hover:text-[#e2933f] transition tracking-wide">
                    JUST LOOKING
                  </h3>
                  <p className="text-xs text-[#3e3b66]/80 mt-2 leading-relaxed font-sans">
                    Walk around the interactive pixel art room using WASD keys. Find info and easter eggs!
                  </p>
                </div>
                <div className="text-left mt-4 text-[#3e3b66] group-hover:text-[#e2933f] font-bold text-xs group-hover:translate-x-1 transition-transform duration-200">
                  [ ENTER GAME &rarr; ]
                </div>
              </button>
            </div>

            {/* Tiny rules info */}
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Move with WASD &bull; Press E or Click to interact
            </div>
          </div>
        </div>
      )}

      {/* HUD overlays - only visible when game is active */}
      {isStarted && !activeModal && (
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {/* Rules Button */}
          <button
            onClick={() => setActiveModal("rules")}
            className="absolute top-4 left-4 bg-[#3e3b66] hover:bg-[#2d2a4f] text-white border-2 border-white font-bold py-2 px-4 rounded shadow-lg pointer-events-auto transition active:translate-y-0.5"
          >
            📋 Rules
          </button>

          {/* Back to Start Screen Menu */}
          <button
            onClick={handleReturnToMenu}
            className="absolute top-4 right-4 bg-[#3e3b66] hover:bg-[#2d2a4f] text-white border-2 border-white font-bold py-2 px-4 rounded shadow-lg pointer-events-auto transition active:translate-y-0.5"
          >
            &larr; Exit Game
          </button>
        </div>
      )}

      {/* React Popups Modals */}
      <Modal 
        isOpen={activeModal !== null} 
        type={activeModal} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
