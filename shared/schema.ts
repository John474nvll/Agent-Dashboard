
import { pgTable, text, serial, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("voice"), 
  config: jsonb("config").notNull(), 
  isActive: boolean("is_active").default(false),
  phoneId: text("phone_id"), // Added for Retell/Twilio phone link
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").references(() => agents.id),
  phoneNumber: text("phone_number").notNull(),
  status: text("status").notNull(), // pending, in-progress, completed, failed
  retellCallId: text("retell_call_id"),
  transcript: text("transcript"),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;
