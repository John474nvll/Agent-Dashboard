import { db } from "./db";
import { agents, calls, whatsAppMessages, type Agent, type InsertAgent, type Call, type InsertCall, type WhatsAppMessage, type InsertWhatsAppMessage } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent>;
  deleteAgent(id: number): Promise<void>;
  createCall(call: InsertCall): Promise<Call>;
  getCallsByAgent(agentId: number): Promise<Call[]>;
  createWhatsAppMessage(msg: InsertWhatsAppMessage): Promise<WhatsAppMessage>;
  getWhatsAppMessagesByAgent(agentId: number): Promise<WhatsAppMessage[]>;
}

export class DatabaseStorage implements IStorage {
  async getAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: number, updates: Partial<InsertAgent>): Promise<Agent> {
    const [updated] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return updated;
  }

  async deleteAgent(id: number): Promise<void> {
    await db.delete(agents).where(eq(agents.id, id));
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const [newCall] = await db.insert(calls).values(insertCall).returning();
    return newCall;
  }

  async getCallsByAgent(agentId: number): Promise<Call[]> {
    return await db.select().from(calls).where(eq(calls.agentId, agentId));
  }

  async createWhatsAppMessage(msg: InsertWhatsAppMessage): Promise<WhatsAppMessage> {
    const [inserted] = await db.insert(whatsAppMessages).values(msg).returning();
    return inserted;
  }

  async getWhatsAppMessagesByAgent(agentId: number): Promise<WhatsAppMessage[]> {
    return await db.select().from(whatsAppMessages).where(eq(whatsAppMessages.agentId, agentId));
  }
}

export const storage = new DatabaseStorage();
