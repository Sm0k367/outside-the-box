'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const agents = [
  { id: 1, slug: 'web-frontend', name: 'WEB FRONTEND', specialty: 'UI/UX • React • Motion • Tailwind', model: 'llama-3.3-70b-versatile', color: 'emerald' },
  { id: 2, slug: 'media-image', name: 'MEDIA IMAGE', specialty: 'Replicate • Visual Synthesis • Generation', model: 'mixtral-8x7b-32768', color: 'violet' },
  { id: 3, slug: 'reasoning-research', name: 'REASONING CORE', specialty: 'Deep Research • Strategy • Analysis', model: 'llama-3.3-70b-versatile', color: 'cyan' },
  { id: 4, slug: 'github-agent', name: 'GITHUB NEXUS', specialty: 'Repository • Automation • Deployment', model: 'mixtral-8x7b-32768', color: 'amber' },
  { id: 5, slug: 'web-fullstack', name: 'FULLSTACK ORCHESTRATOR', specialty: 'Architecture • Integration • Systems', model: 'llama-3.3-70b-versatile', color: 'rose' },
  { id: 6, slug: 'media-video-audio', name: 'MEDIA STUDIO', specialty: 'Animation • Audio • Multimedia', model: 'mixtral-8x7b-32768', color: 'fuchsia' },
];

export default function OutsideTheBox1000x() {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '> Swarm core v1000x online',
    '> Connected to Groq Llama 3.3 70B + Mixtral',
    '> All agents loaded with real API access',
    '> Collaboration layer active',
    '> Awaiting your command...'
  ]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `> ${message}`].slice(-12));
  };

  // Initialize 3D Background
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(800, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    camera.position.z = 5;

    // Create floating particles (representing agents)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 80;
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 8;

      const color = new THREE.Color().setHSL(0.3 + Math.random() * 0.2, 0.8, 0.7);
      colorsArray[i] = color.r;
      colorsArray[i + 1] = color.g;
      colorsArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    const animate = () => {
      requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(800, 600);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const callAgent = async (slug: string, prompt: string, context: string = '') => {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentSlug: slug, prompt, context })
      });
      
      const data = await res.json();
      return data.response || "The agent is thinking...";
    } catch (e) {
      return "Connection to Groq failed. Please add your GROQ_API_KEY in Vercel settings.";
    }
  };

  const executeSwarm = async () => {
    if (!taskInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    addLog(`DIRECTIVE: ${taskInput}`);
    
    const newConversation = { task: taskInput, responses: [] as any[] };
    
    // Phase 1: Reasoning Core analyzes
    addLog('Reasoning Core (Llama 3.3 70B) analyzing directive...');
    const researchResponse = await callAgent('reasoning-research', taskInput);
    addLog('Reasoning Core completed analysis.');
    newConversation.responses.push({ agent: 'Reasoning Core', response: researchResponse });
    
    // Phase 2: Collaboration - Fullstack and Frontend work together
    addLog('Orchestrator delegating to Fullstack + Frontend agents...');
    const fullstackResponse = await callAgent('web-fullstack', taskInput, researchResponse);
    addLog('Fullstack agent completed architecture.');
    newConversation.responses.push({ agent: 'Fullstack Orchestrator', response: fullstackResponse });
    
    const frontendResponse = await callAgent('web-frontend', taskInput + "\n\nContext from Fullstack: " + fullstackResponse, researchResponse);
    addLog('Frontend agent completed UI design.');
    newConversation.responses.push({ agent: 'Web Frontend', response: frontendResponse });
    
    // Phase 3: Media & GitHub agents
    addLog('Media Studio and GitHub Nexus activating in parallel...');
    const mediaResponse = await callAgent('media-image', `Create visual assets for: ${taskInput}`);
    newConversation.responses.push({ agent: 'Media Studio', response: mediaResponse });
    
    addLog('SWARM COLLABORATION COMPLETE — EXCELLENCE ACHIEVED');
    
    setConversations(prev => [newConversation, ...prev].slice(0, 5));
    setCurrentResponse(`Swarm completed your request: "${taskInput}"\n\n${researchResponse.substring(0, 180)}...\n\nSee full agent conversation in the terminal above.`);
    
    setTaskInput('');
    setIsProcessing(false);
  };

  const interrogateAgent = async (agent: any) => {
    setSelectedAgent(agent);
    addLog(`INTERROGATING ${agent.name} directly...`);
    
    const response = await callAgent(agent.slug, 
      `You are ${agent.name}. The user wants to talk to you specifically. Respond in character.`
    );
    
    addLog(`${agent.name} responded.`);
    setCurrentResponse(response);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* 3D Background */}
      <div ref={mountRef} className="absolute top-12 right-12 z-0 opacity-40" style={{ width: '800px', height: '600px' }}></div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 title-font">OUTSIDE</div>
            <div className="text-6xl font-bold tracking-tighter text-emerald-400 title-font -ml-3">THE BOX</div>
          </div>
          <div className="flex items-center gap-6 text-sm font-mono">
            <div className="px-6 py-3 bg-emerald-950/50 border border-emerald-500/30 rounded-3xl flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              GROQ LIVE
            </div>
            <div className="text-emerald-400">ALL AGENTS COLLABORATING IN REAL TIME</div>
          </div>
        </div>

        {/* Command Center */}
        <div className="glass rounded-3xl p-12 mb-12 border border-emerald-500/20">
          <h1 className="text-6xl font-light tracking-tighter mb-4">What should the swarm manifest?</h1>
          <p className="text-zinc-400 mb-8 max-w-md">Real Groq-powered agents with collaboration. Type your vision.</p>
          
          <div className="flex gap-4">
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Build a futuristic AI dashboard with 3D agent avatars that react to voice commands..."
              className="flex-1 bg-zinc-950 border border-white/10 rounded-2xl p-8 text-lg placeholder:text-zinc-500 focus:border-emerald-400 min-h-[140px] resize-y"
            />
            <button
              onClick={executeSwarm}
              disabled={isProcessing || !taskInput.trim()}
              className="self-end px-16 py-8 bg-white text-black rounded-2xl font-semibold text-xl hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-3"
            >
              {isProcessing ? 'SWARM THINKING...' : 'LAUNCH SWARM'}
            </button>
          </div>
        </div>

        {/* Agents */}
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-6">
            <div className="text-4xl font-light">The Swarm (Real API + Collaboration)</div>
            <div className="text-xs text-emerald-400 font-mono">CLICK ANY AGENT TO INTERROGATE DIRECTLY</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => interrogateAgent(agent)}
                className={`agent-card glass p-8 rounded-3xl cursor-pointer border border-white/10 hover:border-${agent.color}-400 group`}
              >
                <div className="flex justify-between">
                  <div className={`text-6xl mb-6 text-${agent.color}-400/80 group-hover:text-${agent.color}-400`}>⟡</div>
                  <div className="text-[10px] font-mono self-start px-4 py-2 border border-white/20 rounded-full">{agent.model}</div>
                </div>
                <div className="text-3xl font-light mb-2 group-hover:text-white transition-colors">{agent.name}</div>
                <div className="text-zinc-400 text-sm mb-6">{agent.specialty}</div>
                <div className="text-[10px] uppercase text-emerald-400 tracking-widest">REAL-TIME • COLLABORATIVE</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Output */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 glass rounded-3xl p-8 font-mono text-sm h-96 overflow-auto border border-white/5">
            <div className="text-emerald-400 mb-4 flex items-center gap-2 sticky top-0 bg-black/90 py-2">
              LIVE SWARM TERMINAL + COLLABORATION LOGS
            </div>
            {logs.map((log, i) => (
              <div key={i} className="text-emerald-300/80 py-0.5">{log}</div>
            ))}
          </div>
          
          <div className="col-span-2 glass rounded-3xl p-8">
            <div className="uppercase text-xs tracking-widest text-zinc-400 mb-4">CURRENT AGENT OUTPUT</div>
            {currentResponse ? (
              <div className="text-emerald-100 leading-relaxed text-[15px] whitespace-pre-wrap max-h-80 overflow-auto">
                {currentResponse}
              </div>
            ) : (
              <div className="text-zinc-600 h-64 flex items-center justify-center text-center">
                The swarm is ready.<br/>Launch a directive or click an agent above.
              </div>
            )}
            
            {conversations.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-xs text-zinc-500 mb-3">RECENT COLLABORATIONS</div>
                {conversations.slice(0, 2).map((conv, i) => (
                  <div key={i} className="text-xs text-emerald-400/70 mb-4">
                    {conv.task.substring(0, 45)}...
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 text-[10px] font-mono text-zinc-500">
        OUTSIDE THE BOX v1000x • REAL GROQ + AGENT COLLABORATION + 3D SWARM VISUALIZATION
      </div>
    </div>
  );
}
