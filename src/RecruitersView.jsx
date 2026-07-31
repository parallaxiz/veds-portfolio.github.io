import React, { useState, useEffect } from "react";
import { TextScramble } from "./Components/ui/text-scramble.jsx";
import { GridAnimation } from "./Components/ui/mouse-following-line.jsx";

export default function RecruitersView({ onNavigateHome }) {
  const [activeSection, setActiveSection] = useState("about");

  const handleBackToGame = (e) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const projects = [
    {
      title: "FLAGFORGE",
      desc: "Full-stack gamified cybersecurity platform for Capture-The-Flag (CTF) challenges with automated containerized lab orchestration and real-time scoreboards.",
      tags: ["REACT", "NODE.JS", "WEBASSEMBLY", "TAILWIND"],
      link: "https://github.com/EshwariWasankar/EDI_PROJECT_FLAGFORGE.git"
    },
    {
      title: "AGENT MARIA",
      desc: "Autonomous multi-agent orchestration framework leveraging LLMs and tool-use pipelines for automated code generation, refactoring, and execution trace analysis.",
      tags: ["NEXT.JS", "LANGCHAIN", "OPENAI", "TYPESCRIPT"],
      link: "https://github.com/parallaxiz/agentmaria.git"
    },
    {
      title: "SAT-METHANENET",
      desc: "Physics-aware deep learning architecture combining satellite spatiotemporal imagery for high-precision methane emission detection and plume quantification.",
      tags: ["PYTHON", "TENSORFLOW", "PYTORCH", "IEEE PAPER"],
      link: "https://github.com/parallaxiz/methane.git"
    },
    {
      title: "DNA (DEEP NEURAL ARCHITECTURE)",
      desc: "Visual interactive neural network architecture builder allowing real-time parameter tweaking, forward/backward propagation visualization, and WASM inference.",
      tags: ["TYPESCRIPT", "WEBASSEMBLY", "REACT", "AI"],
      link: "https://github.com/parallaxiz/dna.git"
    },
    {
      title: "OXLO AI TUTOR",
      desc: "Developed a responsive AI-driven tutoring platform using Flask and Google Gemini Pro for real-time educational assistance with lab environment modules.",
      tags: ["PYTHON", "FLASK", "GEMINI PRO", "GENAI"],
      link: "https://github.com/parallaxiz/oxlo.ai-tutor.git"
    }
  ];

  useEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    const rootEl = document.getElementById("root");
    if (rootEl) rootEl.style.overflowY = "auto";

    return () => {
      document.documentElement.style.overflowY = "hidden";
      document.body.style.overflowY = "hidden";
      if (rootEl) rootEl.style.overflowY = "hidden";
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#1a1a2e] text-[#d8eaf4] font-mono relative select-none pb-20">
      {/* Interactive Mouse-Following Grid Animation Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <GridAnimation spacing={35} strokeLength={12} strokeColor="rgba(61, 189, 189, 0.45)" />
      </div>

      {/* Scanline overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)"
        }}
      />

      {/* Striped Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          background: "repeating-linear-gradient(90deg, #2a3a6e 0px, #2a3a6e 40px, #1e2d5a 40px, #1e2d5a 80px)"
        }}
      />

      {/* Fixed Top Back Button */}
      <a 
        href="/"
        onClick={handleBackToGame}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-[10000] bg-[#0f2a44] border-2 border-[#3dbdbd] text-[#f0f8ff] hover:bg-[#3dbdbd] hover:text-[#1a1a2e] px-3 py-2 text-[10px] sm:text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a2e] transition transform active:translate-y-0.5 cursor-pointer uppercase"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        &larr; BACK TO GAME
      </a>

      {/* Main Header */}
      <header className="relative z-10 text-center pt-14 sm:pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <div 
          className="text-[#3dbdbd] text-[9px] sm:text-xs uppercase tracking-widest mb-3 animate-pulse"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <TextScramble duration={1.2}>▶ PLAYER_ONE.EXE LOADED</TextScramble>
        </div>

        <h1 
          className="text-white text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3 drop-shadow-[4px_4px_0px_#3dbdbd]"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <TextScramble duration={1.5}>VED'S PORTFOLIO</TextScramble>
        </h1>

        <div className="text-[#7aa8c4] text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          <TextScramble duration={1.8}>// Computer Science Student | AI & Full Stack Dev</TextScramble>
        </div>

        <div className="mt-5">
          <a
            href="/"
            onClick={handleBackToGame}
            className="inline-block bg-[#ff9f5a] text-[#1a1a2e] border-2 border-white px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-[4px_4px_0px_0px_#1a1a2e] hover:bg-[#56e0d8] transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer uppercase"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            &larr; BACK TO INTERACTIVE GAME
          </a>
        </div>

        <div className="flex justify-center gap-4 text-2xl mt-6">
          <span className="hover:animate-bounce cursor-pointer">🎮</span>
          <span className="hover:animate-bounce cursor-pointer">💻</span>
          <span className="hover:animate-bounce cursor-pointer">🎨</span>
          <span className="hover:animate-bounce cursor-pointer">⚡</span>
          <span className="hover:animate-bounce cursor-pointer">🚀</span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-wrap justify-center gap-2 sm:gap-4 p-3 bg-[#0f2a44]/90 border-y-2 border-[#3dbdbd] max-w-4xl mx-auto my-4 shadow-xl">
        {["about", "experience", "skills", "projects", "achievements", "contact"].map((sec) => (
          <a
            key={sec}
            href={`#${sec}`}
            onClick={() => setActiveSection(sec)}
            className={`text-[9px] sm:text-xs px-2.5 py-1 font-bold uppercase transition ${
              activeSection === sec
                ? "bg-[#3dbdbd] text-[#1a1a2e]"
                : "text-[#d8eaf4] hover:text-[#56e0d8] hover:bg-[#16213e]"
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <TextScramble duration={0.6}>{sec}</TextScramble>
          </a>
        ))}
      </nav>

      {/* Content Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-10 mt-8">
        
        {/* ABOUT ME */}
        <section id="about" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">👾</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>ABOUT ME</TextScramble>
            </h2>
          </div>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <p>
              <TextScramble duration={1.4}>
                Hi — I'm Ved Madurwar, a Computer Science student at Vishwakarma Institute of Technology, Pune (B.Tech Computer Science, CGPA: 8.9), specializing in AI/ML and Full-Stack development.
              </TextScramble>
            </p>
            <p>
              <TextScramble duration={1.6}>
                I specialize in building physics-aware deep learning models (TensorFlow) and multi-agent AI orchestration pipelines. I have a proven track record in research and UI/UX design, with a focus on building scalable, data-driven solutions.
              </TextScramble>
            </p>
            <p>
              <TextScramble duration={1.8}>
                I enjoy the intersection of engineering and design, turning complex requirements into beautiful, functional interfaces in Figma, Next.js, and Phaser.js.
              </TextScramble>
            </p>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">💼</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>WORK EXPERIENCE</TextScramble>
            </h2>
          </div>
          <div className="bg-[#16213e] border border-[#3dbdbd] p-4 space-y-3 shadow-md">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h3 className="text-lg font-bold text-white uppercase">
                <TextScramble duration={0.8}>ELEVATE LABS</TextScramble>
              </h3>
              <span className="text-xs bg-[#3dbdbd] text-[#1a1a2e] font-bold px-2 py-0.5 uppercase">
                <TextScramble duration={0.8}>MAY 2026 – JULY 2026</TextScramble>
              </span>
            </div>
            <div className="text-sm text-[#ff9f5a] font-bold italic">
              <TextScramble duration={1.0}>AI & ML Intern • Awarded Best Performer</TextScramble>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#d8eaf4]">
              <li>
                <TextScramble duration={1.2}>Actively contributed to comprehensive data analysis, end-to-end model development, and machine learning solutions.</TextScramble>
              </li>
              <li>
                <TextScramble duration={1.4}>Optimized model inference performance and data extraction across complex production datasets.</TextScramble>
              </li>
              <li>
                <TextScramble duration={1.6}>Recognized as the Best Performer for engineering excellence and impactful team collaboration.</TextScramble>
              </li>
            </ul>
          </div>
        </section>

        {/* TECHNICAL SKILLS */}
        <section id="skills" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">⚔️</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>TECHNICAL SKILLS</TextScramble>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "LANGUAGES", items: "Python, C++, JavaScript, SQL, HTML/CSS, Java" },
              { title: "AI / ML", items: "PyTorch, TensorFlow/Keras, scikit-learn, pandas, NumPy, Hugging Face" },
              { title: "FRAMEWORKS", items: "Next.js, React, Vite, Flask, WebAssembly (WASM)" },
              { title: "TOOLS & DEVOPS", items: "Git/GitHub, n8n, Figma, Google Earth Engine, Docker, MLflow" }
            ].map((cat) => (
              <div key={cat.title} className="bg-[#16213e] border border-[#3dbdbd] p-3 space-y-2">
                <h4 className="text-xs text-[#ff9f5a] font-bold uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  <TextScramble duration={0.8}>{cat.title}</TextScramble>
                </h4>
                <p className="text-sm font-semibold text-white">
                  <TextScramble duration={1.2}>{cat.items}</TextScramble>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section id="projects" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">🚀</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>FEATURED PROJECTS</TextScramble>
            </h2>
          </div>
          <div className="space-y-4">
            {projects.map((p) => (
              <div 
                key={p.title}
                onClick={() => window.open(p.link, "_blank")}
                className="bg-[#16213e] border-2 border-[#3dbdbd] hover:border-[#ff9f5a] p-4 cursor-pointer transition transform hover:-translate-y-1 shadow-md group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#56e0d8] group-hover:text-[#ff9f5a] transition uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    <TextScramble duration={0.8}>{p.title}</TextScramble>
                  </h3>
                  <span className="text-xs text-[#3dbdbd] group-hover:text-white font-bold">[ VIEW REPO &rarr; ]</span>
                </div>
                <p className="text-xs sm:text-sm text-[#d8eaf4] leading-relaxed mb-3">
                  <TextScramble duration={1.4}>{p.desc}</TextScramble>
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-[#0f2a44] border border-[#3dbdbd] text-[#3dbdbd] px-2 py-0.5 font-bold uppercase">
                      <TextScramble duration={0.6}>{t}</TextScramble>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">🏆</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>ACHIEVEMENTS & CERTIFICATIONS</TextScramble>
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-[#16213e] border border-[#3dbdbd] p-4 space-y-2">
              <h3 className="text-sm font-bold text-[#ff9f5a] uppercase">
                <TextScramble duration={0.8}>IEEE 13CTCON 2026 PUBLICATION</TextScramble>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                <TextScramble duration={1.4}>
                  Presented & co-authored "Physics-Aware Spatiotemporal Forecasting of Methane Emissions Using Multi-Source Satellite Data and Deep Learning" detailing the SAT-MethaneNet architecture.
                </TextScramble>
              </p>
            </div>

            <div className="bg-[#16213e] border border-[#3dbdbd] p-4 space-y-2">
              <h3 className="text-sm font-bold text-[#ff9f5a] uppercase">
                <TextScramble duration={0.8}>FIGMA DESIGNATHON — RUNNER-UP (2ND PLACE)</TextScramble>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                <TextScramble duration={1.4}>
                  Secured 2nd Place out of top participating teams by designing high-fidelity interactive user interface prototypes under strict time constraints.
                </TextScramble>
              </p>
            </div>

            <div className="bg-[#16213e] border border-[#3dbdbd] p-4 space-y-2">
              <h3 className="text-sm font-bold text-[#ff9f5a] uppercase">
                <TextScramble duration={0.8}>STANFORD & DEEPLEARNING.AI CERTIFICATION</TextScramble>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                <TextScramble duration={1.4}>
                  Supervised Machine Learning: Regression and Classification — Earned Stanford University verification badge.
                </TextScramble>
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-[#0f2a44]/90 border-2 border-[#3dbdbd] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#16213e]">
          <div className="flex items-center gap-3 border-b-2 border-[#3dbdbd] pb-3 mb-4">
            <span className="text-2xl">📡</span>
            <h2 
              className="text-lg sm:text-xl font-bold text-[#56e0d8] uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <TextScramble duration={1.0}>CONTACT</TextScramble>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "EMAIL", val: "ved.madurwar.professional@gmail.com", icon: "✉️", link: "mailto:ved.madurwar.professional@gmail.com" },
              { label: "PHONE", val: "+91-63613 20426", icon: "📱", link: "tel:+916361320426" },
              { label: "LINKEDIN", val: "linkedin.com/in/ved-madurwar-34265a332", icon: "💼", link: "https://www.linkedin.com/in/ved-madurwar-34265a332" },
              { label: "GITHUB", val: "github.com/parallaxiz", icon: "🐙", link: "https://github.com/parallaxiz" }
            ].map((c) => (
              <a 
                key={c.label} 
                href={c.link} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#16213e] border border-[#3dbdbd] hover:border-[#ff9f5a] p-3 flex items-center gap-3 transition hover:-translate-y-0.5 group"
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-[#ff9f5a] font-bold uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    <TextScramble duration={0.6}>{c.label}</TextScramble>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#56e0d8] truncate">
                    <TextScramble duration={1.2}>{c.val}</TextScramble>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>

      <footer className="text-center text-[9px] text-[#7aa8c4] mt-12 py-6 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        <TextScramble duration={1.0}>© 2026 VED — SAVE STATE LOADED — ALL RIGHTS RESERVED</TextScramble>
      </footer>
    </div>
  );
}
