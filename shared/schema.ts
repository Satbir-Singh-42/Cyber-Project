import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for session persistence
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scanResults = pgTable("scan_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'password', 'phishing', 'port', 'keylogger'
  target: text("target").notNull(),
  result: text("result").notNull(), // JSON string
  score: integer("score"),
  userId: varchar("user_id"), // Optional - null for guest scans
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
  password: true,
});

export const signupRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const insertScanResultSchema = createInsertSchema(scanResults).pick({
  type: true,
  target: true,
  result: true,
  score: true,
  userId: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScanResult = typeof scanResults.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;

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

export type PasswordAnalysisRequest = z.infer<typeof passwordAnalysisRequestSchema>;
export type PhishingAnalysisRequest = z.infer<typeof phishingAnalysisRequestSchema>;
export type PortScanRequest = z.infer<typeof portScanRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
