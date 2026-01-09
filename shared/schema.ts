import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  agentId: text("agent_id"), // Optional external ID
  voiceId: text("voice_id"),
  language: text("language"),
  config: jsonb("config").notNull(), // Stores the complete configuration object
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertAgentSchema = createInsertSchema(agents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type CreateAgentRequest = InsertAgent;
export type UpdateAgentRequest = Partial<InsertAgent>;

// API Response types
export type AgentResponse = Agent;
export type AgentsListResponse = Agent[];
