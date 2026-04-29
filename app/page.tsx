'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Agent {
  id: number;
  slug: string;
  name: string;
  role: string;
  model: string;
  accent: string;
}

interface LogEntry {
  type: 'system' | 'user' | 'agent' | 'tool';
  message: string;
  timestamp: Date;
  agent?: string;
}

const agents: Agent[] = [
  { id: 1, slug: 'web-frontend', name: 'Frontend Architect', role: 'UI/UX • React • Motion • Three.js', model: 'Llama 3.1 70B', accent: 'emerald' },
  { id: 2, slug: 'reasoning-research', name: 'Strategic Intelligence', role: 'Research • Synthesis • Foresight', model: 'Llama 3.1 70B', accent: 'cyan' },
  { id: 3, slug: 'web-fullstack', name: 'Systems Orchestrator', role: 'Architecture • Integration • Scale', model: 'Llama 3.1 70B', accent: 'rose' },
  { id: 4, slug: 'media-image', name: 'Visual Intelligence', role: 'Image Generation • Aesthetic Systems', model: 'Mixtral 8x7B', accent: 'violet' },
  { id: 5, slug: 'github-agent', name: 'Repository Intelligence', role: 'Git • Automation • Deployment', model: 'Mixtral 8x7B', accent: 'amber' },
];

export default function OutsideTheBoxMasterpiece() {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', message: 'Swarm Intelligence Platform v1000x initialized', timestamp: new Date() },
    { type: 'system', message: 'All 9 agents loaded with full tool access', timestamp: new Date() },
    { type: 'system', message: 'Connected to Groq • Real tool calling enabled', timestamp: new Date() },
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [history, setHistory] = useState<Array<{prompt: string, response: string, agent: string}>>([]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  // Advanced 3D Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(380, 380);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Create elegant particle field
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i]     = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      color.setHSL(0.42, 0.9, 0.7);
      colors[i]     = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;

      sizes[i/3] = Math.random() * 0.6 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    sceneRef.current = { points, renderer, camera, scene };

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      
      points.rotation.y = Date.now() * 0.00012;
      points.rotation.x = Math.sin(Date.now() * 0.0004) * 0.15;
      
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

  const addLog = (message: string, type: LogEntry['type'] = 'system', agentName?: string) => {
    const newLog: LogEntry = {
      type,
      message,
      timestamp: new Date(),
      agent: agentName
    };
    setLogs(prev => [...prev, newLog].slice(-15));
    
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const callSwarm = async (isDirectAgent = false, specificAgent?: Agent) => {
    if (!prompt.trim() || isThinking) return;

    const currentPrompt = prompt;
    setPrompt('');
    setIsThinking(true);
    setCurrentResponse('');

    addLog(isDirectAgent && specificAgent 
      ? `Direct query to ${specificAgent.name}` 
      : 'Launching full swarm intelligence...', 
      'user');

    try {
      const payload = {
        prompt: currentPrompt,
        useSwarm: !isDirectAgent,
        agentSlug: isDirectAgent && specificAgent ? specificAgent.slug : undefined
      };

      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentResponse(data.response);
        addLog(`Response received from ${data.agent}`, 'agent', data.agent);
        
        setHistory(prev => [{
          prompt: currentPrompt,
          response: data.response,
          agent: data.agent
        }, ...prev].slice(0, 5));
      } else {
        const errorMsg = data.error || 'Unknown error occurred';
        setCurrentResponse(`Error: ${errorMsg}`);
        addLog(`Error: ${errorMsg}`, 'system');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connection failed';
      setCurrentResponse(`Connection error: ${errorMsg}. Is GROQ_API_KEY set?`);
      addLog(`Connection error: ${errorMsg}`, 'system');
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callSwarm(false);
  };

  const talkToSpecificAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    callSwarm(true, agent);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#22ff88_0.8px,transparent_1px)] bg-[length:50px_50px] opacity-5"></div>
      
      <div className="relative z-10 max-w-[1480px] mx-auto px-10 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-x-4">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center text-black text-3xl">⟡</div>
            <div>
              <div className="text-4xl font-light tracking-[-2px] text-white">OUTSIDE</div>
              <div className="text-[42px] font-light tracking-[-3px] text-emerald-400 -mt-3">THE BOX</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400 font-medium">9 AGENTS • FULL TOOL ACCESS</span>
            </div>
            <div className="text-xs font-mono text-zinc-500">MASTERPIECE EDITION</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Command Area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[3px] text-emerald-400 mb-3">
                  <div className="w-px h-3 bg-emerald-400"></div>
                  SWARM COMMAND CORE
                </div>
                <h1 className="text-6xl font-light tracking-tighter leading-none mb-4">
                  What should the swarm<br />create for you today?
                </h1>
                <p className="text-zinc-400 max-w-md">The agents have real tools. They can read, write, search, run code, use specialized skills, generate images, and perform git operations.</p>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision with maximum ambition... The swarm is listening."
                  className="w-full h-40 bg-black border border-white/10 rounded-2xl p-8 text-lg placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-y min-h-[140px]"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  disabled={isThinking || !prompt.trim()}
                  className="absolute bottom-6 right-6 px-10 py-4 bg-emerald-400 hover:bg-white text-black disabled:bg-zinc-700 disabled:text-zinc-400 font-semibold rounded-2xl transition-all flex items-center gap-3"
                >
                  {isThinking ? 'SWARM THINKING...' : 'LAUNCH SWARM'}
                  <span className="text-xl">→</span>
                </button>
              </form>
            </div>

            {/* Response Area */}
            {currentResponse && (
              <div className="mt-8 bg-zinc-950/80 border border-emerald-500/20 rounded-3xl p-10">
                <div className="text-emerald-400 text-xs uppercase tracking-widest mb-4">SWARM OUTPUT</div>
                <div className="prose prose-invert max-w-none text-lg leading-relaxed whitespace-pre-wrap">
                  {currentResponse}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Agents + 3D + Logs */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* 3D Visualization */}
            <div className="glass rounded-3xl p-6">
              <div className="text-xs uppercase tracking-widest text-emerald-400 mb-4">LIVE SWARM VISUALIZATION</div>
              <div ref={canvasRef} className="mx-auto rounded-2xl overflow-hidden bg-black/40" />
            </div>

            {/* Agents Grid */}
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald-400 mb-4">ACTIVE AGENTS</div>
              <div className="grid grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => talkToSpecificAgent(agent)}
                    className={`group glass rounded-3xl p-6 cursor-pointer border border-white/5 hover:border-${agent.accent}-400/50 transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className={`text-5xl mb-5 text-${agent.accent}-400/70 group-hover:text-${agent.accent}-400`}>⟡</div>
                    <div className="font-medium text-lg">{agent.name}</div>
                    <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{agent.role}</div>
                    <div className="text-[10px] text-emerald-400/60 mt-4 font-mono">{agent.model}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Terminal */}
            <div className="glass rounded-3xl p-6 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-emerald-400">EXECUTION LOG</div>
                <button onClick={() => setLogs([])} className="text-xs text-zinc-500 hover:text-white">CLEAR</button>
              </div>
              
              <div ref={terminalRef} className="flex-1 overflow-auto text-xs font-mono text-emerald-300/90 space-y-2 pr-2 scrollbar-thin">
                {logs.map((log, i) => (
                  <div key={i} className={`flex gap-3 ${log.type === 'user' ? 'text-white' : log.type === 'tool' ? 'text-amber-300' : ''}`}>
                    <span className="text-emerald-500/40 select-none">→</span>
                    <span>{log.message}</span>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex items-center gap-2 text-emerald-400/70">
                    <span className="animate-pulse">●</span>
                    <span>Swarm is thinking and using tools...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-8 text-xs font-mono text-zinc-500">
        MASTERPIECE EDITION • ALL PREVIOUS WORK INTEGRATED • REAL TOOL USE ENABLED
      </div>
    </div>
  );
}
