import React, { useEffect, useRef } from "react";
import { createGame, destroyGame } from "../game";

export default function GameCanvas({ isInteractive }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      createGame();
      isInitialized.current = true;
    }

    return () => {
      destroyGame();
      isInitialized.current = false;
    };
  }, []);

  return (
    <div 
      id="game-container" 
      className={`w-full h-full flex items-center justify-center bg-[#161426] overflow-hidden ${
        isInteractive ? "pointer-events-auto" : "pointer-events-none select-none"
      }`}
    />
  );
}
