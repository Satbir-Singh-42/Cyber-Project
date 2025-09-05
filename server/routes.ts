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
  signupRequestSchema,
  loginRequestSchema
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

      // Create session automatically after signup
      (req.session as any).userId = newUser.id;
      (req.session as any).user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
      };

      console.log('SIGNUP: Session created:', req.sessionID);
      console.log('SIGNUP: User set in session:', (req.session as any).user);

      // Force session save and regenerate session ID for security
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regenerate error:', err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        
        // Set user data in the new session
        (req.session as any).userId = newUser.id;
        (req.session as any).user = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
        };
        
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error on signup:', saveErr);
            return res.status(500).json({ message: "Session creation failed" });
          }
          
          console.log('SIGNUP: Session regenerated and saved successfully');
          console.log('SIGNUP: New session ID:', req.sessionID);
          console.log('SIGNUP: User in session:', (req.session as any).user);
          
          // Return user without password
          const { password: _, ...userWithoutPassword } = newUser;
          res.status(201).json({ 
            message: "Account created successfully", 
            user: userWithoutPassword 
          });
        });
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

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginRequestSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      };

      console.log('LOGIN: Session after setting user:', req.session);
      console.log('LOGIN: Session ID:', req.sessionID);
      
      // Force session save and regenerate for security
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regenerate error:', err);
          return res.status(500).json({ message: "Session creation failed" });
        }
        
        // Set user data in the new session
        (req.session as any).userId = user.id;
        (req.session as any).user = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        };
        
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: "Session creation failed" });
          }
          
          console.log('LOGIN: Session regenerated and saved successfully');
          console.log('LOGIN: New session ID:', req.sessionID);
          console.log('LOGIN: User in session:', (req.session as any).user);
          
          // Return user without password
          const { password: _, ...userWithoutPassword } = user;
          res.json({ 
            message: "Login successful", 
            user: userWithoutPassword 
          });
        });
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    console.log('AUTH CHECK: Session ID:', req.sessionID);
    console.log('AUTH CHECK: Full session:', req.session);
    console.log('AUTH CHECK: Session user:', (req.session as any)?.user);
    
    const user = (req.session as any)?.user;
    if (!user) {
      console.log('AUTH CHECK: No user found in session');
      return res.status(401).json({ message: "Not authenticated" });
    }
    console.log('AUTH CHECK: User found, returning:', user);
    res.json(user);
  });

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    req.user = user;
    next();
  };

  // Password Analysis - Works for both guest and authenticated users
  app.post("/api/security/password-analysis", async (req, res) => {
    try {
      const { password } = passwordAnalysisRequestSchema.parse(req.body);
      const analysis = passwordService.analyzePassword(password);
      
      // Store result only if user is authenticated
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'password',
            target: 'password-analysis',
            result: JSON.stringify(analysis),
            score: analysis.score,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
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
      
      // Store result for authenticated users
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'phishing',
            target: url,
            result: JSON.stringify(analysis),
            score: analysis.score,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
      }

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
      
      // Store result for authenticated users
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'port',
            target,
            result: JSON.stringify(result),
            score: result.openPorts.length,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
      }

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
      
      // Store result for authenticated users
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'port',
            target,
            result: JSON.stringify(result),
            score: result.openPorts.length,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Keylogger Detection
  app.post("/api/security/keylogger-scan", async (req, res) => {
    try {
      const result = await keyloggerService.detectKeyloggers();
      
      // Store result for authenticated users
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'keylogger',
            target: 'system-scan',
            result: JSON.stringify(result),
            score: result.suspiciousProcesses.length,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
      }

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
      
      // Store result for authenticated users
      const user = (req.session as any)?.user;
      if (user) {
        try {
          await storage.createScanResult({
            type: 'file_integrity',
            target: directory,
            result: JSON.stringify(result),
            score: result.changes.length,
            userId: user.id
          });
        } catch (dbError) {
          console.log('Database storage failed for authenticated user');
        }
      }

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

  // Get scan history - Returns user-specific data for authenticated users, empty for guests
  app.get("/api/security/scan-history", async (req, res) => {
    try {
      const { type } = req.query;
      const user = (req.session as any)?.user;
      
      if (user) {
        // Return user-specific scan results
        const results = await storage.getUserScanResults(user.id, type as string);
        res.json(results);
      } else {
        // Return empty array for guest users
        res.json([]);
      }
    } catch (error: any) {
      // Return empty array if database fails
      console.log('Database query failed, returning empty results');
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
