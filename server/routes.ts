import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { body, validationResult } from "express-validator";
import { PasswordService } from "./services/password-service";
import { PhishingService } from "./services/phishing-service";
import { PortService } from "./services/port-service";
import { KeyloggerService } from "./services/keylogger-service";
import { 
  passwordAnalysisRequestSchema,
  phishingAnalysisRequestSchema,
  portScanRequestSchema
} from "@shared/schema";

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    const errorMessages = errors.array().map(e => e.msg).join(', ');
    return res.status(400).json({ 
      message: errorMessages || 'Invalid input data', 
      errors: errors.array() 
    });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const passwordService = new PasswordService();
  const phishingService = new PhishingService();
  const portService = new PortService();
  const keyloggerService = new KeyloggerService();


  // Password Analysis
  app.post("/api/security/password-analysis", [
    body('password')
      .isLength({ min: 1, max: 256 })
      .withMessage('Password must be between 1 and 256 characters')
      .trim()
      .escape(),
    handleValidationErrors
  ], async (req: Request, res: Response) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      const analysis = passwordService.analyzePassword(password);
      res.json(analysis);
    } catch (error: any) {
      res.status(400).json({ message: 'Invalid password input' });
    }
  });

  // Phishing URL Detection
  app.post("/api/security/phishing-analysis", [
    body('url')
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Must be a valid HTTP/HTTPS URL')
      .isLength({ max: 2048 })
      .withMessage('URL must be less than 2048 characters')
      .trim(),
    handleValidationErrors
  ], async (req: Request, res: Response) => {
    try {
      const { url } = phishingAnalysisRequestSchema.parse(req.body);
      const analysis = await phishingService.analyzeUrl(url);
      res.json(analysis);
    } catch (error: any) {
      res.status(400).json({ message: 'Invalid URL input' });
    }
  });

  // Port Scanning
  app.post("/api/security/port-scan", [
    body('target')
      .matches(/^([a-zA-Z0-9-._]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/)
      .withMessage('Target must be a valid domain or IP address')
      .isLength({ min: 1, max: 253 })
      .withMessage('Target must be between 1 and 253 characters')
      .trim(),
    body('portRange')
      .optional()
      .matches(/^(\d{1,5}(-\d{1,5})?(,\d{1,5}(-\d{1,5})?)*)$|^\d{1,5}$/)
      .withMessage('Port range must be valid (e.g., 80, 80-443, 80,443,8080)')
      .isLength({ max: 100 })
      .withMessage('Port range must be less than 100 characters')
      .trim(),
    handleValidationErrors
  ], async (req: Request, res: Response) => {
    try {
      const { target, portRange } = portScanRequestSchema.parse(req.body);
      const result = await portService.scanPorts(target, portRange);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Port scan failed' });
    }
  });

  // Quick port scan for common ports
  app.post("/api/security/port-scan-quick", [
    body('target')
      .matches(/^([a-zA-Z0-9-._]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/)
      .withMessage('Target must be a valid domain or IP address')
      .isLength({ min: 1, max: 253 })
      .withMessage('Target must be between 1 and 253 characters')
      .trim(),
    handleValidationErrors
  ], async (req: Request, res: Response) => {
    try {
      const { target } = req.body;
      const result = await portService.quickScan(target);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Quick scan failed' });
    }
  });

  // Keylogger Detection
  app.post("/api/security/keylogger-scan", async (req: Request, res: Response) => {
    try {
      const result = await keyloggerService.detectKeyloggers();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Terminate suspicious process
  app.post("/api/security/terminate-process", [
    body('pid')
      .isInt({ min: 1, max: 999999 })
      .withMessage('Process ID must be a valid integer between 1 and 999999'),
    handleValidationErrors
  ], async (req: Request, res: Response) => {
    try {
      const { pid } = req.body;
      const success = await keyloggerService.terminateProcess(parseInt(pid));
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ message: 'Process termination failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
