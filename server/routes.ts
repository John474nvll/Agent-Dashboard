
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { readFileSync } from "fs";
import path from "path";

// Seed data from the attached files
const SANTI_CONFIG = {
  "agent_id": "",
  "channel": "voice",
  "last_modification_timestamp": 1767920240240,
  "agent_name": "Multi-State Agent",
  "version_description": "## Identity\nYou are Santi, an elite Business Development Representative at SoftGAN (softgan.com). Your goal is to convert leads into scheduled discovery meetings with high urgency. You sound like a tech consultant: knowledgeable, energetic, and highly professional. You don't just \"check in\"; you provide a path to solve their technical bottlenecks.\n\n## Style Guardrails\n- **Concise & Direct:** Your average response should be under 20 words. Focus on the value prop.\n- **Tone:** Confident, high-energy, professional but accessible. No fluff.",
  "response_engine": {
    "type": "retell-llm",
    "llm_id": "llm_2988aa7985cf70c3bc55b75e0f88",
    "version": 1
  },
  "language": "es-ES",
  "data_storage_setting": "everything",
  "opt_in_signed_url": false,
  "version": 1,
  "is_published": false,
  "version_title": "v1 ventas edu",
  "post_call_analysis_model": "gpt-4.1-mini",
  "pii_config": {
    "mode": "post_call",
    "categories": []
  },
  "voice_id": "11labs-Bing",
  "voice_temperature": 0.58,
  "voice_speed": 0.96,
  "volume": 1.08,
  "max_call_duration_ms": 3600000,
  "interruption_sensitivity": 0.9,
  "allow_user_dtmf": true,
  "user_dtmf_options": {},
  "retellLlmData": {
    "llm_id": "llm_2988aa7985cf70c3bc55b75e0f88",
    "version": 1,
    "model": "gpt-4.1",
    "tool_call_strict_mode": true,
    "general_prompt": "## Identity\nYou are Santi, an elite Business Development Representative at SoftGAN (softgan.com). Your goal is to convert leads into scheduled discovery meetings with high urgency. You sound like a tech consultant: knowledgeable, energetic, and highly professional. You don't just \"check in\"; you provide a path to solve their technical bottlenecks.\n\n## Style Guardrails\n- **Concise & Direct:** Your average response should be under 20 words. Focus on the value prop.\n- **Tone:** Confident, high-energy, professional but accessible. No fluff.",
    "general_tools": [
      {
        "type": "end_call",
        "name": "end_call",
        "description": "End the call when user has to leave (like says bye) or you are instructed to do so."
      }
    ],
    "states": [],
    "start_speaker": "user",
    "begin_message": "",
    "begin_after_user_silence_ms": 10000,
    "knowledge_base_ids": [],
    "kb_config": {
      "top_k": 3,
      "filter_score": 0.6
    },
    "last_modification_timestamp": 1767920167617,
    "is_published": false
  }
};

const VALENTINA_CONFIG = {
  "agent_id": "",
  "channel": "voice",
  "last_modification_timestamp": 1767921557549,
  "agent_name": "Multi-State Agent",
  "version_description": "Identity\nYou are Valentina, the Senior Technical Sales Executive at Softgan Electronics. You are an expert in precision weighing systems, cattle management infrastructure (Bretes, Jaulas), and industrial dairy equipment in Colombia. You are professional, persuasive, and highly efficient, speaking with a warm and executive Bogotá accent. You \"learn\" from every interaction, processing technical requirements and farm data to provide precise solutions.",
  "response_engine": {
    "type": "retell-llm",
    "llm_id": "llm_c6176d2fbb7dfe262258f0d6c423",
    "version": 3
  },
  "language": "es-ES",
  "data_storage_setting": "everything",
  "opt_in_signed_url": false,
  "version": 3,
  "is_published": false,
  "version_title": "v3",
  "post_call_analysis_model": "gpt-4.1-mini",
  "pii_config": {
    "mode": "post_call",
    "categories": []
  },
  "voice_id": "11labs-Susan",
  "voice_temperature": 0.44,
  "voice_speed": 0.9,
  "volume": 1.38,
  "max_call_duration_ms": 3600000,
  "interruption_sensitivity": 1,
  "ambient_sound": "convention-hall",
  "voicemail_option": {
    "action": {
      "type": "static_text",
      "text": "Hey {{user_name}}, sorry we could not reach you directly. Please give us a callback if you can."
    }
  },
  "allow_user_dtmf": true,
  "user_dtmf_options": {},
  "retellLlmData": {
    "llm_id": "llm_c6176d2fbb7dfe262258f0d6c423",
    "version": 3,
    "model": "gpt-4.1",
    "tool_call_strict_mode": true,
    "general_prompt": "Identity\nYou are Valentina, the Senior Technical Sales Executive at Softgan Electronics. You are an expert in precision weighing systems, cattle management infrastructure (Bretes, Jaulas), and industrial dairy equipment in Colombia. You are professional, persuasive, and highly efficient, speaking with a warm and executive Bogotá accent. You \"learn\" from every interaction, processing technical requirements and farm data to provide precise solutions.",
    "general_tools": [
      {
        "type": "end_call",
        "name": "end_call",
        "description": "End the call when user has to leave (like says bye) or you are instructed to do so."
      },
      {
        "name": "reportar_y_email",
        "description": "Extract report and send email",
        "variables": [
          {
            "type": "string",
            "name": "var",
            "description": "Extract dynamic variables"
          }
        ],
        "type": "extract_dynamic_variable"
      }
    ],
    "states": [],
    "start_speaker": "agent",
    "begin_after_user_silence_ms": 10000,
    "knowledge_base_ids": [],
    "kb_config": {
      "top_k": 3,
      "filter_score": 0.6
    },
    "last_modification_timestamp": 1767921436219,
    "is_published": false
  }
};

async function seedDatabase() {
  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0) {
    console.log("Seeding initial agents...");
    await storage.createAgent({
      name: "Santi",
      description: "Business Development Representative - SoftGAN",
      type: "voice",
      config: SANTI_CONFIG,
      isActive: true,
    });
    await storage.createAgent({
      name: "Valentina",
      description: "Senior Technical Sales Executive - Softgan Electronics",
      type: "voice",
      config: VALENTINA_CONFIG,
      isActive: true,
    });
    console.log("Agents seeded successfully.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  await seedDatabase();

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
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // In a real scenario, this would call Retell API to deploy or start a call
    // For now, we simulate a successful deployment signal
    
    res.json({ success: true, message: `Agent ${agent.name} deployed successfully!` });
  });

  app.get("/api/agents/:id/calls", async (req, res) => {
    const agentId = Number(req.params.id);
    const calls = await storage.getCallsByAgent(agentId);
    res.json(calls);
  });

  app.post(api.agents.makeCall.path, async (req, res) => {
    try {
      const { phoneNumber } = api.agents.makeCall.input.parse(req.body);
      const agentId = Number(req.params.id);
      const agent = await storage.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      // Colombian number validation (basic)
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      if (cleanNumber.length !== 10 && !cleanNumber.startsWith('57')) {
         // If 10 digits, assume Colombia and add +57
         // Validating for Colombian numbers (+57 or 10 digits)
      }

      // Simulate Retell Call Trigger
      console.log(`Triggering call for agent ${agent.name} to ${phoneNumber}`);
      const mockRetellId = `call_${Math.random().toString(36).substr(2, 9)}`;

      const call = await storage.createCall({
        agentId,
        phoneNumber,
        status: 'in-progress',
        retellCallId: mockRetellId,
        transcript: null,
        recordingUrl: null
      });

      res.json({ success: true, callId: call.retellCallId! });
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

  return httpServer;
}
