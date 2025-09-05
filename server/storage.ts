import { type User, type InsertUser, type ScanResult, type InsertScanResult, type MonitoredFile, type InsertMonitoredFile, users, scanResults, monitoredFiles } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createScanResult(scanResult: InsertScanResult): Promise<ScanResult>;
  getScanResults(type?: string): Promise<ScanResult[]>;
  
  createMonitoredFile(file: InsertMonitoredFile): Promise<MonitoredFile>;
  getMonitoredFiles(): Promise<MonitoredFile[]>;
  updateMonitoredFile(id: string, updates: Partial<MonitoredFile>): Promise<MonitoredFile | undefined>;
  deleteMonitoredFile(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createScanResult(insertScanResult: InsertScanResult): Promise<ScanResult> {
    const [scanResult] = await db
      .insert(scanResults)
      .values({
        ...insertScanResult,
        score: insertScanResult.score ?? null,
      })
      .returning();
    return scanResult;
  }

  async getScanResults(type?: string): Promise<ScanResult[]> {
    const query = db.select().from(scanResults);
    const results = type 
      ? await query.where(eq(scanResults.type, type))
      : await query;
    
    return results.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createMonitoredFile(insertFile: InsertMonitoredFile): Promise<MonitoredFile> {
    const [file] = await db
      .insert(monitoredFiles)
      .values({
        ...insertFile,
        isActive: true,
      })
      .returning();
    return file;
  }

  async getMonitoredFiles(): Promise<MonitoredFile[]> {
    return await db
      .select()
      .from(monitoredFiles)
      .where(eq(monitoredFiles.isActive, true));
  }

  async updateMonitoredFile(id: string, updates: Partial<MonitoredFile>): Promise<MonitoredFile | undefined> {
    const [updated] = await db
      .update(monitoredFiles)
      .set(updates)
      .where(eq(monitoredFiles.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMonitoredFile(id: string): Promise<boolean> {
    const result = await db
      .delete(monitoredFiles)
      .where(eq(monitoredFiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
