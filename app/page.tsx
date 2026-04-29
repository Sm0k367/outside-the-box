'use client';

import React, { useState, useEffect } from 'react';

const agents = [
  { id: 1, slug: 'web-frontend', name: 'WEB FRONTEND', specialty: 'UI/UX • React • Motion • Tailwind', color: 'emerald', status: 'online' },
  { id: 2, slug: 'media-image', name: 'MEDIA IMAGE', specialty: 'Replicate • Visual Synthesis • Generation', color: 'violet', status: 'online' },
  { id: 3, slug: 'reasoning-research', name: 'REASONING CORE', specialty: 'Deep Research • Strategy • Groq Llama 3.1 70B', color: 'cyan', status: 'online' },
  { id: 4, slug: 'github-agent', name: 'GITHUB NEXUS', specialty: 'Repository • Automation • Deployment', color: 'amber', status: 'online' },
  { id: 5, slug: 'web-fullstack', name: 'FULLSTACK ORCHESTRATOR', specialty: 'Architecture • Integration • Systems', color: 'rose', status: 'online' },
  { id: 6, slug: 'media-video-audio', name: 'MEDIA STUDIO', specialty: 'Animation • Audio • Multimedia', color: 'fuchsia', status: 'online' },
];

export default function OutsideTheBox() {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([
    '> Swarm core online',
    '> Connected to Groq Llama 3.1 70B + Mixtral',
    '> All 9 agents synchronized and ready',
    '> Awaiting command...'
  ]);
  const [activeAgents, setActiveAgents] = useState([1, 3, 5]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentResponse, setAgentResponse] = useState('');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `> ${message}`]);
  };

  const executeSwarm = async () => {
    if (!taskInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    addLog(`RECEIVED DIRECTIVE: ${taskInput}`);
    
    // Simulate swarm thinking with real agent feel
    setTimeout(() => addLog('Routing to specialized agents...'), 400);
    setTimeout(() => addLog('Reasoning Core analyzing objective with Llama 3.1 70B...'), 900);
    setTimeout(() => addLog('Web Frontend + Fullstack initiating parallel construction...'), 1400);
    setTimeout(() => addLog('Media agents synthesizing visual assets...'), 1900);
    
    setTimeout(() => {
      addLog('SWARM EXECUTION COMPLETE — EXCELLENCE ACHIEVED');
      setAgentResponse(`The swarm has processed your directive: "${taskInput}".\n\nWeb Frontend Agent recommends a glassmorphic interface with neon accents.\nReasoning Core suggests multi-agent collaboration with Groq Llama 3.1 70B for research and Fullstack for implementation.\n\nAll agents are now fully operational.`);
      setTaskInput('');
      setIsProcessing(false);
    }, 2800);
  };

  const toggleAgent = (id: number) => {
    if (activeAgents.includes(id)) {
      setActiveAgents(activeAgents.filter(a => a !== id));
    } else {
      setActiveAgents([...activeAgents, id]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Grid + Neon Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#22ff88_0.8px,transparent_1px)] bg-[length:30px_30px] opacity-10"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-6xl font-light tracking-[-4px] text-emerald-400">OUTSIDE</div>
            <div className="text-6xl font-light tracking-[-4px] bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">THE BOX</div>
          </div>
          
          <div className="flex items-center gap-8 text-sm uppercase tracking-[3px]">
            <div className="px-6 py-3 border border-emerald-500/50 text-emerald-400 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              GROQ LIVE
            </div>
            <div className="text-emerald-400/70">6 AGENTS ONLINE • SWARM SYNCED</div>
          </div>
        </div>
      </header>

      <main className="pt-28 max-w-screen-2xl mx-auto px-12 pb-20">
        {/* Command Center */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-3xl mb-6">
            <span className="text-emerald-400">⟡</span>
            <span className="uppercase tracking-[4px] text-sm">COMMAND NEXUS</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-light leading-none mb-6 tracking-tighter">
            What should the<br />swarm build for you?
          </h1>
          
          <div className="relative max-w-4xl">
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Describe your vision with maximum ambition... (e.g. 'Build a cyberpunk 3D portfolio with agent avatars that react in real time')"
              className="w-full h-48 bg-zinc-950 border border-white/10 rounded-3xl p-10 text-xl placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={executeSwarm}
              disabled={isProcessing || !taskInput.trim()}
              className="absolute bottom-8 right-8 px-16 py-6 bg-white hover:bg-emerald-400 hover:text-black transition-all text-black font-medium rounded-2xl text-lg disabled:opacity-40 flex items-center gap-3"
            >
              {isProcessing ? 'SWARM THINKING...' : 'LAUNCH SWARM'}
              <span className="text-xl">⟶</span>
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="uppercase text-xs tracking-[3px] text-emerald-400 mb-1">ACTIVE INTELLIGENCE</div>
              <div className="text-5xl font-light">The Swarm</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-sm">ALL AGENTS USING BEST-IN-CLASS GROQ MODELS</div>
              <div className="text-xs text-zinc-500">Llama 3.1 70B • Mixtral • Gemma2</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`group relative border border-white/10 hover:border-emerald-500/50 bg-zinc-950/50 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 cursor-pointer overflow-hidden ${activeAgents.includes(agent.id) ? 'ring-1 ring-emerald-400' : ''}`}
              >
                <div className={`absolute top-6 right-6 text-xs uppercase tracking-widest px-4 py-1 rounded-full border ${agent.color === 'emerald' ? 'border-emerald-400 text-emerald-400' : agent.color === 'violet' ? 'border-violet-400 text-violet-400' : 'border-cyan-400 text-cyan-400'}`}>
                  {agent.status}
                </div>
                
                <div className="text-7xl mb-6 text-emerald-400/70 group-hover:text-emerald-400 transition-colors">⟡</div>
                
                <div className="text-3xl font-light mb-3 text-white group-hover:text-emerald-300 transition-colors">
                  {agent.name}
                </div>
                <div className="text-zinc-400 text-[15px] leading-tight mb-8">
                  {agent.specialty}
                </div>
                
                <div className="text-[10px] uppercase tracking-widest text-emerald-500/70 pt-6 border-t border-white/10">
                  GROQ POWERED • ALWAYS ON
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal + Response */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-zinc-950 border border-white/10 rounded-3xl p-8 font-mono text-sm h-[420px] overflow-auto">
            <div className="text-emerald-400 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              SWARM TERMINAL
            </div>
            {logs.map((log, index) => (
              <div key={index} className="text-emerald-300/90 mb-1.5">{log}</div>
            ))}
          </div>
          
          <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-3xl p-8">
            <div className="uppercase text-xs tracking-widest text-zinc-500 mb-6">AGENT RESPONSE</div>
            {agentResponse ? (
              <div className="text-emerald-100 leading-relaxed whitespace-pre-wrap text-[15px]">
                {agentResponse}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-center">
                Execute a directive above.<br />Watch the swarm respond in real time.
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 text-xs text-zinc-500 font-mono">
        OUTSIDE THE BOX v1000x • ALL AGENTS ALIVE
      </div>
    </div>
  );
}
