import express, { type Request, Response, NextFunction } from "express";
import { setupAuth } from "./replitAuth";
import { registerRoutes } from "./routes-clean";
import { setupVite, serveStatic } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy headers for correct IP detection
app.set("trust proxy", true);

// Initialize authentication
await setupAuth(app);

// Register API routes
registerRoutes(app);

// Set up Vite for development/static files
if (app.get("env") === "development") {
  await setupVite(app);
} else {
  serveStatic(app);
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});