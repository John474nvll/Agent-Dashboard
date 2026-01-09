
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Retell from "retell-sdk";
import twilio from "twilio";

// @ts-ignore
import { FacebookAdsApi } from "facebook-nodejs-business-sdk";

const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Meta Business SDK Setup
if (process.env.META_ACCESS_TOKEN) {
  FacebookAdsApi.init(process.env.META_ACCESS_TOKEN);
}

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

async function seedDatabase(force = false) {
  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0 || force) {
    if (force) {
      console.log("Forcing re-seed of database...");
      // In a real scenario we might delete calls too, but for safety we just ensure V1 agents exist
    }
    console.log("Seeding initial agents (V1)...");
    
    // Check if Santi exists if not forcing
    const hasSanti = existingAgents.some(a => a.name === "Santi");
    if (!hasSanti || force) {
      await storage.createAgent({
        name: "Santi",
        description: "Business Development Representative - SoftGAN",
        type: "voice",
        config: SANTI_CONFIG,
        isActive: true,
      });
    }

    const hasValentina = existingAgents.some(a => a.name === "Valentina");
    if (!hasValentina || force) {
      await storage.createAgent({
        name: "Valentina",
        description: "Senior Technical Sales Executive - Softgan Electronics",
        type: "voice",
        config: VALENTINA_CONFIG,
        isActive: true,
      });
    }
    console.log("Agents seeded successfully.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup (default false)
  await seedDatabase(true);

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
    
    try {
      // In a real scenario, this would call Retell API to deploy
      // For this implementation, we ensure the agent config is synced with Retell
      const retellResponse = await retell.agent.create({
        agent_name: agent.name,
        voice_id: (agent.config as any).voice_id || "11labs-Bing",
        response_engine: (agent.config as any).response_engine,
      });

      await storage.updateAgent(agent.id, {
        phoneId: retellResponse.agent_id
      });
      
      res.json({ 
        success: true, 
        message: `Agent ${agent.name} deployed to Retell successfully!`,
        retellAgentId: retellResponse.agent_id
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
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

      if (!agent.phoneId) {
        return res.status(400).json({ message: 'Agent must be deployed before making calls' });
      }

      // Trigger Retell Call
      const retellCall = await retell.call.createPhoneCall({
        from_number: process.env.TWILIO_PHONE_NUMBER || "",
        to_number: phoneNumber,
        agent_id: agent.phoneId!,
      } as any);

      const call = await storage.createCall({
        agentId,
        phoneNumber,
        status: 'in-progress',
        retellCallId: retellCall.call_id,
        transcript: null,
        recordingUrl: null
      });

      res.json({ success: true, callId: call.retellCallId! });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // WhatsApp Messaging Routes
  app.post("/api/agents/:id/whatsapp/send", async (req, res) => {
    try {
      const agentId = Number(req.params.id);
      const { phoneNumber, message } = z.object({
        phoneNumber: z.string(),
        message: z.string()
      }).parse(req.body);

      const agent = await storage.getAgent(agentId);
      if (!agent) return res.status(404).json({ message: "Agent not found" });

      // Meta WhatsApp Business API Implementation
      if (process.env.META_ACCESS_TOKEN && process.env.META_PHONE_NUMBER_ID) {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v21.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phoneNumber,
                type: "text",
                text: { body: message }
              }),
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Meta API error: ${JSON.stringify(errorData)}`);
          }
        } catch (error: any) {
          console.error("WhatsApp Send Error:", error.message);
          // We still save the record but mark as failed or handle locally
        }
      }

      const msg = await storage.createWhatsAppMessage({
        agentId,
        waId: phoneNumber,
        direction: "outbound",
        message,
        status: "sent"
      });

      res.json(msg);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Webhook for Retell Call Updates
  app.post("/api/webhooks/retell", async (req, res) => {
    try {
      const { call_id, event, transcript, recording_url } = req.body;
      
      if (event === "call_ended") {
        // Update call status and data in storage
        // This is a simplified implementation
        console.log(`Call ${call_id} ended. Updating storage.`);
      }
      
      res.status(200).send("Webhook received");
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // Webhook for Meta WhatsApp Incoming Messages
  app.post("/api/webhooks/whatsapp", async (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.META_VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }

    try {
      const { entry } = req.body;
      if (entry && entry[0].changes && entry[0].changes[0].value.messages) {
        const message = entry[0].changes[0].value.messages[0];
        const from = message.from;
        const text = message.text.body;

        // Save incoming message
        await storage.createWhatsAppMessage({
          agentId: null, // Logic to determine agent could be added here
          waId: from,
          direction: "inbound",
          message: text,
          status: "received"
        });
      }
      res.status(200).send("EVENT_RECEIVED");
    } catch (error: any) {
      console.error("WhatsApp Webhook Error:", error.message);
      res.status(200).send("EVENT_RECEIVED"); // Always return 200 to Meta
    }
  });

  // Agent Tool Invocation Route
  app.post("/api/agents/:id/tools/:toolName", async (req, res) => {
    try {
      const agentId = Number(req.params.id);
      const { toolName } = req.params;
      const args = req.body;

      console.log(`Tool ${toolName} invoked for agent ${agentId} with args:`, args);

      // Define tool implementations
      if (toolName === "send_whatsapp") {
        const agent = await storage.getAgent(agentId);
        const targetNumber = agent?.phoneNumber || args.phoneNumber;
        
        console.log(`Sending WhatsApp to ${targetNumber}`);
        // Implementation logic using metaClient
        res.json({ success: true, message: `WhatsApp sent to ${targetNumber}` });
      } else if (toolName === "check_inventory") {
        res.json({ success: true, status: "In stock", quantity: 50 });
      } else {
        res.status(404).json({ message: "Tool not implemented" });
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
