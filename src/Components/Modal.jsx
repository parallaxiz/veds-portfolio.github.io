import React, { useState, useEffect } from "react";
import VedOS from "./VedOS";

// ==========================================
// PC MINI-GAME: RETRO SNAKE
// ==========================================
function SnakeGame() {
  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState([3, 3]);
  const [dir, setDir] = useState([0, -1]); // UP
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const resetGame = () => {
    setSnake([[7, 7]]);
    setFood([Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
    setDir([0, -1]);
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      
      let newDir = null;
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          if (dir[1] !== 1) newDir = [0, -1];
          break;
        case "s":
        case "S":
        case "ArrowDown":
          if (dir[1] !== -1) newDir = [0, 1];
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          if (dir[0] !== 1) newDir = [-1, 0];
          break;
        case "d":
        case "D":
        case "ArrowRight":
          if (dir[0] !== -1) newDir = [1, 0];
          break;
        default:
          break;
      }
      if (newDir) {
        e.preventDefault();
        e.stopPropagation();
        setDir(newDir);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [dir, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      const head = snake[0];
      const nextHead = [head[0] + dir[0], head[1] + dir[1]];

      // Border Collision
      if (nextHead[0] < 0 || nextHead[0] >= 15 || nextHead[1] < 0 || nextHead[1] >= 15) {
        setIsGameOver(true);
        if (window.portfolioSFX) window.portfolioSFX.playHurt();
        return;
      }

      // Self Collision
      for (const seg of snake) {
        if (seg[0] === nextHead[0] && seg[1] === nextHead[1]) {
          setIsGameOver(true);
          if (window.portfolioSFX) window.portfolioSFX.playHurt();
          return;
        }
      }

      const newSnake = [nextHead, ...snake];

      // Food Eaten
      if (nextHead[0] === food[0] && nextHead[1] === food[1]) {
        if (window.portfolioSFX) window.portfolioSFX.playClick();
        const nextScore = score + 1;
        setScore(nextScore);
        if (nextScore >= 5) {
          setUnlocked(true);
        }
        
        let newFood;
        do {
          newFood = [Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)];
        } while (snake.some(seg => seg[0] === newFood[0] && seg[1] === newFood[1]));
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const loop = setInterval(moveSnake, 150);
    return () => clearInterval(loop);
  }, [snake, dir, food, isGameOver, score]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#161426] border-4 border-[#3e3b66] rounded-xl select-none max-w-full">
      <div className="flex justify-between w-full text-[#e2933f] text-xs font-bold mb-2">
        <span>SCORE: {score}</span>
        <span>GOAL: 5 (FOR CERTIFICATE)</span>
      </div>

      <div 
        className="relative grid bg-[#3e3b66] border-2 border-[#e2933f] w-[210px] h-[210px] md:w-[240px] md:h-[240px] max-w-full"
        style={{ 
          gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
          gap: "1px"
        }}
      >
        {Array.from({ length: 15 * 15 }).map((_, i) => {
          const x = i % 15;
          const y = Math.floor(i / 15);
          const isSnake = snake.some(seg => seg[0] === x && seg[1] === y);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={i}
              className={`w-full h-full transition-all duration-75 ${
                isHead
                  ? "bg-[#e2933f]"
                  : isSnake
                  ? "bg-amber-100"
                  : isFood
                  ? "bg-red-500 animate-pulse"
                  : "bg-[#161426]"
              }`}
            />
          );
        })}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white gap-4">
            <div className="text-xl font-bold text-red-500 tracking-widest uppercase">CONNECTION LOST</div>
            <button
              onClick={resetGame}
              className="bg-[#e2933f] text-black font-bold py-1.5 px-5 border-2 border-white rounded shadow-md hover:bg-[#d17e2e] active:translate-y-0.5 transition text-xs uppercase cursor-pointer"
            >
              Reboot System
            </button>
          </div>
        )}
      </div>

      {unlocked && (
        <div className="mt-3 text-center bg-[#fcf3e3] border border-[#e2933f] p-2 rounded text-[#3e3b66] text-xs max-w-xs animate-bounce font-bold">
          🏆 DECRYPTION UNLOCKED!
          <div className="text-2xs text-[#e2933f] uppercase mt-0.5">Title: Legendary Arcade Wrangler</div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// WARDROBE OUTFIT COLOR SWAPPER
// ==========================================
function WardrobeSelector() {
  const outfits = [
    { name: "CLASSIC BLUE", color: "#ffffff", desc: "Original style, no tint" },
    { name: "RETRO RED", color: "#f87171", desc: "Hot red hero colors" },
    { name: "CYBER GREEN", color: "#a3e635", desc: "Terminal hacker green" },
    { name: "MAGE PURPLE", color: "#c084fc", desc: "Mystical wizard shades" },
    { name: "NEON PINK", color: "#f472b6", desc: "Vaporwave cyberpunk glow" },
    { name: "GOLD ELITE", color: "#facc15", desc: "Golden performance gear" }
  ];

  const handleSelectOutfit = (outfit) => {
    if (window.portfolioSFX) {
      window.portfolioSFX.playClick();
    }
    window.dispatchEvent(new CustomEvent("change-sprite-tint", { detail: { color: outfit.color } }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
      {outfits.map((o) => (
        <button
          key={o.name}
          onClick={() => handleSelectOutfit(o)}
          className="bg-[#fcf3e3] border-2 border-[#3e3b66] hover:border-[#e2933f] p-3 rounded-lg flex items-center gap-3 cursor-pointer text-left transition transform hover:-translate-y-0.5 active:translate-y-0 text-[#3e3b66] group"
        >
          <div 
            className="w-8 h-8 rounded-md border border-[#3e3b66] shadow-sm flex items-center justify-center shrink-0"
            style={{ 
              backgroundColor: o.color === "#ffffff" ? "#88c0d0" : o.color
            }}
          >
            👕
          </div>
          <div className="flex flex-col select-none">
            <span className="font-bold text-xs group-hover:text-[#e2933f] transition uppercase">{o.name}</span>
            <span className="text-[10px] text-gray-500 leading-tight">{o.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ==========================================
// CORE MODAL CONTAINER
// ==========================================
export default function Modal({ isOpen, type, onClose }) {
  const [aboutPage, setAboutPage] = useState(1);
  const [copiedText, setCopiedText] = useState("");
  const [projectsTab, setProjectsTab] = useState("archive"); // 'archive' | 'game'
  const [cabinetTab, setCabinetTab] = useState("contact"); // 'contact' | 'wardrobe'

  // Close on ESC key or "E" key press
  useEffect(() => {
    if (!isOpen) return;

    let handleKeyDown = null;

    const timer = setTimeout(() => {
      handleKeyDown = (e) => {
        if (e.key === "Escape" || e.key === "e" || e.key === "E" || e.key === " " || e.code === "Space") {
          e.stopPropagation();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown, true);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (handleKeyDown) {
        window.removeEventListener("keydown", handleKeyDown, true);
      }
    };
  }, [isOpen, onClose]);

  // Reset tabs/pages when modal is opened/changed
  useEffect(() => {
    setAboutPage(1);
    setProjectsTab("archive");
    setCabinetTab("contact");
  }, [isOpen, type]);

  if (!isOpen) return null;

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      if (window.portfolioSFX) window.portfolioSFX.playClick();
      setTimeout(() => setCopiedText(""), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTabChange = (tab, typeStr) => {
    if (window.portfolioSFX) window.portfolioSFX.playClick();
    if (typeStr === "projects") {
      setProjectsTab(tab);
    } else {
      setCabinetTab(tab);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "about":
        return (
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-center border-b-4 border-[#3e3b66] pb-2 text-[#3e3b66]">
              ABOUT ME
            </h2>
            
            <div className="flex-grow my-4 text-left overflow-y-auto px-2 max-h-[350px]">
              {aboutPage === 1 && (
                <div className="space-y-4 text-lg md:text-xl leading-relaxed text-[#3e3b66]">
                  <p>
                    Hi — I'm <strong className="text-[#e2933f] text-xl">Ved Madurwar</strong>, a Computer Science student at <strong className="text-[#3e3b66]">Vishwakarma Institute of Technology, Pune</strong> (B.Tech Computer Science, CGPA: 8.9).
                  </p>
                  <p>
                    I specialize in <strong className="text-[#3e3b66]">AI/ML and Full-Stack development</strong>, with experience building physics-aware deep learning models (TensorFlow) and multi-agent AI orchestration pipelines.
                  </p>
                  <p>
                    I enjoy merging engineering and visual design to create scalable, interactive, and data-driven web solutions.
                  </p>
                </div>
              )}

              {aboutPage === 2 && (
                <div className="space-y-4 text-lg md:text-xl leading-relaxed text-[#3e3b66]">
                  <h3 className="font-bold text-xl text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">
                    WORK EXPERIENCE
                  </h3>
                  <div>
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-[#3e3b66] text-lg">Elevate Labs</span>
                      <span className="text-sm bg-[#3e3b66] text-white px-2 py-0.5 rounded-none">May 2026 – July 2026</span>
                    </div>
                    <div className="text-sm italic text-gray-600 font-bold mb-2">
                      AI & ML Intern &bull; <span className="text-[#e2933f]">Awarded Best Performer</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-base text-[#3e3b66]">
                      <li>Actively contributed to comprehensive data analysis, end-to-end model development, and machine learning solutions.</li>
                      <li>Optimized model inference performance and data extraction across complex production datasets.</li>
                      <li>Recognized as the <strong>Best Performer</strong> for engineering excellence and impactful team collaboration.</li>
                    </ul>
                  </div>
                </div>
              )}

              {aboutPage === 3 && (
                <div className="space-y-4 text-lg md:text-xl leading-relaxed text-[#3e3b66]">
                  <div>
                    <h3 className="font-bold text-lg text-[#e2933f] border-b border-[#3e3b66]/20 pb-1 mb-2">
                      PUBLICATIONS & ACHIEVEMENTS
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#3e3b66]">
                      <li>
                        <strong>IEEE 13CTCON 2026:</strong> Presented & co-authored <em>"Physics-Aware Spatiotemporal Forecasting of Methane Emissions Using Multi-Source Satellite Data and Deep Learning"</em> detailing the SAT-MethaneNet architecture.
                      </li>
                      <li>
                        <strong>Figma Hackathon:</strong> Secured <strong>Runner-up (2nd Place)</strong> by designing high-fidelity interactive user interface prototypes under intense time limits.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-bold text-lg text-[#e2933f] border-b border-[#3e3b66]/20 pb-1 mb-2">
                      CERTIFICATIONS
                    </h3>
                    <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-2.5 rounded-none text-sm md:text-base shadow-[2px_2px_0px_0px_#3e3b66]">
                      <strong>Supervised Machine Learning: Regression and Classification</strong> &bull; Stanford University & DeepLearning.AI
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t-4 border-[#3e3b66] pt-3">
              <button
                disabled={aboutPage === 1}
                onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playClick(); setAboutPage((p) => p - 1); }}
                className={`px-4 py-2 bg-[#3e3b66] text-white rounded-none font-bold border-2 border-[#3e3b66] shadow-[2px_2px_0px_0px_#161426] transition active:translate-y-0.5 ${
                  aboutPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2e2b54] cursor-pointer"
                }`}
              >
                &larr; Back
              </button>
              <span className="text-xl font-bold text-[#3e3b66]">{aboutPage} / 3</span>
              <button
                disabled={aboutPage === 3}
                onClick={() => { if (window.portfolioSFX) window.portfolioSFX.playClick(); setAboutPage((p) => p + 1); }}
                className={`px-4 py-2 bg-[#3e3b66] text-white rounded-none font-bold border-2 border-[#3e3b66] shadow-[2px_2px_0px_0px_#161426] transition active:translate-y-0.5 ${
                  aboutPage === 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2e2b54] cursor-pointer"
                }`}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        );

      case "skills":
        const stats = [
          { name: "PYTHON", value: 90 },
          { name: "C++", value: 85 },
          { name: "JAVASCRIPT", value: 82 },
          { name: "REACT/NEXT", value: 80 },
          { name: "AI / ML", value: 88 }
        ];
        const skillCategories = [
          { title: "LANGUAGES", items: ["Python", "C++", "JavaScript", "SQL", "HTML/CSS", "Java"] },
          { title: "AI / ML", items: ["PyTorch", "TensorFlow/Keras", "scikit-learn", "pandas", "NumPy", "Hugging Face"] },
          { title: "FRAMEWORKS", items: ["Next.js", "React", "Vite", "Flask", "WebAssembly (WASM)"] },
          { title: "TOOLS", items: ["Git/GitHub", "n8n", "Figma", "Google Earth Engine", "Docker/MLflow (Familiar)"] }
        ];
        return (
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-center border-b-4 border-[#3e3b66] pb-2 text-[#3e3b66]">
              SKILLS & STATS
            </h2>
            <div className="flex-grow my-4 overflow-y-auto px-2 space-y-4 max-h-[380px]">
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <span className="w-24 text-left font-bold text-sm text-[#3e3b66]">{stat.name}</span>
                    <div className="flex-grow h-5 bg-[#fcf3e3] border-2 border-[#3e3b66] rounded-none overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-[#3e3b66]"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-sm text-[#3e3b66]">{stat.value}%</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t-2 border-[#3e3b66]/20">
                {skillCategories.map((cat) => (
                  <div key={cat.title} className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-2.5 rounded-none text-left shadow-[2px_2px_0px_0px_#3e3b66]">
                    <h4 className="font-bold text-[#e2933f] text-sm mb-1">{cat.title}</h4>
                    <p className="text-sm text-[#3e3b66] leading-tight font-bold">
                      {cat.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // 'projects' is handled outside by VedOS full-screen overlay
      case "projects":
        return null;

      case "contact":
        const contacts = [
          { label: "Email", value: "ved.madurwar.professional@gmail.com", icon: "✉️", action: "copy" },
          { label: "Phone", value: "+91-63613 20426", icon: "📱", action: "copy" },
          { label: "LinkedIn", value: "LinkedIn Profile", link: "https://www.linkedin.com/in/ved-madurwar-34265a332", icon: "🔗", action: "link" },
          { label: "GitHub", value: "github.com/parallaxiz", link: "https://github.com/parallaxiz", icon: "🐙", action: "link" }
        ];
        return (
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-center border-b-4 border-[#3e3b66] pb-2 text-[#3e3b66]">
              CONTACT INFO
            </h2>

            <div className="flex-grow my-4 px-2 max-h-[380px] overflow-y-auto">
              <div className="flex flex-col gap-3 py-2">
                {contacts.map((c) => (
                  <div
                    key={c.label}
                    onClick={() => {
                      if (c.action === "copy") {
                        copyToClipboard(c.value, c.label);
                      } else {
                        if (window.portfolioSFX) window.portfolioSFX.playClick();
                        window.open(c.link, "_blank");
                      }
                    }}
                    className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-2.5 sm:p-3 rounded-none flex items-center justify-between gap-2 cursor-pointer transition transform hover:-translate-y-0.5 hover:bg-[#3e3b66] hover:text-white group text-[#3e3b66] shadow-[2px_2px_0px_0px_#3e3b66] min-w-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-1">
                      <span className="text-xl sm:text-2xl shrink-0">{c.icon}</span>
                      <div className="text-left select-none min-w-0 flex-1">
                        <div className="text-[10px] sm:text-xs md:text-sm text-[#e2933f] group-hover:text-amber-200 font-bold uppercase">{c.label}</div>
                        <div className="font-semibold text-[11px] sm:text-xs md:text-base group-hover:text-white break-all">{c.value}</div>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs border-2 border-[#3e3b66] rounded-none px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white text-[#3e3b66] group-hover:bg-[#e2933f] group-hover:text-white group-hover:border-white font-bold transition shrink-0">
                      {c.action === "copy" ? (copiedText === c.label ? "Copied!" : "Copy") : "Open"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "rules":
        return (
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-center border-b-4 border-[#3e3b66] pb-2 text-[#3e3b66]">
              RULES & CONTROLS
            </h2>
            <div className="flex-grow my-4 text-left overflow-y-auto px-2 max-h-[350px] space-y-4 text-[#3e3b66] text-lg">
              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded-none space-y-2 shadow-[2px_2px_0px_0px_#3e3b66]">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Character Controls</h3>
                <p className="flex items-center gap-2">
                  <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded-none text-sm">W A S D</span> or 
                  <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded-none text-sm">&uarr; &larr; &rarr; &darr;</span> keys to move the player around.
                </p>
                <p>
                  The avatar animates and moves in all directions across the isometric room.
                </p>
              </div>

              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded-none space-y-2 shadow-[2px_2px_0px_0px_#3e3b66]">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Interactions</h3>
                <p>
                  Walk up to room elements (<strong className="text-[#e2933f]">Bed</strong>, <strong className="text-[#e2933f]">Cabinet</strong>, <strong className="text-[#e2933f]">Laptop</strong>, <strong className="text-[#e2933f]">Bookshelf</strong>) to highlight them.
                </p>
                <p>
                  Press <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded-none text-sm">E</span> or <strong>click directly</strong> on the highlighted objects to read about different portfolio sections.
                </p>
              </div>

              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded-none space-y-2 shadow-[2px_2px_0px_0px_#3e3b66]">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Closing Modals</h3>
                <p>
                  Press <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded-none text-sm">E</span>, <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded-none text-sm">ESC</span>, click the <strong>X button</strong>, or click <strong>outside the box</strong> to close any popup and return to walking.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !type) return null;

  // Full-screen VedOS for projects — rendered outside normal modal frame
  if (type === "projects") {
    return <VedOS onClose={onClose} />;
  }

  const content = renderContent();
  if (!content) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-3 sm:p-4 transition-opacity duration-300 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#fcecd1] border-4 border-[#3e3b66] rounded-none p-4 sm:p-5 md:p-6 w-full max-w-[95vw] md:max-w-[650px] min-h-[380px] md:min-h-[480px] max-h-[90vh] shadow-[8px_8px_0px_0px_#161426] text-center flex flex-col select-none overflow-hidden"
        style={{ fontFamily: 'edit-undo' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Header Bar with Sharp Close Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-4 border-[#3e3b66]">
          <div className="text-xs md:text-sm font-bold text-[#e2933f] uppercase tracking-wider flex items-center gap-2">
            <span>&gt;</span>
            <span>PORTFOLIO_SYSTEM.EXE</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 md:w-9 md:h-9 bg-red-500 hover:bg-red-600 active:translate-y-0.5 text-white font-bold text-lg rounded-none border-2 border-[#3e3b66] flex items-center justify-center shadow-[2px_2px_0px_0px_#3e3b66] transition duration-150 cursor-pointer touch-manipulation z-50"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-1">
          {content}
        </div>
      </div>
    </div>
  );
}
