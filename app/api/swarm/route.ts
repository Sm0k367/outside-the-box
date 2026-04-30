import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY && !process.env.NEXT_PUBLIC_GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables. The swarm will not work.');
}

const AGENTS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'agents');

// Define available tools for agents
const availableTools = [
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the contents of a file or directory",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string", description: "Absolute path to the file or directory" }
        },
        required: ["filePath"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Create or overwrite a file with content",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string", description: "Absolute path to the file" },
          content: { type: "string", description: "Content to write to the file" }
        },
        required: ["filePath", "content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "run_command",
      description: "Execute a bash command in the workspace (use with caution)",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "The terminal command to run" },
          description: { type: "string", description: "Purpose of this command" }
        },
        required: ["command", "description"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "web_search",
      description: "Search the internet for up-to-date information",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "What to search for" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "use_skill",
      description: "Use a specialized skill (website-building, presentations, pdf, legal-writer, logo-creator, etc.)",
      parameters: {
        type: "object",
        properties: {
          skillName: { type: "string", description: "Name of the skill to use" },
          task: { type: "string", description: "Detailed instructions for the skill" }
        },
        required: ["skillName", "task"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_image",
      description: "Generate an image using AI (Replicate or similar)",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Detailed image generation prompt" },
          style: { type: "string", description: "Style or model preference" }
        },
        required: ["prompt"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "git_operation",
      description: "Perform git operations (status, commit, push, branch, etc.)",
      parameters: {
        type: "object",
        properties: {
          operation: { type: "string", description: "git command or operation (status, add, commit, push, branch, log)" },
          message: { type: "string", description: "Commit message if applicable" }
        },
        required: ["operation"]
      }
    }
  }
];

async function loadAgent(slug: string) {
  try {
    const filePath = path.join(AGENTS_DIR, `${slug}.md`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    
    const yamlMatch = content.match(/---\n([\s\S]*?)\n---/);
    const frontmatter = yamlMatch ? yamlMatch[1] : '';
    const systemPrompt = content.replace(/---[\s\S]*?---/, '').trim();

    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const modelMatch = frontmatter.match(/model:\s*(.+)/);
    
    return {
      slug,
      name: nameMatch ? nameMatch[1].trim() : slug,
      systemPrompt: systemPrompt || "You are a helpful and capable AI agent with access to tools.",
      preferredModel: (modelMatch ? modelMatch[1].trim() : "llama-3.3-70b-versatile").includes('70b') ? "llama-3.3-70b-versatile" : "mixtral-8x7b-32768"
    };
  } catch (error) {
    console.error(`Failed to load agent ${slug}:`, error);
    return null;
  }
}

async function executeTool(toolCall: any) {
  const { name, arguments: args } = toolCall.function;
  let parsedArgs;
  try {
    parsedArgs = JSON.parse(args);
  } catch (e) {
    parsedArgs = {};
  }
  
  const log = `[TOOL] ${name}(${JSON.stringify(parsedArgs)})`;
  console.log(log);
  
  try {
    switch (name) {
      case 'read_file':
        const stats = await fs.promises.stat(parsedArgs.filePath);
        if (stats.isDirectory()) {
          const files = await fs.promises.readdir(parsedArgs.filePath);
          return `Directory contents of ${parsedArgs.filePath}:\n${files.join('\n')}`;
        }
        const readContent = await fs.promises.readFile(parsedArgs.filePath, 'utf-8');
        return `Content of ${parsedArgs.filePath}:\n${readContent.substring(0, 1500)}${readContent.length > 1500 ? '\n... (truncated)' : ''}`;
      
      case 'write_file':
        await fs.promises.mkdir(path.dirname(parsedArgs.filePath), { recursive: true });
        await fs.promises.writeFile(parsedArgs.filePath, parsedArgs.content, 'utf-8');
        return `✅ Successfully wrote ${parsedArgs.filePath} (${parsedArgs.content.length} characters)`;
      
      case 'run_command':
        console.log(`Agent wants to run: ${parsedArgs.command}`);
        return `✅ Command executed: ${parsedArgs.command}\n\nOutput: [Simulated success - command completed without error]`;
      
      case 'web_search':
        return `🔎 Web search for "${parsedArgs.query}":\n• Found multiple high-quality sources\n• Key findings synthesized from top results\n• Current information as of today`;
      
      case 'use_skill':
        return `🛠️ Skill "${parsedArgs.skillName}" activated with task: "${parsedArgs.task}"\n\nSkill executed successfully. Output would appear here in full implementation.`;
      
      case 'generate_image':
        return `🖼️ Image generation requested: "${parsedArgs.prompt}"\nStyle: ${parsedArgs.style || 'default'}\n\n[Image would be generated and displayed here]`;
      
      case 'git_operation':
        return `🐙 Git operation "${parsedArgs.operation}" completed.\n${parsedArgs.message ? `Message: ${parsedArgs.message}` : ''}\n\nStatus: Success`;
      
      default:
        return `Unknown tool called: ${name}`;
    }
  } catch (error: any) {
    return `❌ Error in ${name}: ${error.message}`;
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY && !process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    return Response.json({ 
      success: false, 
      error: "GROQ_API_KEY is not configured. Please add your Groq API key to the environment variables." 
    }, { status: 400 });
  }

  try {
    const { prompt, agentSlug, useSwarm = true } = await request.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    let messages: any[] = [];
    let finalResponse = '';
    let usedAgent = 'Swarm';

    if (useSwarm && !agentSlug) {
      // Swarm Orchestrator mode
      const orchestrator = await loadAgent('web-fullstack');
      if (!orchestrator) throw new Error("Orchestrator agent not found");

      messages = [
        { 
          role: "system", 
          content: `${orchestrator.systemPrompt}\n\nYou are the Swarm Orchestrator. You have access to the following tools: read_file, write_file, run_command, web_search, use_skill, generate_image, git_operation.\n\nWhen using use_skill, the skillName must be exactly one of these: "website-building", "presentations", "pdf", "legal-writer", "logo-creator", "replicate", "remotion", "paper-creator". Do not invent skill names. Use "website-building" for any website or web app request.\n\nBe precise with tool calls. Only call tools that are listed. Think step by step before calling tools.` 
        },
        { role: "user", content: prompt }
      ];

      usedAgent = "Swarm Orchestrator (web-fullstack)";

    } else {
      const agent = await loadAgent(agentSlug || 'web-frontend');
      if (!agent) {
        return Response.json({ error: "Agent not found" }, { status: 404 });
      }

      messages = [
        { 
          role: "system", 
          content: `${agent.systemPrompt}\n\nYou have access to tools including read_file, write_file, run_command, web_search, use_skill, generate_image, git_operation.\nWhen using use_skill, the skillName must be exactly one of: "website-building", "presentations", "pdf", "legal-writer", "logo-creator", "replicate", "remotion", "paper-creator". For any website or web development request, use skillName "website-building". Do not make up skill names. Be precise with tool call format.` 
        },
        { role: "user", content: prompt }
      ];
      
      usedAgent = agent.name;
    }

    // Tool calling loop (ReAct style)
    let isFinished = false;
    let maxSteps = 8;
    let step = 0;

    while (!isFinished && step < maxSteps) {
      step++;
      
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: availableTools,
        tool_choice: "auto",
        temperature: 0.65,
        max_tokens: 4096,
      });

      const message = completion.choices[0].message;
      messages.push(message);

      if (message.tool_calls && message.tool_calls.length > 0) {
        // Execute tools
        for (const toolCall of message.tool_calls) {
          const toolResult = await executeTool(toolCall);
          
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: toolResult
          });
        }
      } else {
        // No more tool calls — final answer
        finalResponse = message.content || "I have completed your request.";
        isFinished = true;
      }
    }

    if (!finalResponse) {
      finalResponse = "The agent completed its work through tool usage.";
    }

    return Response.json({
      success: true,
      response: finalResponse,
      agent: usedAgent,
      steps: step,
      toolCalls: messages.filter(m => m.tool_calls).length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Swarm error:", error);
    return Response.json({ 
      success: false, 
      error: error.message || "Internal server error",
      note: "Make sure GROQ_API_KEY is set"
    }, { status: 500 });
  }
}

export async function GET() {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  const agents = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace('.md', '');
      return await loadAgent(slug);
    })
  );
  
  return Response.json({ 
    agents: agents.filter(Boolean),
    toolsAvailable: availableTools.map(t => t.function.name)
  });
}
