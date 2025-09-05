import { type User, type InsertUser, type ScanResult, type InsertScanResult, type MonitoredFile, type InsertMonitoredFile } from "@shared/schema";
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scanResults: Map<string, ScanResult>;
  private monitoredFiles: Map<string, MonitoredFile>;

  constructor() {
    this.users = new Map();
    this.scanResults = new Map();
    this.monitoredFiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createScanResult(insertScanResult: InsertScanResult): Promise<ScanResult> {
    const id = randomUUID();
    const scanResult: ScanResult = {
      ...insertScanResult,
      id,
      timestamp: new Date(),
    };
    this.scanResults.set(id, scanResult);
    return scanResult;
  }

  async getScanResults(type?: string): Promise<ScanResult[]> {
    const results = Array.from(this.scanResults.values());
    if (type) {
      return results.filter(result => result.type === type);
    }
    return results.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createMonitoredFile(insertFile: InsertMonitoredFile): Promise<MonitoredFile> {
    const id = randomUUID();
    const file: MonitoredFile = {
      ...insertFile,
      id,
      isActive: true,
    };
    this.monitoredFiles.set(id, file);
    return file;
  }

  async getMonitoredFiles(): Promise<MonitoredFile[]> {
    return Array.from(this.monitoredFiles.values()).filter(file => file.isActive);
  }

  async updateMonitoredFile(id: string, updates: Partial<MonitoredFile>): Promise<MonitoredFile | undefined> {
    const existing = this.monitoredFiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.monitoredFiles.set(id, updated);
    return updated;
  }

  async deleteMonitoredFile(id: string): Promise<boolean> {
    return this.monitoredFiles.delete(id);
  }
}

export const storage = new MemStorage();
