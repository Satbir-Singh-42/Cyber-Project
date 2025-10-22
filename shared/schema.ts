import { z } from "zod";

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

export type PasswordAnalysisRequest = z.infer<typeof passwordAnalysisRequestSchema>;
export type PhishingAnalysisRequest = z.infer<typeof phishingAnalysisRequestSchema>;
export type PortScanRequest = z.infer<typeof portScanRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
