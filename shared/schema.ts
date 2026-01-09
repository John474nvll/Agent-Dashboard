import { pgTable, text, serial, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("voice"), 
  config: jsonb("config").notNull(), 
  isActive: boolean("is_active").default(false),
  phoneId: text("phone_id"),
  phoneNumber: text("phone_number"), // Admin's personal phone for this agent
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

export const whatsAppMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").references(() => agents.id),
  waId: text("wa_id").notNull(), // WhatsApp Business ID for the contact
  direction: text("direction").notNull(), // inbound, outbound
  message: text("message").notNull(),
  status: text("status"), // sent, delivered, read
  timestamp: timestamp("timestamp").defaultNow(),
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

export const insertWhatsAppMessageSchema = createInsertSchema(whatsAppMessages).omit({
  id: true,
  timestamp: true
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;
export type WhatsAppMessage = typeof whatsAppMessages.$inferSelect;
export type InsertWhatsAppMessage = z.infer<typeof insertWhatsAppMessageSchema>;
