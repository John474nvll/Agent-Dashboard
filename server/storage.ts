import { prisma } from "./db";
import { type Agent, type InsertAgent, type Call, type InsertCall, type WhatsAppMessage, type InsertWhatsAppMessage } from "@shared/schema";

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
    return await prisma.agents.findMany() as unknown as Agent[];
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const agent = await prisma.agents.findUnique({ where: { id } });
    return (agent || undefined) as unknown as Agent;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const agent = await prisma.agents.create({ 
      data: insertAgent as any 
    });
    return agent as unknown as Agent;
  }

  async updateAgent(id: number, updates: Partial<InsertAgent>): Promise<Agent> {
    const updated = await prisma.agents.update({
      where: { id },
      data: { ...updates, updatedAt: new Date() } as any,
    });
    return updated as unknown as Agent;
  }

  async deleteAgent(id: number): Promise<void> {
    await prisma.agents.delete({ where: { id } });
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const newCall = await prisma.calls.create({
      data: insertCall as any
    });
    return newCall as unknown as Call;
  }

  async getCallsByAgent(agentId: number): Promise<Call[]> {
    return await prisma.calls.findMany({
      where: { agentId }
    }) as unknown as Call[];
  }

  async createWhatsAppMessage(msg: InsertWhatsAppMessage): Promise<WhatsAppMessage> {
    const inserted = await prisma.whatsapp_messages.create({
      data: msg as any
    });
    return inserted as unknown as WhatsAppMessage;
  }

  async getWhatsAppMessagesByAgent(agentId: number): Promise<WhatsAppMessage[]> {
    return await prisma.whatsapp_messages.findMany({
      where: { agentId }
    }) as unknown as WhatsAppMessage[];
  }
}

export const storage = new DatabaseStorage();
