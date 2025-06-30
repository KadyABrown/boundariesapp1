import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertBoundarySchema,
  insertBoundaryEntrySchema,
  insertReflectionEntrySchema,
  insertUserSettingsSchema,
  insertRelationshipProfileSchema,
  insertEmotionalCheckInSchema,
  insertBehavioralFlagSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Boundary routes
  app.get('/api/boundaries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const boundaries = await storage.getBoundariesByUser(userId);
      res.json(boundaries);
    } catch (error) {
      console.error("Error fetching boundaries:", error);
      res.status(500).json({ message: "Failed to fetch boundaries" });
    }
  });

  app.post('/api/boundaries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const boundaryData = insertBoundarySchema.parse({
        ...req.body,
        userId,
      });
      const boundary = await storage.createBoundary(boundaryData);
      res.json(boundary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid boundary data", errors: error.errors });
      } else {
        console.error("Error creating boundary:", error);
        res.status(500).json({ message: "Failed to create boundary" });
      }
    }
  });

  app.put('/api/boundaries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBoundarySchema.partial().parse(req.body);
      const boundary = await storage.updateBoundary(id, updates);
      res.json(boundary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid boundary data", errors: error.errors });
      } else {
        console.error("Error updating boundary:", error);
        res.status(500).json({ message: "Failed to update boundary" });
      }
    }
  });

  app.delete('/api/boundaries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBoundary(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting boundary:", error);
      res.status(500).json({ message: "Failed to delete boundary" });
    }
  });

  // Boundary entry routes
  app.get('/api/boundary-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const entries = await storage.getBoundaryEntriesByUser(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching boundary entries:", error);
      res.status(500).json({ message: "Failed to fetch boundary entries" });
    }
  });

  app.post('/api/boundary-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertBoundaryEntrySchema.parse({
        ...req.body,
        userId,
      });
      const entry = await storage.createBoundaryEntry(entryData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      } else {
        console.error("Error creating boundary entry:", error);
        res.status(500).json({ message: "Failed to create boundary entry" });
      }
    }
  });

  // Reflection routes
  app.get('/api/reflections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const reflections = await storage.getReflectionEntriesByUser(userId, limit);
      res.json(reflections);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  app.post('/api/reflections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reflectionData = insertReflectionEntrySchema.parse({
        ...req.body,
        userId,
      });
      const reflection = await storage.createReflectionEntry(reflectionData);
      res.json(reflection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reflection data", errors: error.errors });
      } else {
        console.error("Error creating reflection:", error);
        res.status(500).json({ message: "Failed to create reflection" });
      }
    }
  });

  // User settings routes
  app.get('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertUserSettingsSchema.parse({
        ...req.body,
        userId,
      });
      const settings = await storage.upsertUserSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  // Relationship profile routes
  app.get('/api/relationships', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profiles = await storage.getRelationshipProfilesByUser(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching relationships:", error);
      res.status(500).json({ message: "Failed to fetch relationships" });
    }
  });

  app.post('/api/relationships', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating relationship profile for user:", userId);
      console.log("Request body:", req.body);
      
      const profileData = insertRelationshipProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      console.log("Parsed profile data:", profileData);
      const profile = await storage.createRelationshipProfile(profileData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error creating relationship profile:", error);
        res.status(500).json({ message: "Failed to create relationship profile" });
      }
    }
  });

  app.get('/api/relationships/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getRelationshipProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Relationship profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching relationship profile:", error);
      res.status(500).json({ message: "Failed to fetch relationship profile" });
    }
  });

  app.put('/api/relationships/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertRelationshipProfileSchema.partial().parse(req.body);
      const profile = await storage.updateRelationshipProfile(id, updates);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error updating relationship profile:", error);
        res.status(500).json({ message: "Failed to update relationship profile" });
      }
    }
  });

  app.delete('/api/relationships/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteRelationshipProfile(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting relationship profile:", error);
      res.status(500).json({ message: "Failed to delete relationship profile" });
    }
  });

  // Emotional check-in routes
  app.get('/api/relationships/:id/check-ins', isAuthenticated, async (req: any, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const checkIns = await storage.getEmotionalCheckInsByProfile(profileId);
      res.json(checkIns);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
      res.status(500).json({ message: "Failed to fetch check-ins" });
    }
  });

  app.post('/api/relationships/:id/check-ins', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileId = parseInt(req.params.id);
      const checkInData = insertEmotionalCheckInSchema.parse({
        ...req.body,
        userId,
        profileId,
      });
      const checkIn = await storage.createEmotionalCheckIn(checkInData);
      res.json(checkIn);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid check-in data", errors: error.errors });
      } else {
        console.error("Error creating check-in:", error);
        res.status(500).json({ message: "Failed to create check-in" });
      }
    }
  });

  // Behavioral flag routes
  app.get('/api/relationships/:id/flags', isAuthenticated, async (req: any, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const flags = await storage.getBehavioralFlagsByProfile(profileId);
      res.json(flags);
    } catch (error) {
      console.error("Error fetching behavioral flags:", error);
      res.status(500).json({ message: "Failed to fetch behavioral flags" });
    }
  });

  app.post('/api/relationships/:id/flags', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileId = parseInt(req.params.id);
      const flagData = insertBehavioralFlagSchema.parse({
        ...req.body,
        userId,
        profileId,
      });
      const flag = await storage.createBehavioralFlag(flagData);
      res.json(flag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid flag data", errors: error.errors });
      } else {
        console.error("Error creating behavioral flag:", error);
        res.status(500).json({ message: "Failed to create behavioral flag" });
      }
    }
  });

  app.put('/api/relationships/:id/flags/:flagId', isAuthenticated, async (req: any, res) => {
    try {
      const flagId = parseInt(req.params.flagId);
      const updates = insertBehavioralFlagSchema.partial().parse(req.body);
      const flag = await storage.updateBehavioralFlag(flagId, updates);
      res.json(flag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid flag data", errors: error.errors });
      } else {
        console.error("Error updating behavioral flag:", error);
        res.status(500).json({ message: "Failed to update behavioral flag" });
      }
    }
  });

  app.delete('/api/relationships/:id/flags/:flagId', isAuthenticated, async (req: any, res) => {
    try {
      const flagId = parseInt(req.params.flagId);
      await storage.deleteBehavioralFlag(flagId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting behavioral flag:", error);
      res.status(500).json({ message: "Failed to delete behavioral flag" });
    }
  });

  // Relationship stats
  app.get('/api/relationships/:id/stats', isAuthenticated, async (req: any, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const stats = await storage.getRelationshipStats(profileId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching relationship stats:", error);
      res.status(500).json({ message: "Failed to fetch relationship stats" });
    }
  });

  // Export routes
  app.get('/api/export/csv', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getBoundaryEntriesByUser(userId);
      
      const csvHeader = 'Date,Category,Description,Status,Emotional Impact\n';
      const csvData = entries.map(entry => 
        `${entry.createdAt?.toISOString().split('T')[0]},${entry.category},"${entry.description}",${entry.status},${entry.emotionalImpact}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=boundary-tracker-data.csv');
      res.send(csvHeader + csvData);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
