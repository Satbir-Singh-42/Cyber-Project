import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration  
const pgStore = connectPg(session);

// Ensure we have the DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for session storage');
}

app.use(session({
  store: new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: 'sessions',
    schemaName: 'public',
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production-super-secret',
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid', // Use default session cookie name
  rolling: false, // Don't refresh on every request to avoid cookie issues
  proxy: false, // Disable proxy for now
  cookie: {
    secure: false, // HTTP for development
    httpOnly: false, // Allow JS access for debugging
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none', // Allow cross-origin cookies
    path: '/',
    domain: undefined // Let browser set domain
  },
}));

// Add CORS headers for development  
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', origin); // Allow any origin with credentials
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Cookie,Set-Cookie');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Server error:", err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
