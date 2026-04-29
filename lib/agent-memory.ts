// Simple persistent memory for agents (saved to disk)
import { promises as fs } from 'fs';
import path from 'path';

const MEMORY_DIR = path.join(process.cwd(), '.swarm-memory');

async function ensureMemoryDir() {
  try {
    await fs.mkdir(MEMORY_DIR, { recursive: true });
  } catch (e) {}
}

async function getAgentMemory(agentSlug: string) {
  await ensureMemoryDir();
  const memoryPath = path.join(MEMORY_DIR, `${agentSlug}.json`);
  try {
    const data = await fs.readFile(memoryPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { history: [], lastActive: new Date().toISOString() };
  }
}

async function saveAgentMemory(agentSlug: string, memory: any) {
  await ensureMemoryDir();
  const memoryPath = path.join(MEMORY_DIR, `${agentSlug}.json`);
  await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2));
}

// Add to availableTools in route.ts (we'll update the main file next)
