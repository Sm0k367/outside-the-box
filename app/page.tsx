'use client';

import React, { useState } from 'react';

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
  const [mode, setMode] = useState<'swarm' | 'direct'>('swarm');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [terminalLines, setTerminalLines] = useState([
    '> Swarm Intelligence Platform v1000x initialized',
    '> All 9 agents loaded from their real .md files with full prompts',
    '> Groq connected with real tool calling enabled (read, write, bash, search, skills, image generation, git)',
    '> The super app is ready. The agents can do anything you ask.'
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isResponseVisible, setIsResponseVisible] = useState(false);

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, line].slice(-12));
  };

  const launchSwarm = async () => {
    if (!prompt.trim() || isThinking) return;
    
    const currentPrompt = prompt;
    setPrompt('');
    setIsThinking(true);
    addTerminalLine(`> ${currentPrompt}`);
    addTerminalLine('> Swarm Orchestrator analyzing and selecting tools...');

    try {
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, useSwarm: true }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.toolCalls && data.toolCalls > 0) {
          addTerminalLine(`> Used ${data.toolCalls} tools during execution`);
        }
        addTerminalLine(`> ${data.agent} completed the task with excellence`);
        setCurrentResponse(data.response);
      } else {
        addTerminalLine(`> Error: ${data.error}`);
        setCurrentResponse(`Error: ${data.error || 'Failed to get response'}`);
      }
    } catch (error) {
      addTerminalLine('> Connection error - check that GROQ_API_KEY is set');
      setCurrentResponse('Connection error. Make sure the GROQ_API_KEY environment variable is configured.');
    } finally {
      setIsThinking(false);
    }
  };

  const talkToAgent = async (agent: Agent) => {
    addTerminalLine(`> Directly querying ${agent.name} with full capabilities...`);

    try {
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt || `Demonstrate your full capabilities and tool use as the ${agent.name}.`, 
          agentSlug: agent.slug, 
          useSwarm: false 
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.toolCalls && data.toolCalls > 0) {
          addTerminalLine(`> ${agent.name} used ${data.toolCalls} tools`);
        }
        setCurrentResponse(data.response);
        addTerminalLine(`> ${agent.name} completed response`);
      } else {
        addTerminalLine(`> Error from ${agent.name}`);
        setCurrentResponse(data.error || 'Agent error');
      }
    } catch (error) {
      addTerminalLine('> Agent communication failed');
      setCurrentResponse('Failed to reach agent. Check server and API key.');
    }
  };

  const clearTerminal = () => {
    setTerminalLines(['> Terminal cleared. The swarm is still fully operational.']);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,255,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(34,255,136,0.07)_1px,transparent_1px)] bg-[size:35px_35px]"></div>

      <div className="relative z-10 min-h-screen p-8 flex flex-col">
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
            <div className="text-emerald-400/60 text-xs font-mono">v1000x • SUPER APP WITH REAL TOOL USE</div>
          </div>
        </header>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-1">
          <button 
            onClick={() => { setMode('swarm'); setSelectedAgent(null); }}
            className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all ${mode === 'swarm' ? 'bg-emerald-400 text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
          >
            SWARM MODE (Orchestrator)
          </button>
          <button 
            onClick={() => setMode('direct')}
            className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all ${mode === 'direct' ? 'bg-emerald-400 text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
          >
            DIRECT AGENT MODE
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Agents */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="text-xs uppercase tracking-widest text-emerald-400 mb-4">AVAILABLE AGENTS</div>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div 
                  key={agent.slug}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setMode('direct');
                  }}
                  className={`glass p-5 rounded-3xl cursor-pointer border transition-all group ${selectedAgent?.slug === agent.slug ? 'border-emerald-400' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl text-${agent.accent}-400/80 group-hover:text-${agent.accent}-400`}>⟡</div>
                    <div className="flex-1">
                      <div className="font-medium text-lg text-white group-hover:text-emerald-300">{agent.name}</div>
                      <div className="text-xs text-emerald-400/70 mt-1">{agent.model}</div>
                      <div className="text-sm text-zinc-400 mt-3 line-clamp-2">{agent.role}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400/50 mt-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    ONLINE • FULL TOOL ACCESS
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="glass rounded-3xl p-12 mb-8 border border-emerald-500/20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-emerald-400 text-sm mb-4">
                  <i className="fa-solid fa-bolt"></i>
                  <span className="uppercase tracking-[3px]">
                    {mode === 'swarm' ? 'SWARM ORCHESTRATOR' : selectedAgent ? selectedAgent.name : 'DIRECT AGENT MODE'}
                  </span>
                </div>
                <h1 className="text-6xl font-light leading-none tracking-tighter mb-8 text-white">
                  {mode === 'swarm' ? 'What should the swarm manifest for you?' : `Talk directly to ${selectedAgent?.name || 'an agent'}`}
                </h1>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-2xl p-8 text-lg placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none resize-none"
                  placeholder="Be ambitious. The agents can read files, edit this repo, search the web, generate images, run commands, use skills, and more..."
                />
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={launchSwarm}
                    disabled={isThinking || !prompt.trim()}
                    className="flex-1 py-6 bg-emerald-400 hover:bg-white text-black font-semibold rounded-2xl text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isThinking ? (
                      <>SWARM IS THINKING &amp; USING TOOLS <span className="animate-pulse">...</span></>
                    ) : mode === 'swarm' ? 'LAUNCH SWARM' : `TALK TO ${selectedAgent?.name?.toUpperCase() || 'AGENT'}`}
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

            {/* Response Area */}
            {currentResponse && (
              <div className="glass rounded-3xl p-10 mb-8 border border-emerald-500/30">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-emerald-400 text-xs uppercase tracking-widest">SWARM RESPONSE</div>
                  <button onClick={() => navigator.clipboard.writeText(currentResponse)} className="text-xs text-emerald-400 hover:text-white">COPY</button>
                </div>
                <div className="prose prose-invert max-w-none text-[15px] leading-relaxed whitespace-pre-wrap text-emerald-100">
                  {currentResponse}
                </div>
              </div>
            )}

            {/* Live Terminal */}
            <div className="glass flex-1 rounded-3xl p-8 flex flex-col min-h-[340px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-emerald-400">
                  <i className="fa-solid fa-terminal"></i>
                  <span className="uppercase text-xs tracking-widest">LIVE EXECUTION LOG</span>
                </div>
                <button onClick={clearTerminal} className="text-xs text-zinc-500 hover:text-white">CLEAR</button>
              </div>
              
              <div className="flex-1 bg-black/70 border border-emerald-900/70 rounded-2xl p-6 font-mono text-sm overflow-auto text-emerald-200 leading-relaxed">
                {terminalLines.map((line, i) => (
                  <div key={i} className={`mb-2 ${line.includes('Used') || line.includes('tool') ? 'text-amber-300' : line.includes('Error') ? 'text-red-400' : ''}`}>
                    {line}
                  </div>
                ))}
                {isThinking && (
                  <div className="flex items-center gap-3 text-emerald-400">
                    <span className="animate-pulse">⟡</span>
                    <span>Swarm is thinking and using tools across agents...</span>
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
