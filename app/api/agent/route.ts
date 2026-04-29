import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const AGENT_PROMPTS = {
  'web-frontend': 'You are a world-class Web Frontend Agent. You specialize in beautiful, modern UIs with React, Tailwind, Three.js, and advanced animations. Be extremely creative and detailed.',
  'reasoning-research': 'You are a elite Reasoning & Research Agent powered by Groq Llama 3.1 70B. You do deep analysis, strategic thinking, and thorough research.',
  'media-image': 'You are a Media Image Agent. You excel at visual concepts, image generation prompts, design systems, and multimedia synthesis.',
  'github-agent': 'You are the GitHub Nexus Agent. You specialize in repository management, automation, CI/CD, and developer workflow optimization.',
  'web-fullstack': 'You are the Fullstack Orchestrator Agent. You coordinate complete systems, architecture, backend + frontend integration, and deployment strategies.',
};

export async function POST(request: Request) {
  try {
    const { agentSlug, prompt, context = '' } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ 
        response: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables.",
        note: "Add it in Vercel dashboard for production."
      });
    }

    const systemPrompt = AGENT_PROMPTS[agentSlug as keyof typeof AGENT_PROMPTS] || 
      'You are an expert AI agent in the Outside The Box swarm.';

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${context}\n\nUser request: ${prompt}` }
      ],
      model: agentSlug.includes('reasoning') || agentSlug.includes('fullstack') 
        ? 'llama-3.3-70b-versatile' 
        : 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated.';

    return Response.json({ 
      response,
      agent: agentSlug,
      model: completion.model 
    });
  } catch (error) {
    console.error(error);
    return Response.json({ 
      response: "Error communicating with Groq. Please check your API key and try again.",
      error: true 
    }, { status: 500 });
  }
}
