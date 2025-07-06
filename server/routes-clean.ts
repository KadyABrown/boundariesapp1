import type { Express, Request, Response } from "express";
import { z } from "zod";
import { storage } from "./storage-clean";
import { isAuthenticated, getSession } from "./replitAuth";
import { 
  insertPersonalBaselineSchema,
  insertRelationshipSchema,
  insertInteractionSchema,
  insertBoundaryGoalSchema 
} from "../shared/schema";

export function registerRoutes(app: Express) {
  
  // User authentication check
  app.get("/api/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = getSession()?.user;
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  // Personal Baseline Routes
  app.post("/api/baseline", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertPersonalBaselineSchema.parse(req.body);
      const baseline = await storage.createBaseline(userId, validatedData);
      
      res.json(baseline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Baseline validation error:", error.errors);
        res.status(400).json({ message: "Invalid baseline data", errors: error.errors });
      } else {
        console.error("Error saving baseline:", error);
        res.status(500).json({ message: "Failed to save baseline" });
      }
    }
  });

  app.get("/api/baseline/latest", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const baseline = await storage.getLatestBaseline(userId);
      res.json(baseline);
    } catch (error) {
      console.error("Error fetching baseline:", error);
      res.status(500).json({ message: "Failed to fetch baseline" });
    }
  });

  // Relationship Routes
  app.post("/api/relationships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertRelationshipSchema.parse(req.body);
      const relationship = await storage.createRelationship(userId, validatedData);
      
      res.json(relationship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid relationship data", errors: error.errors });
      } else {
        console.error("Error creating relationship:", error);
        res.status(500).json({ message: "Failed to create relationship" });
      }
    }
  });

  app.get("/api/relationships", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const relationships = await storage.getRelationships(userId);
      res.json(relationships);
    } catch (error) {
      console.error("Error fetching relationships:", error);
      res.status(500).json({ message: "Failed to fetch relationships" });
    }
  });

  app.get("/api/relationships/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const relationshipId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const relationship = await storage.getRelationship(userId, relationshipId);
      if (!relationship) {
        return res.status(404).json({ message: "Relationship not found" });
      }
      
      res.json(relationship);
    } catch (error) {
      console.error("Error fetching relationship:", error);
      res.status(500).json({ message: "Failed to fetch relationship" });
    }
  });

  app.get("/api/relationships/:id/health", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const relationshipId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const healthScore = await storage.getRelationshipHealthScore(userId, relationshipId);
      res.json({ healthScore });
    } catch (error) {
      console.error("Error calculating health score:", error);
      res.status(500).json({ message: "Failed to calculate health score" });
    }
  });

  // Interaction Routes (CIT)
  app.post("/api/interactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertInteractionSchema.parse(req.body);
      const interaction = await storage.createInteraction(userId, validatedData);
      
      res.json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid interaction data", errors: error.errors });
      } else {
        console.error("Error creating interaction:", error);
        res.status(500).json({ message: "Failed to create interaction" });
      }
    }
  });

  app.get("/api/relationships/:id/interactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const relationshipId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const interactions = await storage.getInteractionsForRelationship(userId, relationshipId);
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  // Boundary Goals Routes
  app.get("/api/boundary-goals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const goals = await storage.getBoundaryGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching boundary goals:", error);
      res.status(500).json({ message: "Failed to fetch boundary goals" });
    }
  });

  app.post("/api/boundary-goals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertBoundaryGoalSchema.parse(req.body);
      const goal = await storage.createBoundaryGoal(userId, validatedData);
      
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid boundary goal data", errors: error.errors });
      } else {
        console.error("Error creating boundary goal:", error);
        res.status(500).json({ message: "Failed to create boundary goal" });
      }
    }
  });

  app.get("/api/boundary-goals/:boundaryName/violation-rate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const boundaryName = req.params.boundaryName;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const violationRate = await storage.getBoundaryViolationRate(userId, boundaryName);
      res.json({ violationRate });
    } catch (error) {
      console.error("Error calculating violation rate:", error);
      res.status(500).json({ message: "Failed to calculate violation rate" });
    }
  });
}