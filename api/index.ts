// Vercel serverless function entry point
// This wraps the Express app for Vercel's serverless environment
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

// Set Vercel environment flag
process.env.VERCEL = "1";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Only parse JSON for non-multipart requests (multer handles multipart)
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })(req, res, next);
});

app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: false })(req, res, next);
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Register all routes
let serverInitialized = false;
let appWithRoutes: express.Express | null = null;

async function initializeApp() {
  if (!serverInitialized) {
    await registerRoutes(app);
    serverInitialized = true;
    appWithRoutes = app;
  }
  return appWithRoutes!;
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  const appInstance = await initializeApp();
  return appInstance(req, res);
}

