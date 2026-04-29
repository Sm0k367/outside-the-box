'use client';
import React, { useState } from 'react';

const agents = [
  { id: 1, name: 'Web Frontend', specialty: 'UI/UX • React • Three.js • Tailwind' },
  { id: 2, name: 'Media Image', specialty: 'Replicate • Visual Synthesis' },
  { id: 3, name: 'Reasoning Research', specialty: 'Deep Analysis • Strategic Synthesis with Groq' },
  { id: 4, name: 'GitHub Nexus', specialty: 'Repository Management • Deployment' },
  { id: 5, name: 'Web Fullstack', specialty: 'Systems Architecture • Integration' },
  { id: 6, name: 'Media Video/Audio', specialty: 'Animation • Audio Production' },
];

export default function SwarmPlatform() {
  const [task, setTask] = useState('');
  const [logs, setLogs] = useState([
    'Swarm Intelligence Platform initialized.',
    'Groq Llama 3.1 70B connected.',
    'All agents synchronized.',
  ]);

  const runSwarm = () => {
    if (!task) return;
    setLogs(prev => [...prev, `Task: ${task}`]);
    setLogs(prev => [...prev, 'Groq analyzing with full swarm...']);
    setTimeout(() => {
      setLogs(prev => [...prev, 'Web Frontend: Designing refined interfaces.']);
      setLogs(prev => [...prev, 'Reasoning: Synthesizing strategic pathways.']);
      setLogs(prev => [...prev, 'Media: Generating sophisticated assets.']);
      setLogs(prev => [...prev, 'Swarm execution completed with excellence.']);
    }, 800);
    setTask('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="text-5xl font-light tracking-tight">swarm</div>
          <div className="text-emerald-400 text-sm px-8 py-4 border border-emerald-400 rounded-3xl">INTELLIGENCE PLATFORM</div>
        </div>

        <div className="glass rounded-3xl p-16 mb-12">
          <h1 className="text-6xl font-light text-white mb-8">Orchestrate the swarm.</h1>
          <textarea 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe the objective for the swarm to execute..."
            className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-2xl p-8 text-lg placeholder:text-zinc-500 focus:outline-none"
          />
          <button onClick={runSwarm} className="mt-8 px-16 py-5 bg-white text-black rounded-2xl text-lg font-medium">EXECUTE SWARM</button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {agents.map(agent => (
            <div key={agent.id} className="glass p-10 rounded-3xl">
              <div className="text-6xl mb-8 text-emerald-400">⟡</div>
              <div className="text-3xl text-white mb-4">{agent.name}</div>
              <div className="text-emerald-400 text-sm">{agent.specialty}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 glass p-10 rounded-3xl text-sm font-mono h-80 overflow-auto">
          {logs.map((log, i) => <div key={i} className="mb-2">{log}</div>)}
        </div>
      </div>
    </div>
  );
}
