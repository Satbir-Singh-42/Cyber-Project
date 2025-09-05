import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { PasswordService } from "./services/password-service";
import { PhishingService } from "./services/phishing-service";
import { PortService } from "./services/port-service";
import { KeyloggerService } from "./services/keylogger-service";
import { FileIntegrityService } from "./services/file-integrity-service";
import { 
  passwordAnalysisRequestSchema,
  phishingAnalysisRequestSchema,
  portScanRequestSchema,
  fileMonitorRequestSchema,
  signupRequestSchema
} from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  const passwordService = new PasswordService();
  const phishingService = new PhishingService();
  const portService = new PortService();
  const keyloggerService = new KeyloggerService();
  const fileIntegrityService = new FileIntegrityService();

  // User Registration
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = signupRequestSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Use email as username for simplicity
      const existingUserByUsername = await storage.getUserByUsername(email);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await storage.createUser({
        username: email, // Using email as username
        email,
        name,
        password: hashedPassword,
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ 
        message: "Account created successfully", 
        user: userWithoutPassword 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Password Analysis - Works for both guest and authenticated users
  app.post("/api/security/password-analysis", async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      const analysis = passwordService.analyzePassword(password);
      
      // Store result only if user is authenticated
      // For guests, just return the analysis without storing
      try {
        await storage.createScanResult({
          type: 'password',
          target: 'password-analysis',
          result: JSON.stringify(analysis),
          score: analysis.score
        });
      } catch (dbError) {
        // If database fails, still return analysis for guest mode
        console.log('Database storage failed, continuing in guest mode');
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Phishing URL Detection
  app.post("/api/security/phishing-analysis", async (req, res) => {
    try {
      const { url } = phishingAnalysisRequestSchema.parse(req.body);
      const analysis = phishingService.analyzeUrl(url);
      
      // Store result
      await storage.createScanResult({
        type: 'phishing',
        target: url,
        result: JSON.stringify(analysis),
        score: analysis.score
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Port Scanning
  app.post("/api/security/port-scan", async (req, res) => {
    try {
      const { target, portRange } = portScanRequestSchema.parse(req.body);
      const result = await portService.scanPorts(target, portRange);
      
      // Store result
      await storage.createScanResult({
        type: 'port',
        target,
        result: JSON.stringify(result),
        score: result.openPorts.length
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Quick port scan for common ports
  app.post("/api/security/port-scan-quick", async (req, res) => {
    try {
      const { target } = req.body;
      if (!target) {
        return res.status(400).json({ message: "Target is required" });
      }
      
      const result = await portService.quickScan(target);
      
      // Store result
      await storage.createScanResult({
        type: 'port',
        target,
        result: JSON.stringify(result),
        score: result.openPorts.length
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Keylogger Detection
  app.post("/api/security/keylogger-scan", async (req, res) => {
    try {
      const result = await keyloggerService.detectKeyloggers();
      
      // Store result
      await storage.createScanResult({
        type: 'keylogger',
        target: 'system-scan',
        result: JSON.stringify(result),
        score: result.suspiciousProcesses.length
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Terminate suspicious process
  app.post("/api/security/terminate-process", async (req, res) => {
    try {
      const { pid } = req.body;
      if (!pid) {
        return res.status(400).json({ message: "Process ID is required" });
      }
      
      const success = await keyloggerService.terminateProcess(parseInt(pid));
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // File Integrity Monitoring
  app.post("/api/security/file-integrity-init", async (req, res) => {
    try {
      const { directory, recursive } = fileMonitorRequestSchema.parse(req.body);
      await fileIntegrityService.initializeBaseline(directory, recursive);
      
      const baselineInfo = fileIntegrityService.getBaselineInfo();
      res.json({ 
        message: "Baseline initialized successfully",
        ...baselineInfo
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/security/file-integrity-check", async (req, res) => {
    try {
      const { directory, recursive } = fileMonitorRequestSchema.parse(req.body);
      const result = await fileIntegrityService.checkIntegrity(directory, recursive);
      
      // Store result
      await storage.createScanResult({
        type: 'file_integrity',
        target: directory,
        result: JSON.stringify(result),
        score: result.changes.length
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/security/file-integrity-update", async (req, res) => {
    try {
      const { directory, recursive } = fileMonitorRequestSchema.parse(req.body);
      await fileIntegrityService.updateBaseline(directory, recursive);
      
      const baselineInfo = fileIntegrityService.getBaselineInfo();
      res.json({ 
        message: "Baseline updated successfully",
        ...baselineInfo
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get scan history - Returns empty array for guests, full history for authenticated users
  app.get("/api/security/scan-history", async (req, res) => {
    try {
      const { type } = req.query;
      const results = await storage.getScanResults(type as string);
      res.json(results);
    } catch (error: any) {
      // Return empty array for guest mode if database fails
      console.log('Database query failed, returning empty results for guest mode');
      res.json([]);
    }
  });

  // Export security report
  app.get("/api/security/export-report", async (req, res) => {
    try {
      const results = await storage.getScanResults();
      const report = {
        timestamp: new Date(),
        totalScans: results.length,
        scansByType: results.reduce((acc, result) => {
          acc[result.type] = (acc[result.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentScans: results.slice(0, 50)
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=cybersec-report.json');
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
