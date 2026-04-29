'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const agents = [
  { 
    id: 1, 
    slug: 'web-frontend', 
    name: 'Frontend Architect', 
    role: 'Interface Systems • Motion • Experience Design',
    model: 'Llama 3.3 70B',
    accent: 'emerald'
  },
  { 
    id: 2, 
    slug: 'media-image', 
    name: 'Visual Intelligence', 
    role: 'Synthetic Media • Generative Systems • Aesthetic Intelligence',
    model: 'Mixtral 8x7B',
    accent: 'violet'
  },
  { 
    id: 3, 
    slug: 'reasoning-research', 
    name: 'Strategic Intelligence', 
    role: 'Deep Reasoning • Systems Thinking • Foresight',
    model: 'Llama 3.3 70B',
    accent: 'cyan'
  },
  { 
    id: 4, 
    slug: 'github-agent', 
    name: 'Repository Intelligence', 
    role: 'Automation • Version Control • Knowledge Management',
    model: 'Mixtral 8x7B',
    accent: 'amber'
  },
  { 
    id: 5, 
    slug: 'web-fullstack', 
    name: 'Systems Orchestrator', 
    role: 'End-to-End Architecture • Integration • Scale',
    model: 'Llama 3.3 70B',
    accent: 'rose'
  },
];

export default function OutsideTheBox() {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [output, setOutput] = useState('');
  const [activeAgents, setActiveAgents] = useState<number[]>([1, 3, 5]);
  const [history, setHistory] = useState<Array<{prompt: string, response: string}>>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  // Refined 3D Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(420, 420);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    camera.position.z = 6;

    // Elegant particle field
    const geometry = new THREE.BufferGeometry();
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color = new THREE.Color();

    for (let i = 0; i < count * 3; i += 3) {
      positions[i]     = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;

      color.setHSL(0.42, 0.7, 0.75);
      colors[i]     = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;

      sizes[i/3] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    sceneRef.current = { points, renderer, camera, scene };

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      points.rotation.y = Date.now() * 0.00008;
      points.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const addToHistory = (p: string, r: string) => {
    setHistory(prev => [{ prompt: p, response: r }, ...prev].slice(0, 4));
  };

  const runSwarm = async () => {
    if (!prompt.trim() || isThinking) return;

    setIsThinking(true);
    setOutput('Orchestrating swarm intelligence...');

    // Real multi-agent collaboration simulation with refined UX
    setTimeout(async () => {
      const thinkingSteps = [
        "Strategic Intelligence analyzing intent...",
        "Systems Orchestrator designing architecture...",
        "Interface Systems crafting spatial experience...",
        "Visual Intelligence synthesizing aesthetic direction...",
        "Repository Intelligence preparing deployment infrastructure..."
      ];

      for (const step of thinkingSteps) {
        setOutput(step);
        await new Promise(r => setTimeout(r, 420));
      }

      const finalResponse = `The swarm has synthesized a comprehensive response to your directive.

**Strategic Direction:** ${prompt}

**Systems Architecture:** A modular, future-proof foundation using React Server Components, Edge Runtime, and advanced state orchestration.

**Interface Systems:** A spatial, depth-rich experience with fluid micro-interactions, dynamic lighting, and contextual agent presence.

**Aesthetic Intelligence:** Sophisticated dark palette with emerald accent, generous whitespace, and refined typography hierarchy.

**Execution Plan:** Ready for immediate implementation with full collaboration between all specialized agents.`;

      setOutput(finalResponse);
      addToHistory(prompt, finalResponse);
      setPrompt('');
      setIsThinking(false);
    }, 300);
  };

  const talkToAgent = async (agent: any) => {
    setSelectedAgent(agent);
    setOutput(`Connecting to ${agent.name} directly...`);

    setTimeout(() => {
      setOutput(`Hello. I am the ${agent.name} agent.\n\nI specialize in ${agent.role.toLowerCase()}.\n\nHow can I help you push the boundaries of what's possible today?`);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f5] selection:bg-emerald-300 selection:text-black">
      <div className="max-w-[1280px] mx-auto px-10 py-8">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-x-3">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black text-xl leading-none pt-0.5">⟡</div>
            <div className="font-semibold text-3xl tracking-tighter text-white">Outside the Box</div>
          </div>
          
          <div className="flex items-center gap-x-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Swarm</a>
            <a href="#" className="hover:text-white transition-colors">Agents</a>
            <a href="#" className="hover:text-white transition-colors">History</a>
            <a href="#" className="hover:text-white transition-colors">System</a>
            <div className="h-5 w-px bg-white/10 mx-2"></div>
            <div className="px-5 py-2 rounded-3xl bg-white/5 text-emerald-400 text-xs font-mono tracking-[1px] flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              ONLINE
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Command Interface */}
          <div className="col-span-12 lg:col-span-7">
            <div className="glass rounded-3xl p-16">
              <div className="max-w-lg">
                <div className="inline-flex items-center rounded-full bg-white/5 px-5 py-1 text-xs tracking-[2px] text-emerald-400 mb-6">
                  FUTURE INTELLIGENCE PLATFORM
                </div>
                
                <h1 className="text-7xl font-semibold leading-none tracking-tighter text-white mb-8">
                  What should we<br />create together?
                </h1>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision with as much ambition as possible..."
                  className="w-full h-40 bg-black/60 border border-white/10 focus:border-emerald-400 rounded-3xl p-8 text-lg placeholder:text-zinc-500 resize-none focus:outline-none transition-colors"
                />

                <button 
                  onClick={runSwarm}
                  disabled={isThinking || !prompt.trim()}
                  className="mt-8 w-full py-6 bg-white text-black rounded-3xl font-semibold text-lg hover:bg-emerald-300 active:scale-[0.985] transition-all disabled:opacity-40 flex items-center justify-center gap-3 group"
                >
                  {isThinking ? (
                    <>Orchestrating the swarm...</>
                  ) : (
                    <>
                      BEGIN COLLABORATION
                      <span className="text-xl group-active:rotate-45 transition">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Area */}
            {output && (
              <div className="glass mt-6 rounded-3xl p-10 text-[15px] leading-relaxed border border-emerald-400/10">
                {output.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('**') ? 'font-semibold text-emerald-300 mt-6 first:mt-0' : 'text-zinc-300'}>{line}</p>
                ))}
              </div>
            )}
          </div>

          {/* 3D Visualization + Agent List */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* 3D Canvas */}
            <div className="glass rounded-3xl p-6 aspect-square relative overflow-hidden flex items-center justify-center">
              <div ref={canvasRef} className="absolute inset-0 flex items-center justify-center" />
              <div className="absolute bottom-8 left-8 text-xs font-mono text-emerald-400/70 z-10">
                SWARM VISUALIZATION
              </div>
            </div>

            {/* Agents */}
            <div className="glass rounded-3xl p-8">
              <div className="uppercase text-xs tracking-[1.5px] text-zinc-400 mb-6">Specialized Intelligence</div>
              
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => talkToAgent(agent)}
                    className={`group flex items-center gap-5 p-5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all card-hover ${selectedAgent?.id === agent.id ? 'border-emerald-400 bg-white/5' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-2xl bg-${agent.accent}-500/10 flex items-center justify-center text-2xl text-${agent.accent}-400`}>⟡</div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-emerald-300 transition-colors">{agent.name}</div>
                      <div className="text-xs text-zinc-400">{agent.role}</div>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">{agent.model}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-16">
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6">Recent Creations</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item, index) => (
                <div key={index} className="glass p-8 rounded-3xl text-sm">
                  <div className="text-emerald-400 text-xs mb-3 font-mono">DIRECTIVE {String(index+1).padStart(2, '0')}</div>
                  <div className="font-medium mb-4 line-clamp-2">{item.prompt}</div>
                  <div className="text-zinc-400 line-clamp-3 text-[13px]">{item.response}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-8 text-xs font-mono text-zinc-500">
        FUTURE PROOF • PERFECTION DRIVEN • AGENT SWARM v1.0
      </div>
    </div>
  );
}
