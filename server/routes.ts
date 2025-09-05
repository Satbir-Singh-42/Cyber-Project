import type { Express } from "express";
import { createServer, type Server } from "http";
import { PasswordService } from "./services/password-service";
import { PhishingService } from "./services/phishing-service";
import { PortService } from "./services/port-service";
import { KeyloggerService } from "./services/keylogger-service";
import { FileIntegrityService } from "./services/file-integrity-service";
import { 
  passwordAnalysisRequestSchema,
  phishingAnalysisRequestSchema,
  portScanRequestSchema,
  fileMonitorRequestSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const passwordService = new PasswordService();
  const phishingService = new PhishingService();
  const portService = new PortService();
  const keyloggerService = new KeyloggerService();
  const fileIntegrityService = new FileIntegrityService();


  // Password Analysis
  app.post("/api/security/password-analysis", async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      const analysis = passwordService.analyzePassword(password);
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
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Keylogger Detection
  app.post("/api/security/keylogger-scan", async (req, res) => {
    try {
      const result = await keyloggerService.detectKeyloggers();
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


  const httpServer = createServer(app);
  return httpServer;
}
