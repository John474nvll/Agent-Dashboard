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
  retellApiKey: text("retell_api_key"), // Secret API key for Retell
  isDeployed: text("is_deployed").default("false"), // Track deployment status
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  agentId: serial("agent_id").references(() => agents.id),
  type: text("type").notNull(), // 'call', 'deployment', 'update'
  status: text("status").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertAgentSchema = createInsertSchema(agents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true
});

// === EXPLICIT API CONTRACT TYPES ===
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type CreateAgentRequest = InsertAgent;
export type UpdateAgentRequest = Partial<InsertAgent>;

// API Response types
export type AgentResponse = Agent;
export type AgentsListResponse = Agent[];
export type ActivityLogsResponse = ActivityLog[];
