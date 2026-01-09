import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Agents API
  app.get(api.agents.list.path, async (req, res) => {
    const agents = await storage.getAgents();
    res.json(agents);
  });

  app.get(api.agents.get.path, async (req, res) => {
    const agent = await storage.getAgent(Number(req.params.id));
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  });

  app.post(api.agents.create.path, async (req, res) => {
    try {
      const input = api.agents.create.input.parse(req.body);
      const agent = await storage.createAgent(input);
      res.status(201).json(agent);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.agents.update.path, async (req, res) => {
    try {
      const input = api.agents.update.input.parse(req.body);
      const agent = await storage.updateAgent(Number(req.params.id), input);
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
      res.json(agent);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.agents.delete.path, async (req, res) => {
    await storage.deleteAgent(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.agents.deploy.path, async (req, res) => {
    const agent = await storage.getAgent(Number(req.params.id));
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    
    // Select Retell Agent ID based on agent name or fallback
    const retellAgentId = agent.name.includes("Valentina") 
      ? "agent_785d337996ff481d04460638ea" 
      : "agent_2def185f1b192cd18262586ad9";
      
    console.log(`Connecting agent ${agent.name} to Retell ID: ${retellAgentId}`);
    
    await storage.updateAgent(agent.id, { 
      agentId: retellAgentId,
      isDeployed: "true"
    });
    
    res.json({ success: true, agentId: retellAgentId });
  });

  app.post(api.agents.testCall.path, async (req, res) => {
    const agent = await storage.getAgent(Number(req.params.id));
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    
    // Fallback to specific IDs if not already set
    const fallbackId = agent.name.includes("Valentina")
      ? "agent_785d337996ff481d04460638ea"
      : "agent_2def185f1b192cd18262586ad9";

    const retellAgentId = agent.agentId || fallbackId;
    
    // Simulate starting a Retell web call with the specific Agent ID
    const mockCallId = `call_${Math.random().toString(36).substr(2, 9)}`;
    res.json({ 
      callId: mockCallId, 
      webUrl: `https://retellai.com/widget/${retellAgentId}` 
    });
  });

  // New endpoint for real agent text interaction using OpenAI
  app.post("/api/agents/:id/chat", async (req, res) => {
    const agent = await storage.getAgent(Number(req.params.id));
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const { message } = req.body;
    const config = agent.config as any;
    const prompt = config.retellLlmData?.general_prompt || "Eres un asistente de voz profesional.";

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message }
        ],
      });

      res.json({ response: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ message: "Error in AI generation" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0) {
    const agent1 = {
      agent_id: "",
      channel: "voice",
      last_modification_timestamp: 1767920240240,
      agent_name: "Santi - Sales Rep",
      version_description: "Identity: Santi, SoftGAN BDR.",
      response_engine: { type: "retell-llm", llm_id: "llm_2988aa7985cf70c3bc55b75e0f88", version: 1 },
      language: "es-ES",
      voice_id: "11labs-Bing",
      retellLlmData: {
        model: "gpt-4.1",
        general_prompt: "You are Santi, an elite Business Development Representative..."
      }
    };

    const agent2 = {
      agent_id: "",
      channel: "voice",
      last_modification_timestamp: 1767921557549,
      agent_name: "Valentina - Tech Sales",
      version_description: "Identity: Valentina, Softgan Electronics.",
      response_engine: { type: "retell-llm", llm_id: "llm_c6176d2fbb7dfe262258f0d6c423", version: 3 },
      language: "es-ES",
      voice_id: "11labs-Susan",
      retellLlmData: {
        model: "gpt-4.1",
        general_prompt: "You are Valentina, the Senior Technical Sales Executive..."
      }
    };

    await storage.createAgent({
      name: "Santi - Sales Rep",
      voiceId: "11labs-Bing",
      language: "es-ES",
      config: agent1,
    });

    await storage.createAgent({
      name: "Valentina - Tech Sales",
      voiceId: "11labs-Susan",
      language: "es-ES",
      config: agent2,
    });
    
    console.log("Database seeded with initial agents");
  }
}
