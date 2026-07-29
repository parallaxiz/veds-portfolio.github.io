import React, { useState, useEffect } from "react";

export default function Modal({ isOpen, type, onClose }) {
  const [aboutPage, setAboutPage] = useState(1);
  const [copiedText, setCopiedText] = useState("");

  // Close on ESC key or "E" key press
  useEffect(() => {
    if (!isOpen) return;

    let handleKeyDown = null;

    // Small delay to ensure the key press that opened the modal doesn't immediately close it
    const timer = setTimeout(() => {
      handleKeyDown = (e) => {
        if (e.key === "Escape" || e.key === "e" || e.key === "E") {
          e.stopPropagation(); // Stop propagation in capture phase so Phaser doesn't catch and block it
          onClose();
        }
      };
      // Use capture phase (third parameter true) to intercept the event before Phaser's listeners
      window.addEventListener("keydown", handleKeyDown, true);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (handleKeyDown) {
        window.removeEventListener("keydown", handleKeyDown, true);
      }
    };
  }, [isOpen, onClose]);

  // Reset page when modal is opened/changed
  useEffect(() => {
    setAboutPage(1);
  }, [isOpen, type]);

  if (!isOpen) return null;

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Render Modal Content based on type
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
                      <span className="text-sm bg-[#3e3b66] text-white px-2 py-0.5 rounded">May 2026 – July 2026</span>
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
                    <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-2.5 rounded text-sm md:text-base">
                      <strong>Supervised Machine Learning: Regression and Classification</strong> &bull; Stanford University & DeepLearning.AI
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t-4 border-[#3e3b66] pt-3">
              <button
                disabled={aboutPage === 1}
                onClick={() => setAboutPage((p) => p - 1)}
                className={`px-4 py-2 bg-[#3e3b66] text-white rounded font-semibold transition ${
                  aboutPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2e2b54]"
                }`}
              >
                &larr; Back
              </button>
              <span className="text-xl font-bold text-[#3e3b66]">{aboutPage} / 3</span>
              <button
                disabled={aboutPage === 3}
                onClick={() => setAboutPage((p) => p + 1)}
                className={`px-4 py-2 bg-[#3e3b66] text-white rounded font-semibold transition ${
                  aboutPage === 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2e2b54]"
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
              {/* Stat bars */}
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <span className="w-24 text-left font-bold text-sm text-[#3e3b66]">{stat.name}</span>
                    <div className="flex-grow h-5 bg-gray-200 border-2 border-[#3e3b66] rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3e3b66] to-[#5a569c]"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-sm text-[#3e3b66]">{stat.value}%</span>
                  </div>
                ))}
              </div>
              
              {/* Grid of categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t-2 border-[#3e3b66]/20">
                {skillCategories.map((cat) => (
                  <div key={cat.title} className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-2 rounded text-left">
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

      case "projects":
        const projectList = [
          {
            title: "Agent Maria: Multi-Agent System",
            desc: "Engineered a multi-agent orchestration framework to automate complex workflows and enable independent AI personas to collaborate on task execution. Integrated LLMs for autonomous decision-making using structured output aggregation.",
            tags: ["PYTHON", "LLMS", "AI ORCHESTRATION", "GENAI"],
            link: "https://github.com/parallaxiz"
          },
          {
            title: "SAT-MethaneNet: Emission Forecasting",
            desc: "Engineered a physics-aware Residual U-Net model using skip connections and Weighted MSE loss to predict methane dispersion. Developed a spatial data fusion pipeline for Sentinel-5P and EMIT data.",
            tags: ["PYTHON", "TENSORFLOW", "EARTH ENGINE", "DEEP LEARNING"],
            link: "https://github.com/parallaxiz"
          },
          {
            title: "\"The AI Council\" Startup Validator",
            desc: "Engineered a multi-agent orchestration pipeline using n8n to evaluate startup concepts through specialized AI personas. Architected a Next.js frontend with secure API routes and LLM chaining.",
            tags: ["NEXT.JS", "N8N", "GEMINI 1.5 FLASH", "AI"],
            link: "https://github.com/parallaxiz"
          },
          {
            title: "Oxlo AI Tutor",
            desc: "Developed a responsive AI-driven tutoring platform using Flask and Google Gemini Pro for real-time educational assistance. Integrated a dynamic Markdown chat interface with lab environment custom modules.",
            tags: ["PYTHON", "FLASK", "GEMINI PRO", "GENAI"],
            link: "https://github.com/parallaxiz"
          }
        ];
        return (
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-center border-b-4 border-[#3e3b66] pb-2 text-[#3e3b66]">
              PROJECTS
            </h2>
            <div className="flex-grow my-4 overflow-y-auto px-2 space-y-3 max-h-[380px]">
              {projectList.map((project) => (
                <div 
                  key={project.title} 
                  className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded text-left transition transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base md:text-lg text-[#e2933f]">{project.title}</h3>
                    <button
                      onClick={() => window.open(project.link, "_blank")}
                      className="text-xs bg-[#3e3b66] hover:bg-[#e2933f] text-white hover:text-black font-bold px-2 py-0.5 rounded transition border border-[#3e3b66]"
                    >
                      GitHub &rarr;
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-[#3e3b66] my-1 leading-normal">{project.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

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
              CONTACT
            </h2>
            <div className="flex-grow my-6 flex flex-col justify-center gap-4">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  onClick={() => {
                    if (c.action === "copy") {
                      copyToClipboard(c.value, c.label);
                    } else {
                      window.open(c.link, "_blank");
                    }
                  }}
                  className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded flex items-center justify-between cursor-pointer transition transform hover:-translate-y-0.5 hover:bg-[#3e3b66] hover:text-white group text-[#3e3b66]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="text-left">
                      <div className="text-sm md:text-base text-[#e2933f] group-hover:text-amber-200 font-bold uppercase">{c.label}</div>
                      <div className="font-semibold text-base md:text-lg group-hover:text-white">{c.value}</div>
                    </div>
                  </div>
                  <span className="text-sm border-2 border-[#3e3b66] rounded px-2.5 py-1 bg-white text-[#3e3b66] group-hover:bg-[#e2933f] group-hover:text-white group-hover:border-white font-bold transition">
                    {c.action === "copy" ? (copiedText === c.label ? "Copied!" : "Copy") : "Open"}
                  </span>
                </div>
              ))}
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
              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded space-y-2">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Character Controls</h3>
                <p className="flex items-center gap-2">
                  <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded text-sm">W A S D</span> or 
                  <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded text-sm">&uarr; &larr; &rarr; &darr;</span> keys to move the player around.
                </p>
                <p>
                  The avatar animates and moves in all directions across the isometric room.
                </p>
              </div>

              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded space-y-2">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Interactions</h3>
                <p>
                  Walk up to room elements (<strong className="text-[#e2933f]">Bed</strong>, <strong className="text-[#e2933f]">Cabinet</strong>, <strong className="text-[#e2933f]">Laptop</strong>, <strong className="text-[#e2933f]">Bookshelf</strong>) to highlight them.
                </p>
                <p>
                  Press <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded text-sm">E</span> or <strong>click directly</strong> on the highlighted objects to read about different portfolio sections.
                </p>
              </div>

              <div className="bg-[#fcf3e3] border-2 border-[#3e3b66] p-3 rounded space-y-2">
                <h3 className="font-bold text-[#e2933f] border-b border-[#3e3b66]/20 pb-1">Closing Modals</h3>
                <p>
                  Press <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded text-sm">E</span>, <span className="font-bold bg-[#3e3b66] text-white px-2 py-0.5 rounded text-sm">ESC</span>, click the <strong>X button</strong>, or click <strong>outside the box</strong> to close any popup and return to walking.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#fcecd1] border-4 border-[#3e3b66] rounded-xl p-5 md:p-6 w-full max-w-[650px] min-h-[480px] shadow-2xl text-center flex flex-col select-none"
        style={{ fontFamily: 'edit-undo' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full border-2 border-[#3e3b66] font-bold text-lg flex items-center justify-center shadow-lg transition duration-200"
        >
          X
        </button>

        {/* Modal content */}
        <div className="flex-grow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
