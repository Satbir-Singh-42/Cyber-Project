import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scanResults = pgTable("scan_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'password', 'phishing', 'port', 'keylogger', 'file_integrity'
  target: text("target").notNull(),
  result: text("result").notNull(), // JSON string
  score: integer("score"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const monitoredFiles = pgTable("monitored_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filePath: text("file_path").notNull(),
  hash: text("hash").notNull(),
  size: integer("size").notNull(),
  lastModified: timestamp("last_modified").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScanResultSchema = createInsertSchema(scanResults).pick({
  type: true,
  target: true,
  result: true,
  score: true,
});

export const insertMonitoredFileSchema = createInsertSchema(monitoredFiles).pick({
  filePath: true,
  hash: true,
  size: true,
  lastModified: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScanResult = typeof scanResults.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
export type MonitoredFile = typeof monitoredFiles.$inferSelect;
export type InsertMonitoredFile = z.infer<typeof insertMonitoredFileSchema>;

// API Request/Response schemas
export const passwordAnalysisRequestSchema = z.object({
  password: z.string().min(1),
});

export const phishingAnalysisRequestSchema = z.object({
  url: z.string().url(),
});

export const portScanRequestSchema = z.object({
  target: z.string().min(1),
  portRange: z.string().optional().default("1-1000"),
});

export const fileMonitorRequestSchema = z.object({
  directory: z.string().min(1),
  recursive: z.boolean().default(true),
});

export type PasswordAnalysisRequest = z.infer<typeof passwordAnalysisRequestSchema>;
export type PhishingAnalysisRequest = z.infer<typeof phishingAnalysisRequestSchema>;
export type PortScanRequest = z.infer<typeof portScanRequestSchema>;
export type FileMonitorRequest = z.infer<typeof fileMonitorRequestSchema>;
