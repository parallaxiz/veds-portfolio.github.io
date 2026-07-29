import React, { useState, useEffect } from "react";
import GameCanvas from "./Components/GameCanvas";
import Modal from "./Components/Modal";
import { CursorDrivenParticleTypography } from "./Components/ui/cursor-driven-particles-typography";
import { DotLoader } from "./Components/ui/dot-loader";

// ==========================================
// PROCEDURAL RETRO AUDIO SYSTEM (WEB AUDIO API)
// ==========================================
let audioCtx = null;
let musicInterval = null;
let musicStep = 0;
let isMusicMutedGlobal = true;

const chords = [
  [48, 55, 60, 64, 67, 71], // Cmaj7: C3, G3, C4, E4, G4, B4
  [45, 52, 57, 60, 64, 67], // Am7:   A2, E3, A3, C4, E4, G4
  [50, 57, 62, 65, 69, 72], // Dm7:   D3, A3, D4, F4, A4, C5
  [43, 50, 55, 59, 62, 65]  // G7:    G2, D3, G3, B3, D4, F4
];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playNote(freq, type, duration, volume) {
  if (!audioCtx || isMusicMutedGlobal) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function startLofiSequencer() {
  if (musicInterval) return;
  const bpm = 70;
  const stepDuration = 60 / bpm / 2; // eighth notes
  
  musicStep = 0;
  musicInterval = setInterval(() => {
    if (!audioCtx || isMusicMutedGlobal) return;
    
    const chordIndex = Math.floor(musicStep / 16) % chords.length;
    const chord = chords[chordIndex];
    const subStep = musicStep % 16;
    
    // Bass note
    if (subStep === 0) {
      playNote(midiToFreq(chord[0]), "triangle", stepDuration * 6, 0.05);
    } else if (subStep === 8) {
      playNote(midiToFreq(chord[1]), "triangle", stepDuration * 6, 0.04);
    }
    
    // Pads / Arpeggio
    if (subStep === 0 || subStep === 4 || subStep === 8 || subStep === 12) {
      playNote(midiToFreq(chord[2]), "sine", stepDuration * 4, 0.02);
      playNote(midiToFreq(chord[3]), "sine", stepDuration * 4, 0.02);
    }
    
    // Arpeggiated melody
    if (subStep % 2 === 0 && Math.random() > 0.4) {
      const notesInChord = [chord[3], chord[4], chord[5]];
      const randomNote = notesInChord[Math.floor(Math.random() * notesInChord.length)];
      playNote(midiToFreq(randomNote + 12), "sine", stepDuration * 1.5, 0.015);
    }
    
    musicStep++;
  }, stepDuration * 1000);
}

// Crisp 8-bit Synthesized SFX
const portfolioSFX = {
  playClick() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "square";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.08);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  },
  
  playType() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "sine";
    const freq = 450 + Math.random() * 150;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.02);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.02);
  },

  playStep() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(70, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, audioCtx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.06);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  },

  playPopupOpen() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.05 + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + idx * 0.05 + 0.1);
      
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.1);
    });
  },

  playPopupClose() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [523.25, 392.00, 329.63, 261.63]; // C5, G4, E4, C4
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.05 + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + idx * 0.05 + 0.1);
      
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.1);
    });
  },

  playHurt() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }
};

window.portfolioSFX = portfolioSFX;

// ==========================================
// TYPEWRITER DIALOGUE SUB-COMPONENT
// ==========================================
function TypewriterDialogue({ text, name, onTriggerInteract }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    let timer;

    const type = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        if (window.portfolioSFX) {
          window.portfolioSFX.playType();
        }
        index++;
        timer = setTimeout(type, 25);
      }
    };

    timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div 
      onClick={onTriggerInteract}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94vw] max-w-[650px] bg-[#161426]/95 border-2 md:border-4 border-[#3e3b66] rounded-xl p-3 md:p-4 text-white z-[300] flex flex-col gap-1 select-none shadow-2xl hover:border-[#e2933f] transition duration-200 cursor-pointer touch-manipulation active:scale-[0.99]"
      style={{ fontFamily: 'edit-undo' }}
    >
      <div className="text-[#e2933f] text-xs md:text-sm uppercase tracking-wider font-bold">
        &gt; {name}
      </div>
      <div className="text-xs md:text-base leading-relaxed tracking-wider min-h-[40px] md:min-h-[48px]">
        {displayedText}
      </div>
      <div className="text-right text-[8px] md:text-[9px] text-gray-400 animate-pulse uppercase mt-1">
        [ Tap or Press E to interact ]
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
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
  [14, 6, 13, 20, 9, 7, 21],
];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [dialogue, setDialogue] = useState(null);
  const [showDpad, setShowDpad] = useState(false);

  useEffect(() => {
    // Detect mobile touch devices
    const isTouchDevice = 
      ("ontouchstart" in window) || 
      (navigator.maxTouchPoints > 0) || 
      (window.innerWidth < 768);
    setShowDpad(isTouchDevice);
  }, []);

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
      setDialogue(null); // Hide dialogue when modal opens
      portfolioSFX.playPopupOpen();
    };

    const handleProximityEnter = (e) => {
      setDialogue(e.detail);
    };

    const handleProximityLeave = () => {
      setDialogue(null);
    };

    window.addEventListener("game-loading-progress", handleProgress);
    window.addEventListener("game-loading-complete", handleComplete);
    window.addEventListener("open-modal", handleOpenModal);
    window.addEventListener("proximity-enter", handleProximityEnter);
    window.addEventListener("proximity-leave", handleProximityLeave);

    return () => {
      window.removeEventListener("game-loading-progress", handleProgress);
      window.removeEventListener("game-loading-complete", handleComplete);
      window.removeEventListener("open-modal", handleOpenModal);
      window.removeEventListener("proximity-enter", handleProximityEnter);
      window.removeEventListener("proximity-leave", handleProximityLeave);
    };
  }, []);

  const handleStartGame = () => {
    initAudio();
    isMusicMutedGlobal = isMuted;
    startLofiSequencer();

    if (window.gameInstance && window.gameInstance.sound && window.gameInstance.sound.context) {
      window.gameInstance.sound.context.resume().catch((err) => console.log("Audio resume error:", err));
    }

    setIsFadingOut(true);
    setTimeout(() => {
      setIsStarted(true);
      setIsFadingOut(false);
      window.dispatchEvent(new CustomEvent("start-game"));
    }, 600);
  };

  const handleReturnToMenu = () => {
    portfolioSFX.playPopupClose();
    window.dispatchEvent(new CustomEvent("open-modal"));
    setIsStarted(false);
    setDialogue(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    portfolioSFX.playPopupClose();
    window.dispatchEvent(new CustomEvent("close-modal"));
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMusicMutedGlobal = nextMuted;
    portfolioSFX.playClick();
    if (!nextMuted) {
      initAudio();
      startLofiSequencer();
    }
  };

  const handleDialogueInteraction = () => {
    if (!dialogue) return;
    portfolioSFX.playClick();
    window.dispatchEvent(new CustomEvent("open-modal", { detail: dialogue.object }));
  };

  const triggerMobileMove = (dir, active) => {
    window.dispatchEvent(new CustomEvent("mobile-move", { detail: { dir, active } }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#3e3b66] font-mono select-none">
      {/* Phaser Canvas Container */}
      <GameCanvas isInteractive={isStarted && activeModal === null} />

      {/* Loading Progress Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#161426] flex flex-col items-center justify-center z-[500] p-4 text-white">
          <div className="max-w-md w-full text-center space-y-6">
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">
              Loading Assets...
            </p>
            
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

            <div className="grid md:grid-cols-2 gap-8 px-6 max-w-3xl mx-auto">
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

            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Move with WASD &bull; Press E or Click to interact
            </div>
          </div>
        </div>
      )}

      {/* Typewriter Dialogue overlay */}
      {isStarted && !activeModal && dialogue && (
        <TypewriterDialogue 
          text={dialogue.text} 
          name={dialogue.name} 
          onTriggerInteract={handleDialogueInteraction}
        />
      )}

      {/* HUD overlays - only visible when game is active */}
      {isStarted && !activeModal && (
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {/* Top-Right: Exit Button */}
          <button
            onClick={handleReturnToMenu}
            className="absolute top-4 right-4 bg-[#3e3b66] hover:bg-[#2d2a4f] text-white border-2 border-white font-bold py-2 px-4 rounded shadow-lg pointer-events-auto transition active:translate-y-0.5 cursor-pointer"
            style={{ fontFamily: "edit-undo" }}
          >
            &larr; Exit
          </button>

          {/* Bottom-Left: Keyboard Guide & Music HUD */}
          <div 
            className="absolute bottom-6 left-6 flex flex-col gap-2.5 bg-[#161426]/95 border-4 border-[#3e3b66] p-4 md:p-5 rounded-xl text-white text-sm select-none pointer-events-auto shadow-2xl"
            style={{ fontFamily: "edit-undo" }}
          >
            <div className="text-[#e2933f] text-base font-bold uppercase mb-0.5">&gt; System Guide</div>
            <div>⌨️ WASD / Arrows to walk</div>
            <div>💡 Approach object & Press E to open</div>
            
            {/* Music Toggle */}
            <button
              onClick={toggleMute}
              className="mt-1 flex items-center justify-center gap-1.5 bg-[#3e3b66] hover:bg-[#2d2a4f] active:translate-y-0.5 text-white border-2 border-white/40 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer text-xs uppercase"
            >
              {isMuted ? "🔇 Lofi Muted" : "🔊 Lofi Playing"}
            </button>

            {/* Mobile Controls Toggle */}
            <button
              onClick={() => { portfolioSFX.playClick(); setShowDpad(!showDpad); }}
              className="md:hidden flex items-center justify-center gap-1.5 bg-[#e2933f] hover:bg-[#d17e2e] active:translate-y-0.5 text-white border-2 border-white/40 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer text-xs uppercase"
            >
              {showDpad ? "📱 Hide D-Pad" : "📱 Show D-Pad"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Virtual D-Pad Overlay */}
      {isStarted && !activeModal && showDpad && (
        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5 z-[300] pointer-events-auto select-none md:hidden">
          {/* Up */}
          <button
            onTouchStart={() => triggerMobileMove("up", true)}
            onTouchEnd={() => triggerMobileMove("up", false)}
            onMouseDown={() => triggerMobileMove("up", true)}
            onMouseUp={() => triggerMobileMove("up", false)}
            className="w-12 h-12 bg-[#3e3b66]/90 hover:bg-[#2d2a4f]/90 active:bg-white/80 border-2 border-white rounded-full flex items-center justify-center text-white text-xl font-bold font-sans shadow-lg cursor-pointer"
          >
            ▲
          </button>
          
          <div className="flex gap-6">
            {/* Left */}
            <button
              onTouchStart={() => triggerMobileMove("left", true)}
              onTouchEnd={() => triggerMobileMove("left", false)}
              onMouseDown={() => triggerMobileMove("left", true)}
              onMouseUp={() => triggerMobileMove("left", false)}
              className="w-12 h-12 bg-[#3e3b66]/90 hover:bg-[#2d2a4f]/90 active:bg-white/80 border-2 border-white rounded-full flex items-center justify-center text-white text-xl font-bold font-sans shadow-lg cursor-pointer"
            >
              ◀
            </button>
            {/* Right */}
            <button
              onTouchStart={() => triggerMobileMove("right", true)}
              onTouchEnd={() => triggerMobileMove("right", false)}
              onMouseDown={() => triggerMobileMove("right", true)}
              onMouseUp={() => triggerMobileMove("right", false)}
              className="w-12 h-12 bg-[#3e3b66]/90 hover:bg-[#2d2a4f]/90 active:bg-white/80 border-2 border-white rounded-full flex items-center justify-center text-white text-xl font-bold font-sans shadow-lg cursor-pointer"
            >
              ▶
            </button>
          </div>
          
          {/* Down */}
          <button
            onTouchStart={() => triggerMobileMove("down", true)}
            onTouchEnd={() => triggerMobileMove("down", false)}
            onMouseDown={() => triggerMobileMove("down", true)}
            onMouseUp={() => triggerMobileMove("down", false)}
            className="w-12 h-12 bg-[#3e3b66]/90 hover:bg-[#2d2a4f]/90 active:bg-white/80 border-2 border-white rounded-full flex items-center justify-center text-white text-xl font-bold font-sans shadow-lg cursor-pointer"
          >
            ▼
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
