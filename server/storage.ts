import { db } from "./db";
import {
  agents,
  activityLogs,
  type Agent,
  type InsertAgent,
  type UpdateAgentRequest,
  type ActivityLog,
  type InsertActivityLog
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, updates: UpdateAgentRequest): Promise<Agent>;
  deleteAgent(id: number): Promise<void>;
  
  // Activity Logs
  getActivityLogs(agentId: number): Promise<ActivityLog[]>;
  createActivityLog(log: any): Promise<ActivityLog>;
}

export class DatabaseStorage implements IStorage {
  async getAgents(): Promise<Agent[]> {
    return await db.select().from(agents).orderBy(agents.id);
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: number, updates: UpdateAgentRequest): Promise<Agent> {
    const [updated] = await db
      .update(agents)
      .set(updates)
      .where(eq(agents.id, id))
      .returning();
    return updated;
  }

  async deleteAgent(id: number): Promise<void> {
    await db.delete(activityLogs).where(eq(activityLogs.agentId, id));
    await db.delete(agents).where(eq(agents.id, id));
  }

  async getActivityLogs(agentId: number): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).where(eq(activityLogs.agentId, agentId)).orderBy(desc(activityLogs.timestamp));
  }

  async createActivityLog(log: any): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp)).limit(10);
  }
}

export const storage = new DatabaseStorage();
