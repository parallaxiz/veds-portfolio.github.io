import React, { useState, useEffect, useRef, useCallback } from "react";

// ==========================================
// RETRO SNAKE GAME (self-contained)
// ==========================================
function SnakeGame() {
  const GRID = 16;
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([3, 3]);
  const [dir, setDir] = useState([0, -1]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const resetGame = () => {
    setSnake([[8, 8]]);
    setFood([Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]);
    setDir([0, -1]);
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      let newDir = null;
      switch (e.key) {
        case "w": case "W": case "ArrowUp":
          if (dir[1] !== 1) newDir = [0, -1]; break;
        case "s": case "S": case "ArrowDown":
          if (dir[1] !== -1) newDir = [0, 1]; break;
        case "a": case "A": case "ArrowLeft":
          if (dir[0] !== 1) newDir = [-1, 0]; break;
        case "d": case "D": case "ArrowRight":
          if (dir[0] !== -1) newDir = [1, 0]; break;
        default: break;
      }
      if (newDir) { e.preventDefault(); e.stopPropagation(); setDir(newDir); }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [dir, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;
    const moveSnake = () => {
      const head = snake[0];
      const nextHead = [head[0] + dir[0], head[1] + dir[1]];
      if (nextHead[0] < 0 || nextHead[0] >= GRID || nextHead[1] < 0 || nextHead[1] >= GRID) {
        setIsGameOver(true);
        if (window.portfolioSFX) window.portfolioSFX.playHurt();
        return;
      }
      for (const seg of snake) {
        if (seg[0] === nextHead[0] && seg[1] === nextHead[1]) {
          setIsGameOver(true);
          if (window.portfolioSFX) window.portfolioSFX.playHurt();
          return;
        }
      }
      const newSnake = [nextHead, ...snake];
      if (nextHead[0] === food[0] && nextHead[1] === food[1]) {
        if (window.portfolioSFX) window.portfolioSFX.playClick();
        const nextScore = score + 1;
        setScore(nextScore);
        if (nextScore >= 5) setUnlocked(true);
        let newFood;
        do {
          newFood = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)];
        } while (snake.some(s => s[0] === newFood[0] && s[1] === newFood[1]));
        setFood(newFood);
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };
    const loop = setInterval(moveSnake, 140);
    return () => clearInterval(loop);
  }, [snake, dir, food, isGameOver, score]);

  return (
    <div className="flex flex-col items-center gap-2 select-none p-2">
      <div className="flex justify-between w-full text-[#e2933f] text-xs font-bold px-1">
        <span>SCORE: {score}</span>
        <span>🏆 GOAL: 5</span>
      </div>
      <div
        className="relative bg-[#0d0c1a] border-2 border-[#e2933f]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))`,
          width: "256px",
          height: "256px",
          gap: "1px",
        }}
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isSnake = snake.some(s => s[0] === x && s[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              className={`w-full h-full ${
                isHead ? "bg-[#e2933f]" :
                isSnake ? "bg-amber-200" :
                isFood ? "bg-red-500 animate-pulse" :
                "bg-[#0d0c1a]"
              }`}
            />
          );
        })}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-3 text-white">
            <div className="text-lg font-bold text-red-400 tracking-widest uppercase">CONNECTION LOST</div>
            <button onClick={resetGame} className="bg-[#e2933f] text-black font-bold py-1.5 px-5 border-2 border-white rounded text-xs uppercase cursor-pointer hover:bg-amber-300 transition">
              Reboot System
            </button>
          </div>
        )}
      </div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest">WASD / Arrow keys to move</div>
      {unlocked && (
        <div className="text-center bg-[#1a1830] border border-[#e2933f] p-2 rounded text-[#e2933f] text-xs animate-bounce font-bold">
          🏆 DECRYPTION UNLOCKED — Legendary Arcade Wrangler!
        </div>
      )}
    </div>
  );
}

// ==========================================
// WINDOW FRAME (draggable, minimizable)
// ==========================================
function WindowFrame({ id, title, icon, children, onClose, onMinimize, onFocus, zIndex, isMinimized, defaultPos, defaultSize }) {
  const [pos, setPos] = useState(defaultPos || { x: 120, y: 60 });
  const dragRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    onFocus(id);
    dragRef.current = { startX: e.clientX - pos.x, startY: e.clientY - pos.y };

    const onMove = (me) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(0, me.clientX - dragRef.current.startX),
        y: Math.max(0, me.clientY - dragRef.current.startY),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [id, pos, onFocus]);

  if (isMinimized) return null;

  return (
    <div
      className="absolute flex flex-col rounded-lg overflow-hidden shadow-2xl border-2 border-[#4a4780]"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
        width: defaultSize?.w || 480,
        maxWidth: "calc(100vw - 40px)",
        fontFamily: "'edit-undo', monospace",
        background: "#1a1830",
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-move select-none bg-[#3e3b66]"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-white text-xs font-bold">
          <span>{icon}</span>
          <span className="uppercase tracking-widest truncate max-w-[240px]">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playPopupClose(); onMinimize(id); }}
            className="w-4 h-4 rounded-full bg-yellow-400 hover:bg-yellow-300 border border-yellow-600 flex items-center justify-center text-black text-[9px] font-black cursor-pointer transition"
            title="Minimize"
          >−</button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playPopupClose(); onClose(id); }}
            className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 border border-red-700 flex items-center justify-center text-white text-[9px] font-black cursor-pointer transition"
            title="Close"
          >✕</button>
        </div>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto p-3 text-white"
        style={{ maxHeight: defaultSize?.h || 380, background: "#12111f" }}
      >
        {children}
      </div>
    </div>
  );
}

// ==========================================
// PROJECT WINDOW CONTENT
// ==========================================
function ProjectContent({ project }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <h2 className="text-[#e2933f] font-bold text-sm uppercase tracking-wider border-b border-[#3e3b66] pb-2">
        {project.icon} {project.title}
      </h2>
      <p className="text-gray-300 leading-relaxed text-xs">{project.desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {project.tags.map(t => (
          <span key={t} className="text-[9px] font-bold bg-[#3e3b66] text-[#e2933f] px-2 py-0.5 rounded border border-[#4a4780] uppercase">
            {t}
          </span>
        ))}
      </div>
      <button
        onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playClick(); window.open(project.link, "_blank"); }}
        className="mt-2 self-start flex items-center gap-2 bg-[#e2933f] hover:bg-amber-300 text-black font-bold px-4 py-1.5 rounded border-2 border-amber-600 text-xs uppercase cursor-pointer transition"
      >
        🐙 View on GitHub →
      </button>
    </div>
  );
}

// ==========================================
// RESUME WINDOW CONTENT
// ==========================================
function ResumeContent() {
  return (
    <div className="flex flex-col gap-3 text-xs text-gray-300 leading-relaxed">
      <div className="text-center">
        <div className="text-[#e2933f] text-sm font-bold uppercase tracking-widest">Ved Madurwar</div>
        <div className="text-gray-400 text-[10px] uppercase tracking-wider mt-0.5">Computer Science · AI & Full-Stack Dev</div>
      </div>
      <div className="border-t border-[#3e3b66] pt-2 space-y-1">
        <div className="text-[#e2933f] font-bold text-[10px] uppercase tracking-widest mb-1">Education</div>
        <div>
          <span className="font-bold text-white">Vishwakarma Institute of Technology, Pune</span><br />
          B.Tech Computer Science · CGPA: 8.9
        </div>
      </div>
      <div className="border-t border-[#3e3b66] pt-2 space-y-1">
        <div className="text-[#e2933f] font-bold text-[10px] uppercase tracking-widest mb-1">Experience</div>
        <div>
          <span className="font-bold text-white">Elevate Labs</span> · AI & ML Intern<br />
          May 2026 – Jul 2026 · <span className="text-[#e2933f]">🏆 Best Performer Award</span>
        </div>
      </div>
      <div className="border-t border-[#3e3b66] pt-2">
        <div className="text-[#e2933f] font-bold text-[10px] uppercase tracking-widest mb-1">Publications</div>
        <div>IEEE 13CTCON 2026 — Physics-Aware Spatiotemporal Forecasting of Methane Emissions (SAT-MethaneNet)</div>
      </div>
      <div className="border-t border-[#3e3b66] pt-2">
        <div className="text-[#e2933f] font-bold text-[10px] uppercase tracking-widest mb-1">Certifications</div>
        <div>Supervised Machine Learning: Regression and Classification · Stanford / DeepLearning.AI</div>
      </div>
      <div className="border-t border-[#3e3b66] pt-2">
        <div className="text-[#e2933f] font-bold text-[10px] uppercase tracking-widest mb-1">Links</div>
        <div className="flex flex-col gap-1.5">
          <button onClick={() => window.open("https://github.com/parallaxiz", "_blank")}
            className="text-left text-[#e2933f] hover:text-amber-200 underline cursor-pointer bg-transparent border-0 p-0 font-bold text-xs">
            🐙 github.com/parallaxiz
          </button>
          <button onClick={() => window.open("https://www.linkedin.com/in/ved-madurwar-34265a332", "_blank")}
            className="text-left text-[#e2933f] hover:text-amber-200 underline cursor-pointer bg-transparent border-0 p-0 font-bold text-xs">
            🔗 LinkedIn Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// LIVE CLOCK
// ==========================================
function PixelClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span className="text-[#e2933f] font-bold text-xs tracking-widest tabular-nums">
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  );
}

// ==========================================
// DESKTOP ICON
// ==========================================
function DesktopIcon({ icon, label, selected, onClick, onOpen }) {
  const clickTimer = useRef(null);

  const handleClick = () => {
    onClick();
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onOpen();
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 280);
    }
  };

  return (
    <button
      onDoubleClick={onOpen}
      onClick={handleClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg w-20 cursor-pointer select-none transition-all duration-150 border-2 group ${
        selected
          ? "border-[#e2933f] bg-[#e2933f]/20 shadow-lg shadow-[#e2933f]/20"
          : "border-transparent hover:border-[#3e3b66] hover:bg-white/5"
      }`}
      style={{ fontFamily: "'edit-undo', monospace" }}
    >
      <div className={`text-4xl leading-none transition-transform duration-150 ${selected ? "scale-110" : "group-hover:scale-105"}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight text-center ${selected ? "text-[#e2933f]" : "text-gray-200"}`}>
        {label}
      </span>
    </button>
  );
}

// ==========================================
// DATA
// ==========================================
const PROJECTS = [
  {
    id: "agent-maria",
    icon: "🤖",
    label: "Agent Maria",
    title: "Agent Maria: Multi-Agent System",
    desc: "Engineered a multi-agent orchestration framework to automate complex workflows and enable independent AI personas to collaborate on task execution. Integrated LLMs for autonomous decision-making using structured output aggregation.",
    tags: ["PYTHON", "LLMs", "AI ORCHESTRATION", "GENAI"],
    link: "https://github.com/parallaxiz",
  },
  {
    id: "sat-methanenet",
    icon: "🛰️",
    label: "SAT-MethaneNet",
    title: "SAT-MethaneNet: Emission Forecasting",
    desc: "Engineered a physics-aware Residual U-Net model using skip connections and Weighted MSE loss to predict methane dispersion. Developed a spatial data fusion pipeline for Sentinel-5P and EMIT satellite data.",
    tags: ["PYTHON", "TENSORFLOW", "EARTH ENGINE", "DEEP LEARNING"],
    link: "https://github.com/parallaxiz",
  },
  {
    id: "ai-council",
    icon: "⚖️",
    label: "The AI Council",
    title: "\"The AI Council\" Startup Validator",
    desc: "Engineered a multi-agent orchestration pipeline using n8n to evaluate startup concepts through specialized AI personas. Architected a Next.js frontend with secure API routes and LLM chaining.",
    tags: ["NEXT.JS", "N8N", "GEMINI 1.5 FLASH", "AI"],
    link: "https://github.com/parallaxiz",
  },
  {
    id: "oxlo",
    icon: "🎓",
    label: "Oxlo AI Tutor",
    title: "Oxlo AI Tutor",
    desc: "Developed a responsive AI-driven tutoring platform using Flask and Google Gemini Pro for real-time educational assistance. Integrated a dynamic Markdown chat interface with lab environment custom modules.",
    tags: ["PYTHON", "FLASK", "GEMINI PRO", "GENAI"],
    link: "https://github.com/parallaxiz",
  },
];

const DESKTOP_ICONS = [
  ...PROJECTS.map(p => ({ id: p.id, icon: p.icon, label: p.label })),
  { id: "snake", icon: "🕹️", label: "Snake Game" },
  { id: "resume", icon: "📄", label: "Resume" },
];

let nextZ = 100;

// ==========================================
// VedOS — MAIN DESKTOP
// ==========================================
export default function VedOS({ onClose }) {
  const [windows, setWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Close VedOS on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" || e.key === "e" || e.key === "E") {
        e.stopPropagation();
        onClose();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener("keydown", handler, true);
    }, 150);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handler, true);
    };
  }, [onClose]);

  const openWindow = useCallback((id) => {
    if (window.portfolioSFX) window.portfolioSFX.playPopupOpen();
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: ++nextZ } : w);
      }
      const idx = prev.filter(w => !w.minimized).length;
      return [...prev, {
        id,
        zIndex: ++nextZ,
        minimized: false,
        pos: { x: 140 + idx * 30, y: 50 + idx * 30 },
      }];
    });
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: ++nextZ } : w));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const getWindowMeta = (id) => {
    const project = PROJECTS.find(p => p.id === id);
    if (project) return { title: project.title, icon: project.icon, content: <ProjectContent project={project} />, size: { w: 460, h: 340 } };
    if (id === "snake") return { title: "Arcade Hack — Snake", icon: "🕹️", content: <SnakeGame />, size: { w: 300, h: 400 } };
    if (id === "resume") return { title: "Resume / About Me", icon: "📄", content: <ResumeContent />, size: { w: 400, h: 380 } };
    return null;
  };

  const openWindows = windows.filter(w => !w.minimized);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", fontFamily: "'edit-undo', monospace" }}
      onClick={onClose}
    >
      {/* Popup container */}
      <div
        className="relative flex flex-col rounded-xl overflow-hidden border-4 border-[#3e3b66] shadow-2xl"
        style={{
          width: "min(960px, 96vw)",
          height: "min(620px, 90vh)",
          background: "radial-gradient(ellipse at 60% 30%, #1e1b3a 0%, #0d0c1a 70%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pixel grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(#3e3b66 1px, transparent 1px), linear-gradient(90deg, #3e3b66 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-4 py-1.5 bg-[#161426]/90 border-b border-[#3e3b66] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[#e2933f] font-bold text-xs uppercase tracking-widest">💾 VedOS v1.0</span>
            <span className="text-gray-600 text-[10px]">|</span>
            <span className="text-gray-500 text-[10px] uppercase tracking-widest hidden sm:inline">Portfolio Desktop</span>
          </div>
          <div className="flex items-center gap-3">
            <PixelClock />
            <button
              onClick={onClose}
              className="text-[10px] text-gray-400 hover:text-red-400 border border-[#3e3b66] hover:border-red-500 px-2 py-0.5 rounded transition cursor-pointer uppercase font-bold"
            >
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Desktop area */}
        <div className="relative flex-1 overflow-hidden">

          {/* Desktop Icons — left column */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {DESKTOP_ICONS.map(icn => (
              <DesktopIcon
                key={icn.id}
                icon={icn.icon}
                label={icn.label}
                selected={selectedIcon === icn.id}
                onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playClick(); setSelectedIcon(icn.id); }}
                onOpen={() => { setSelectedIcon(icn.id); openWindow(icn.id); }}
              />
            ))}
          </div>

          {/* Empty state hint */}
          {openWindows.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-3 opacity-20">
                <div className="text-6xl">💻</div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">Double-click an icon to launch</div>
              </div>
            </div>
          )}

          {/* Windows */}
          {windows.map(w => {
            const meta = getWindowMeta(w.id);
            if (!meta) return null;
            return (
              <WindowFrame
                key={w.id}
                id={w.id}
                title={meta.title}
                icon={meta.icon}
                zIndex={w.zIndex}
                isMinimized={w.minimized}
                defaultPos={w.pos}
                defaultSize={meta.size}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onFocus={focusWindow}
              >
                {meta.content}
              </WindowFrame>
            );
          })}
        </div>

        {/* Taskbar */}
        <div className="relative flex items-center gap-2 px-3 py-1.5 bg-[#161426]/95 border-t border-[#3e3b66] z-10 min-h-[42px] shrink-0">
          <button className="flex items-center gap-1.5 bg-[#3e3b66] hover:bg-[#4a4780] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded border border-[#5a569c] cursor-pointer transition shrink-0">
            💾 Start
          </button>

          <div className="w-px h-5 bg-[#3e3b66] mx-1 shrink-0" />

          <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
            {windows.map(w => {
              const meta = getWindowMeta(w.id);
              if (!meta) return null;
              const shortTitle = meta.title.split(":")[0].replace(/"/g, "").trim();
              return (
                <button
                  key={w.id}
                  onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playClick(); openWindow(w.id); }}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded border transition cursor-pointer shrink-0 ${
                    !w.minimized
                      ? "bg-[#e2933f]/20 border-[#e2933f] text-[#e2933f]"
                      : "bg-[#1e1b3a] border-[#3e3b66] text-gray-400 hover:border-[#e2933f] hover:text-[#e2933f]"
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span className="hidden sm:inline max-w-[80px] truncate">{shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto shrink-0 bg-[#0d0c1a] border border-[#3e3b66] px-2.5 py-1 rounded">
            <PixelClock />
          </div>
        </div>
      </div>
    </div>
  );
}
