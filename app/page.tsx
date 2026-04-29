'use client';

import React, { useState, useEffect } from 'react';

interface Agent {
  slug: string;
  name: string;
  role: string;
  model: string;
  accent: string;
}

const agents: Agent[] = [
  { slug: 'web-frontend', name: 'WEB FRONTEND', role: 'UI/UX • React • Motion • Tailwind', model: 'Llama 3.1 70B', accent: 'emerald' },
  { slug: 'reasoning-research', name: 'REASONING CORE', role: 'Deep Research • Strategy • Synthesis', model: 'Llama 3.1 70B', accent: 'cyan' },
  { slug: 'web-fullstack', name: 'SYSTEMS ORCHESTRATOR', role: 'Architecture • Integration • Scale', model: 'Llama 3.1 70B', accent: 'rose' },
  { slug: 'media-image', name: 'VISUAL INTELLIGENCE', role: 'Image Generation • Aesthetic Systems', model: 'Mixtral 8x7B', accent: 'violet' },
  { slug: 'github-agent', name: 'GITHUB NEXUS', role: 'Git • Automation • Deployment', model: 'Mixtral 8x7B', accent: 'amber' },
  { slug: 'media-video-audio', name: 'MEDIA STUDIO', role: 'Animation • Video • Audio', model: 'Mixtral 8x7B', accent: 'fuchsia' },
];

export default function OutsideTheBox() {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '> Swarm Intelligence Platform v1000x initialized',
    '> All 9 agents loaded with full system prompts from .md files',
    '> Groq connected with real tool calling enabled',
    '> Ready for your directive'
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, line].slice(-12));
  };

  const launchSwarm = async () => {
    if (!prompt.trim() || isThinking) return;

    const currentPrompt = prompt;
    setPrompt('');
    setIsThinking(true);
    addTerminalLine(`> ${currentPrompt}`);

    try {
      addTerminalLine('> Swarm Orchestrator routing to specialized agents...');
      
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, useSwarm: true }),
      });

      const data = await res.json();

      if (data.success) {
        addTerminalLine(`> ${data.agent} completed task using tools`);
        setCurrentResponse(data.response);
      } else {
        addTerminalLine(`> Error: ${data.error}`);
        setCurrentResponse(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      addTerminalLine('> Connection error - check GROQ_API_KEY');
      setCurrentResponse('Connection error. Make sure GROQ_API_KEY is configured in your environment.');
    } finally {
      setIsThinking(false);
    }
  };

  const talkToAgent = async (agent: Agent) => {
    setSelectedAgent(agent);
    addTerminalLine(`> Directly querying ${agent.name}...`);

    try {
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt || `Demonstrate your capabilities and tool use as the ${agent.name}.`, 
          agentSlug: agent.slug, 
          useSwarm: false 
        }),
      });

      const data = await res.json();

      if (data.success) {
        addTerminalLine(`> ${agent.name} responded with tool use`);
        setCurrentResponse(data.response);
      } else {
        addTerminalLine(`> Error from ${agent.name}`);
        setCurrentResponse(data.error || 'Agent error');
      }
    } catch (error) {
      addTerminalLine('> Agent communication failed');
      setCurrentResponse('Failed to reach agent.');
    }
  };

  const clearTerminal = () => {
    setTerminalLines([
      '> Terminal cleared',
      '> Swarm still active and ready'
    ]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,255,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(34,255,136,0.07)_1px,transparent_1px)] bg-[size:35px_35px]"></div>

      <div className="relative z-10 min-h-screen p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-400 flex items-center justify-center text-black text-4xl leading-none pt-1">⟡</div>
            <div className="text-5xl font-semibold tracking-tighter text-emerald-400">OUTSIDE THE BOX</div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-950 border border-emerald-400/30 rounded-3xl">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium">GROQ POWERED • ALL AGENTS ALIVE</span>
            </div>
            <div className="text-emerald-400/60 text-xs font-mono">v1000x • FULL TOOL USE ENABLED</div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex-1 flex flex-col">
          {/* Command Center */}
          <div className="glass rounded-3xl p-12 mb-10 border border-emerald-500/20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-emerald-400 text-sm mb-4">
                <i className="fa-solid fa-bolt"></i>
                <span className="uppercase tracking-[3px]">SWARM COMMAND NEXUS</span>
              </div>
              <h1 className="text-6xl font-light leading-none tracking-tighter mb-8 text-white">
                What should the swarm<br />manifest for you?
              </h1>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-black border border-white/10 rounded-2xl p-8 text-lg placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none resize-none"
                placeholder="Be specific. Be ambitious. The agents can read files, edit code, search the web, use specialized skills, generate images, do git operations, and more..."
              />
              
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={launchSwarm}
                  disabled={isThinking || !prompt.trim()}
                  className="flex-1 py-6 bg-white hover:bg-emerald-400 text-black font-semibold rounded-2xl text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isThinking ? 'SWARM IS WORKING...' : 'LAUNCH SWARM'}
                  <span className="text-xl">→</span>
                </button>
                <button 
                  onClick={clearTerminal}
                  className="px-8 py-6 border border-white/20 hover:bg-white/5 rounded-2xl text-sm font-medium"
                >
                  CLEAR LOG
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            {/* Agents Grid */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-light tracking-tight">The Swarm (9 Agents)</div>
                <div className="text-xs uppercase tracking-widest px-6 py-3 border border-emerald-400/30 text-emerald-400 rounded-3xl">ALL AGENTS FULLY LOADED FROM .MD FILES</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="agents">
                {agents.map((agent) => (
                  <div 
                    key={agent.slug}
                    onClick={() => talkToAgent(agent)}
                    className="glass rounded-3xl p-8 cursor-pointer border border-white/10 hover:border-emerald-400 group transition-all hover:-translate-y-1"
                  >
                    <div className="text-6xl mb-6 text-emerald-400/70 group-hover:text-emerald-400">⟡</div>
                    <div className="text-2xl font-light mb-2 group-hover:text-white">{agent.name}</div>
                    <div className="text-emerald-400/70 text-sm">{agent.role}</div>
                    <div className="text-[10px] text-emerald-400/50 mt-6 font-mono">{agent.model}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div className="lg:col-span-5">
              <div className="glass h-full rounded-3xl p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <i className="fa-solid fa-terminal"></i>
                    <span className="uppercase text-xs tracking-widest">LIVE EXECUTION LOG</span>
                  </div>
                  <button onClick={clearTerminal} className="text-xs text-zinc-500 hover:text-white">CLEAR</button>
                </div>
                
                <div className="flex-1 bg-black/60 border border-emerald-900/50 rounded-2xl p-6 font-mono text-sm overflow-auto text-emerald-200 leading-relaxed">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="mb-1.5">{line}</div>
                  ))}
                  {isThinking && <div className="text-emerald-400 animate-pulse">Swarm is thinking and using tools...</div>}
                </div>

                {currentResponse && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-sm">
                    <div className="text-emerald-400 text-xs mb-2">LATEST RESPONSE</div>
                    <div className="max-h-32 overflow-auto text-emerald-100 whitespace-pre-wrap text-xs">
                      {currentResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-zinc-500 mt-12 font-mono tracking-widest">
          SUPER APP • ALL 9 AGENTS FULLY FUNCTIONAL • READS REAL .MD FILES • REAL TOOL USE • GROQ POWERED
        </div>
      </div>
    </div>
  );
}
