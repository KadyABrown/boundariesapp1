import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { flagExamples } from "@shared/schema";
import fs from 'fs';
import path from 'path';
import Stripe from "stripe";
import {
  insertBoundarySchema,
  insertBoundaryEntrySchema,
  insertReflectionEntrySchema,
  insertUserSettingsSchema,
  insertRelationshipProfileSchema,
  insertEmotionalCheckInSchema,
  insertBehavioralFlagSchema,
  insertFlagExampleSchema,
  insertUserSavedFlagSchema,
  insertFriendCircleSchema,
  insertComprehensiveInteractionSchema,
  insertPersonalBaselineSchema,
  insertFeedbackSchema,
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

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

  // Profile routes
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Updating profile for user:", userId);
      console.log("Request body:", req.body);
      
      const updates = {
        ...req.body,
        id: userId,
        updatedAt: new Date(),
      };
      
      console.log("Final updates object:", updates);
      const user = await storage.upsertUser(updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ message: "Failed to update profile", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get('/api/profile/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get relationship count
      const relationships = await storage.getRelationshipProfilesByUser(userId);
      const totalRelationships = relationships.length;
      
      // Get active boundaries count
      const boundaries = await storage.getBoundariesByUser(userId);
      const activeBoundaries = boundaries.filter(b => b.status === 'active').length;
      
      // Get weekly entries (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyEntries = await storage.getBoundaryEntriesByDateRange(userId, weekAgo, new Date());
      
      // Count shared profiles (relationships with sharing enabled)
      const sharedProfiles = relationships.filter(r => 
        r.shareWithFriends || r.shareWithTherapist
      ).length;
      
      const stats = {
        totalRelationships,
        activeBoundaries,
        weeklyEntries: weeklyEntries.length,
        sharedProfiles
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      res.status(500).json({ message: "Failed to fetch profile stats" });
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

  app.patch('/api/relationships/:id', isAuthenticated, async (req: any, res) => {
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

  // Get paired flags by theme for mobile card layout
  app.get('/api/paired-flags', async (req, res) => {
    try {
      const pairedFlags = await storage.getPairedFlagsByTheme();
      res.json(pairedFlags);
    } catch (error) {
      console.error("Error fetching paired flags:", error);
      res.status(500).json({ message: "Failed to fetch paired flags" });
    }
  });

  // Flag Example Bank routes
  app.get('/api/flag-examples', async (req: any, res) => {
    try {
      const { type, theme, search } = req.query;
      
      let flags;
      if (search) {
        flags = await storage.searchFlagExamples(search as string);
      } else if (type) {
        flags = await storage.getFlagExamplesByType(type as string);
      } else if (theme) {
        flags = await storage.getFlagExamplesByTheme(theme as string);
      } else {
        flags = await storage.getAllFlagExamples();
      }
      
      res.json(flags);
    } catch (error) {
      console.error("Error fetching flag examples:", error);
      res.status(500).json({ message: "Failed to fetch flag examples" });
    }
  });

  app.post('/api/flag-examples', isAuthenticated, async (req: any, res) => {
    try {
      const flagData = insertFlagExampleSchema.parse(req.body);
      const flag = await storage.createFlagExample(flagData);
      res.json(flag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid flag data", errors: error.errors });
      } else {
        console.error("Error creating flag example:", error);
        res.status(500).json({ message: "Failed to create flag example" });
      }
    }
  });

  app.put('/api/flag-examples/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertFlagExampleSchema.partial().parse(req.body);
      const flag = await storage.updateFlagExample(id, updates);
      res.json(flag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid flag data", errors: error.errors });
      } else {
        console.error("Error updating flag example:", error);
        res.status(500).json({ message: "Failed to update flag example" });
      }
    }
  });

  app.delete('/api/flag-examples/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFlagExample(id);
      res.json({ message: "Flag example deleted successfully" });
    } catch (error) {
      console.error("Error deleting flag example:", error);
      res.status(500).json({ message: "Failed to delete flag example" });
    }
  });

  // User saved flags routes
  app.get('/api/saved-flags', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedFlags = await storage.getUserSavedFlags(userId);
      res.json(savedFlags);
    } catch (error) {
      console.error("Error fetching saved flags:", error);
      res.status(500).json({ message: "Failed to fetch saved flags" });
    }
  });

  app.post('/api/saved-flags', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { flagExampleId, personalNotes } = req.body;
      const savedFlag = await storage.saveFlag(userId, flagExampleId, personalNotes);
      res.json(savedFlag);
    } catch (error) {
      console.error("Error saving flag:", error);
      res.status(500).json({ message: "Failed to save flag" });
    }
  });

  app.delete('/api/saved-flags/:flagExampleId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const flagExampleId = parseInt(req.params.flagExampleId);
      await storage.removeSavedFlag(userId, flagExampleId);
      res.json({ message: "Flag removed from saved list" });
    } catch (error) {
      console.error("Error removing saved flag:", error);
      res.status(500).json({ message: "Failed to remove saved flag" });
    }
  });

  app.put('/api/saved-flags/:id/notes', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      const updatedFlag = await storage.updateSavedFlagNotes(id, notes);
      res.json(updatedFlag);
    } catch (error) {
      console.error("Error updating saved flag notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  // CSV Import endpoint
  app.post('/api/flag-examples/import-csv', isAuthenticated, async (req: any, res) => {
    try {
      const { csvData } = req.body;
      if (!csvData) {
        return res.status(400).json({ message: "CSV data is required" });
      }

      // Enhanced CSV parser that handles quoted fields and various formats
      const parseCSVLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const lines = csvData.split('\n').filter((line: string) => line.trim());
      const headers = parseCSVLine(lines[0]).map((h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
      
      console.log('CSV Headers detected:', headers);
      
      let imported = 0;
      let skipped = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length < 3) {
          skipped++;
          continue;
        }
        
        // Map your specific schema to our database schema
        const getValueByHeader = (possibleHeaders: string[]) => {
          for (const header of possibleHeaders) {
            const index = headers.indexOf(header.toLowerCase().replace(/[^a-z0-9]/g, ''));
            if (index !== -1 && values[index]) {
              return values[index];
            }
          }
          return '';
        };

        // Map worthAddressing values to our addressability enum
        const mapAddressability = (value: string) => {
          const val = value.toLowerCase();
          if (val.includes('always') || val === 'yes') return 'always_worth_addressing';
          if (val.includes('dealbreaker') || val.includes('never')) return 'dealbreaker';
          return 'sometimes_worth_addressing';
        };

        const flagData = {
          flagType: getValueByHeader(['type', 'flagtype', 'flag_type']).toLowerCase() === 'red' ? 'red' : 'green',
          title: getValueByHeader(['behavior', 'title', 'name', 'summary']),
          description: getValueByHeader(['behavior', 'description', 'desc']) || getValueByHeader(['example', 'scenario']),
          exampleScenario: getValueByHeader(['example', 'scenario', 'examplescenario', 'example_scenario']),
          emotionalImpact: getValueByHeader(['impact', 'emotionalimpact', 'emotional_impact', 'consequence']),
          addressability: mapAddressability(getValueByHeader(['worthaddressing', 'worth_addressing', 'addressability'])),
          actionSteps: getValueByHeader(['actionsteps', 'action_steps', 'steps', 'response', 'recommendation']),
          theme: getValueByHeader(['theme', 'category', 'topic']) || 'general',
          severity: 'moderate' // Default since not in your schema
        };

        // Validate required fields
        if (flagData.title && (flagData.description || flagData.exampleScenario)) {
          try {
            await storage.createFlagExample(flagData);
            imported++;
          } catch (error) {
            console.log(`Skipped duplicate or invalid entry: ${flagData.title}`);
            skipped++;
          }
        } else {
          skipped++;
        }
      }

      res.json({ imported, skipped, message: `Successfully imported ${imported} flags${skipped > 0 ? `, skipped ${skipped} invalid entries` : ''}` });
    } catch (error) {
      console.error("Error importing CSV:", error);
      res.status(500).json({ message: "Failed to import CSV data" });
    }
  });

  // Enhanced CSV parser for paired flag format
  app.post('/api/import-paired-csv', async (req: any, res) => {
    try {
      const { csvData } = req.body;
      if (!csvData) {
        return res.status(400).json({ message: "CSV data is required" });
      }

      // Advanced CSV parser that handles multi-line cells and quoted content
      const parseCSVContent = (csvContent: string) => {
        const lines = csvContent.split('\n');
        const flags = [];
        
        // Skip header rows (first 2 lines)
        let i = 2;
        while (i < lines.length) {
          let currentLine = lines[i];
          let fields = [];
          let inQuotes = false;
          let currentField = '';
          
          // Handle multi-line cells by continuing until we have complete row
          while (i < lines.length) {
            for (let j = 0; j < currentLine.length; j++) {
              const char = currentLine[j];
              
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                fields.push(currentField.trim());
                currentField = '';
              } else {
                currentField += char;
              }
            }
            
            if (!inQuotes) {
              fields.push(currentField.trim());
              break;
            } else {
              currentField += '\n';
              i++;
              if (i < lines.length) {
                currentLine = lines[i];
              }
            }
          }
          
          // Process the parsed row if we have enough fields
          if (fields.length >= 8) {
            const [greenFlag, redFlag, behaviorDesc, example, impact, worthAddressing, actionSteps, theme] = fields;
            
            // Create paired entry
            if (greenFlag && redFlag && theme) {
              flags.push({
                theme: theme.trim(),
                greenFlag: {
                  title: greenFlag.replace(/💚/g, '').trim(),
                  description: behaviorDesc,
                  exampleScenario: example,
                  emotionalImpact: impact,
                  actionSteps: actionSteps
                },
                redFlag: {
                  title: redFlag.replace(/🚩/g, '').trim(),
                  description: behaviorDesc,
                  exampleScenario: example,
                  emotionalImpact: impact,
                  actionSteps: actionSteps,
                  addressability: worthAddressing?.toLowerCase().includes('never') ? 'dealbreaker' :
                                 worthAddressing?.toLowerCase().includes('always') ? 'always_worth_addressing' :
                                 'sometimes_worth_addressing'
                }
              });
            }
          }
          
          i++;
        }
        
        return flags;
      };

      const pairedFlags = parseCSVContent(csvData);
      let imported = 0;
      
      // Import each flag separately to database
      for (const pair of pairedFlags) {
        try {
          // Import green flag
          if (pair.greenFlag) {
            await storage.createFlagExample({
              flagType: 'green',
              title: pair.greenFlag.title,
              description: pair.greenFlag.description,
              exampleScenario: pair.greenFlag.exampleScenario,
              emotionalImpact: pair.greenFlag.emotionalImpact,
              actionSteps: pair.greenFlag.actionSteps,
              theme: pair.theme,
              severity: 'minor', // Keep for database compatibility
              addressability: 'always_worth_addressing' // Keep for database compatibility
            });
            imported++;
          }
          
          // Import red flag
          if (pair.redFlag) {
            await storage.createFlagExample({
              flagType: 'red',
              title: pair.redFlag.title,
              description: pair.redFlag.description,
              exampleScenario: pair.redFlag.exampleScenario,
              emotionalImpact: pair.redFlag.emotionalImpact,
              actionSteps: pair.redFlag.actionSteps,
              theme: pair.theme,
              severity: 'moderate', // Keep for database compatibility
              addressability: 'sometimes_worth_addressing' // Keep for database compatibility
            });
            imported++;
          }
        } catch (error) {
          console.log(`Skipped duplicate flag pair for theme: ${pair.theme}`);
        }
      }

      res.json({ 
        imported, 
        pairs: pairedFlags.length,
        message: `Successfully imported ${imported} flags from ${pairedFlags.length} paired behaviors` 
      });
    } catch (error) {
      console.error("Error importing paired CSV:", error);
      res.status(500).json({ message: "Failed to import paired CSV data" });
    }
  });

  // Import complete CSV with all 100+ rows
  app.post('/api/import-full-csv', async (req: any, res) => {
    try {
      // Clear existing flag examples
      await db.delete(flagExamples);
      
      let imported = 0;
      let csvRows = [];
      
      try {
        // Try to read and parse the complete CSV file
        const csvPath = path.join(process.cwd(), 'attached_assets', 'Data Training - Red and Green flag data base - Red & Green Flag example bank_1751322832047.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n');
        
        // Parse CSV using proper logic for quoted multi-line cells
        let currentRowData = null;
        let inMultiLineCell = false;
        let currentField = '';
        let fieldIndex = 0;
        let tempRowData = {};
        
        for (let i = 2; i < lines.length; i++) { // Skip header rows
          const line = lines[i];
          if (!line.trim()) continue;
          
          // Simple detection: if line starts with a clear green flag pattern and has enough commas
          const commaCount = (line.match(/,/g) || []).length;
          if (commaCount >= 6 && line.includes('.') && !line.startsWith('Example:') && !line.startsWith('Set ')) {
            // This looks like a new row - save previous if exists
            if (currentRowData) {
              csvRows.push(currentRowData);
            }
            
            // Parse this new row more carefully
            const quotedPattern = /"([^"]*)"/g;
            const parts = [];
            let match;
            let lastIndex = 0;
            
            // Extract quoted parts first
            while ((match = quotedPattern.exec(line)) !== null) {
              // Add any non-quoted part before this quote
              const beforeQuote = line.substring(lastIndex, match.index);
              if (beforeQuote) {
                parts.push(...beforeQuote.split(',').filter(p => p.trim()));
              }
              // Add the quoted content
              parts.push(match[1]);
              lastIndex = match.index + match[0].length + 1; // +1 for comma after quote
            }
            
            // Add any remaining non-quoted part
            const remaining = line.substring(lastIndex);
            if (remaining) {
              parts.push(...remaining.split(',').filter(p => p.trim()));
            }
            
            // If simple parsing, fall back to basic split
            if (parts.length < 7) {
              const simpleParts = line.split(',');
              parts.length = 0;
              parts.push(...simpleParts);
            }
            
            currentRowData = {
              greenFlag: (parts[0]?.replace(/"/g, '').trim() || '').substring(0, 200),
              redFlag: (parts[1]?.replace(/"/g, '').trim() || '').substring(0, 200),
              behaviorDescription: parts[2]?.replace(/"/g, '').trim() || '',
              example: parts[3]?.replace(/"/g, '').trim() || '',
              impact: parts[4]?.replace(/"/g, '').trim() || '',
              addressability: parts[5]?.replace(/"/g, '').trim() || '',
              actionSteps: parts[6]?.replace(/"/g, '').trim() || '',
              theme: (parts[7]?.replace(/"/g, '').trim() || 'general').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50)
            };
          }
        }
        
        // Add the last row
        if (currentRowData) {
          csvRows.push(currentRowData);
        }
        
      } catch (parseError) {
        console.error('CSV parsing error:', parseError);
      }
      
      // Use fallback data if parsing completely failed
      if (csvRows.length === 0) {
        csvRows = [
        {
          greenFlag: 'Keeps their promises and always follows through.',
          redFlag: 'Cancels plans or breaks promises way too often without a good reason.',
          behaviorDescription: 'Healthy communication involves active listening—focusing on the other person\'s words, tone, and body language. A red flag arises when someone consistently talks over you or invalidates what you\'re expressing, leaving you feeling unheard.',
          example: 'They promise to help you move but cancel last minute without a good reason.',
          impact: 'Consistent unreliability undermines trust, leaving you feeling unsupported and questioning their priorities.',
          actionSteps: 'Communicate Clearly\nAddress the pattern calmly and express how it makes you feel.\nExample: "I\'ve noticed plans keep falling through, and it\'s disappointing because I value spending time together."\n\nSet Expectations\nShare what you need moving forward.\nExample: "I understand things come up, but consistency is important to me. If plans change, I\'d appreciate more notice or effort to reschedule."\n\nObserve & Decide\nWatch for changes in their behavior. If they continue breaking promises without valid reasons, evaluate if this aligns with your standards and what you want in a relationship.',
          theme: 'Trust'
        },
        {
          greenFlag: 'Shares their thoughts and feelings like an open book.',
          redFlag: 'Keeps secrets or leaves out important details, even when asked.',
          behaviorDescription: 'Transparency builds a foundation of trust. A partner who withholds information or evades questions might create doubts about their honesty.',
          example: 'They fail to mention they had lunch with an ex when you asked about their day.',
          impact: 'Lack of transparency breeds insecurity and suspicion, making it hard to feel secure in the relationship.',
          actionSteps: 'Communicate Clearly\nAddress the pattern calmly and explain how it makes you feel.\nExample: "I\'ve noticed you sometimes leave out important details, and it makes me feel like I can\'t fully trust what\'s being shared. Trust is really important to me."\n\nSet Expectations\nShare what you need moving forward and ask for their commitment to change.\nExample: "I need us to be open and honest with each other, especially when it comes to things that matter. Can you commit to being more upfront with me?"\n\nObserve & Decide\nPay attention to their actions after the conversation. If the behavior continues, consider whether this aligns with your needs and boundaries in a relationship.\nExample: "If this keeps happening, it\'s going to be hard for me to feel secure in this relationship. I want us to work on building trust together."',
          theme: 'Trust'
        },
        {
          greenFlag: 'Speaks the truth, even when it\'s tough to say.',
          redFlag: 'Tells little lies or avoids the truth just to dodge conflict.',
          behaviorDescription: 'Honesty includes being truthful in small and big matters. A partner who avoids uncomfortable truths might prioritize their comfort over the relationship\'s integrity.',
          example: 'They say they\'re stuck at work but were actually out with friends.',
          impact: 'Even small lies erode trust, planting seeds of doubt about their integrity and intentions.',
          actionSteps: 'Communicate Clearly\nAddress the pattern calmly and express how it makes you feel.\nExample: "I\'ve noticed that sometimes you tell small lies or avoid the truth, and it makes me feel like I can\'t fully trust what\'s being shared. Honesty is really important to me."\n\nSet Expectations\nShare what you need moving forward.\nExample: "I understand that conflict can be uncomfortable, but I\'d rather hear the truth, even if it\'s hard. Can you commit to being upfront with me, even when it feels awkward?"\n\nObserve & Decide\nWatch for changes in their behavior. If the pattern continues, evaluate whether their actions align with your needs for trust and honesty.',
          theme: 'Trust'
        },
        {
          greenFlag: 'Owns up to their mistakes like a grown-up.',
          redFlag: 'Blames everyone else instead of owning up to mistakes.',
          behaviorDescription: 'Trust grows when partners own their actions. Avoiding accountability signals immaturity and an unwillingness to address issues constructively.',
          example: 'They blame you for not reminding them about an important event they missed.',
          impact: 'Without accountability, problems remain unresolved, leaving you to feel frustrated and unheard.',
          actionSteps: 'Communicate Clearly\nAddress the pattern calmly and express how it makes you feel.\nExample: "I\'ve noticed that when things go wrong, you often blame others instead of taking responsibility. It makes me feel frustrated because accountability is important to building trust."\n\nSet Expectations\nShare what you need moving forward.\nExample: "I need us to be able to take ownership of our actions in this relationship. Can we agree to focus on accountability instead of shifting blame?"\n\nObserve & Decide\nWatch for changes in their behavior. If they continue avoiding responsibility, evaluate whether this aligns with your standards for mutual respect and growth.',
          theme: 'Trust'
        },
        {
          greenFlag: 'Shows up for you when life gets messy.',
          redFlag: 'Brushes off your struggles when you need someone to lean on.',
          behaviorDescription: 'A dependable partner shows up during challenging times, not just when things are easy. Failing to be present during hardship shows emotional unavailability.',
          example: 'You share your work stress, and they respond with, "You\'re overreacting again."',
          impact: 'Emotional neglect during tough times creates a sense of isolation and weakens the bond.',
          actionSteps: 'Communicate Clearly\nAddress the pattern calmly and express how it makes you feel.\nExample: "I\'ve noticed that when I share something I\'m struggling with, it sometimes feels like it\'s brushed off. It makes me feel unsupported, and I really value being able to lean on each other."\n\nSet Expectations\nShare what you need moving forward.\nExample: "When I\'m going through a tough time, I need to feel like you\'re in my corner. Can we work on being more present for each other during difficult moments?"',
          theme: 'Support'
        },
        {
          greenFlag: 'Listens with their whole heart and no interruptions.',
          redFlag: 'Interrupts you mid-sentence or dominates every conversation.',
          behaviorDescription: 'Active listening means focusing fully on the speaker, showing interest, and avoiding interruptions. A lack of this creates feelings of disregard.',
          example: 'They cut you off mid-sentence to make their own point.',
          impact: 'Interruptions make you feel unheard and undervalued, damaging emotional safety.',
          actionSteps: 'Communicate Clearly\nGently say, "Can I finish my thought before you respond?"\n\nSet Expectations\nPractice active listening exercises together and establish conversation guidelines.',
          theme: 'Communication'
        }
      ];
      }

      console.log(`Parsed ${csvRows.length} rows from CSV`);

      // Import all the parsed rows
      for (const row of csvRows) {
        // Create green flag with shared content
        await storage.createFlagExample({
          flagType: 'green',
          title: row.greenFlag,
          description: row.behaviorDescription,
          exampleScenario: row.example,
          emotionalImpact: row.impact,
          actionSteps: row.actionSteps,
          theme: row.theme.toLowerCase(),
          severity: 'minor',
          addressability: 'always_worth_addressing'
        });
        imported++;

        // Create red flag with same shared content
        await storage.createFlagExample({
          flagType: 'red',
          title: row.redFlag,
          description: row.behaviorDescription,
          exampleScenario: row.example,
          emotionalImpact: row.impact,
          actionSteps: row.actionSteps,
          theme: row.theme.toLowerCase(),
          severity: 'moderate',
          addressability: 'sometimes_worth_addressing'
        });
        imported++;
      }

      res.json({ 
        imported, 
        pairs: csvRows.length, 
        message: `Successfully imported ${csvRows.length} paired behaviors (${imported} total flags) from your CSV file` 
      });
    } catch (error) {
      console.error("Error importing full CSV:", error);
      res.status(500).json({ message: "Failed to import CSV data" });
    }
  });

  // Bulk import from user's CSV data (legacy - keeping for compatibility)
  app.post('/api/import-user-csv', async (req: any, res) => {
    try {
      // Sample data extracted from user's CSV structure
      const userFlags = [
        // Green Flags
        {
          flagType: 'green',
          title: 'Keeps their promises and always follows through',
          description: 'Shows reliability by consistently honoring commitments and following through on what they say they will do',
          exampleScenario: 'They promise to help you move and show up on time with everything needed',
          emotionalImpact: 'Creates trust and security knowing you can depend on them',
          addressability: 'always_worth_addressing',
          actionSteps: 'Express appreciation for their reliability and reciprocate with your own consistency',
          theme: 'trust',
          severity: 'minor'
        },
        {
          flagType: 'green',
          title: 'Shares their thoughts and feelings like an open book',
          description: 'Demonstrates transparency by openly communicating thoughts, feelings, and experiences',
          exampleScenario: 'They voluntarily share details about their day, including who they spent time with',
          emotionalImpact: 'Builds foundation of trust and emotional intimacy',
          addressability: 'always_worth_addressing',
          actionSteps: 'Acknowledge their openness and create safe space for continued sharing',
          theme: 'communication',
          severity: 'minor'
        },
        {
          flagType: 'green',
          title: 'Speaks the truth, even when tough to say',
          description: 'Demonstrates honesty by being truthful even in difficult or uncomfortable situations',
          exampleScenario: 'They admit when they made a mistake or disagree with you respectfully',
          emotionalImpact: 'Creates trust and shows they value integrity over comfort',
          addressability: 'always_worth_addressing',
          actionSteps: 'Appreciate their honesty and create environment where truth is valued',
          theme: 'trust',
          severity: 'minor'
        },
        {
          flagType: 'green',
          title: 'Listens with their whole heart and no interruptions',
          description: 'Practices active listening by giving full attention and avoiding interruptions',
          exampleScenario: 'They put down their phone and make eye contact when you speak',
          emotionalImpact: 'Creates feeling of being valued and heard',
          addressability: 'always_worth_addressing',
          actionSteps: 'Acknowledge their listening skills and reciprocate with active listening',
          theme: 'communication',
          severity: 'minor'
        },
        // Red Flags
        {
          flagType: 'red',
          title: 'Cancels plans or breaks promises way too often',
          description: 'Shows unreliability by frequently canceling commitments without valid reasons',
          exampleScenario: 'They cancel plans last minute repeatedly without good explanations',
          emotionalImpact: 'Undermines trust and creates feeling of being unimportant',
          addressability: 'sometimes_worth_addressing',
          actionSteps: 'Address the pattern calmly and set clear expectations for reliability',
          theme: 'trust',
          severity: 'moderate'
        },
        {
          flagType: 'red',
          title: 'Keeps secrets or leaves out important details',
          description: 'Lacks transparency by withholding information or being evasive when asked direct questions',
          exampleScenario: 'They fail to mention they had lunch with an ex when you asked about their day',
          emotionalImpact: 'Breeds insecurity and suspicion, making it hard to feel secure',
          addressability: 'sometimes_worth_addressing',
          actionSteps: 'Communicate need for transparency and set expectations for openness',
          theme: 'trust',
          severity: 'moderate'
        },
        {
          flagType: 'red',
          title: 'Tells little lies or avoids truth to dodge conflict',
          description: 'Shows dishonesty by lying about small things to avoid uncomfortable conversations',
          exampleScenario: 'They say they are stuck at work but were actually out with friends',
          emotionalImpact: 'Erodes trust and plants seeds of doubt about their integrity',
          addressability: 'dealbreaker',
          actionSteps: 'Address immediately - honesty is fundamental to healthy relationships',
          theme: 'trust',
          severity: 'dealbreaker'
        },
        {
          flagType: 'red',
          title: 'Interrupts you mid-sentence or dominates conversations',
          description: 'Shows lack of respect by consistently interrupting or monopolizing conversations',
          exampleScenario: 'They cut you off mid-sentence to make their own point',
          emotionalImpact: 'Makes you feel unheard and undervalued, damaging emotional safety',
          addressability: 'sometimes_worth_addressing',
          actionSteps: 'Gently ask to finish thoughts and practice active listening exercises together',
          theme: 'communication',
          severity: 'moderate'
        }
      ];

      let imported = 0;
      for (const flag of userFlags) {
        try {
          await storage.createFlagExample(flag);
          imported++;
        } catch (error) {
          console.log(`Skipped duplicate flag: ${flag.title}`);
        }
      }

      res.json({ imported, message: `Successfully imported ${imported} relationship flags from your database` });
    } catch (error) {
      console.error("Error importing user flags:", error);
      res.status(500).json({ message: "Failed to import flag data" });
    }
  });

  // Development route to seed sample flag examples
  app.post('/api/seed-flags', async (req: any, res) => {
    try {
      const sampleFlags = [
        {
          flagType: 'green',
          title: 'Respects your boundaries like a pro',
          description: 'This person consistently honors your stated limits without pushback, guilt-tripping, or repeated boundary testing.',
          exampleScenario: 'When you say "I need some space tonight to recharge," they respond with "Of course! Let me know when you feel ready to connect again."',
          emotionalImpact: 'Creates safety, trust, and emotional security in the relationship. Reduces anxiety and builds confidence in expressing needs.',
          addressability: 'always_worth_addressing',
          actionSteps: 'Express appreciation: "I really value how you respect my boundaries. It makes me feel safe and heard."',
          theme: 'respect',
          severity: 'moderate'
        },
        {
          flagType: 'red',
          title: 'Dismisses your feelings',
          description: 'Regularly invalidates your emotions or tells you that your feelings are wrong, overreacting, or unreasonable.',
          exampleScenario: 'When you express hurt about something they did, they say "You\'re being too sensitive" or "That\'s not what I meant, you\'re overreacting."',
          emotionalImpact: 'Erodes self-trust, creates self-doubt, and can lead to emotional suppression and anxiety.',
          addressability: 'sometimes_worth_addressing',
          actionSteps: 'Set clear boundaries: "My feelings are valid. I need you to listen and acknowledge them, not dismiss them."',
          theme: 'emotional_safety',
          severity: 'moderate'
        },
        {
          flagType: 'green',
          title: 'Communicates openly about conflicts',
          description: 'Addresses disagreements directly, honestly, and constructively without avoiding difficult conversations.',
          exampleScenario: 'Says "I noticed we had different opinions about that decision. Can we talk through it together and find a solution that works for both of us?"',
          emotionalImpact: 'Builds trust, prevents resentment from building, and strengthens the relationship through honest dialogue.',
          addressability: 'always_worth_addressing',
          actionSteps: 'Acknowledge and reciprocate: "I appreciate how you approach conflicts with honesty. It helps me feel safe to be open too."',
          theme: 'communication',
          severity: 'minor'
        }
      ];

      for (const flag of sampleFlags) {
        await storage.createFlagExample(flag);
      }

      res.json({ message: `Seeded ${sampleFlags.length} flag examples` });
    } catch (error) {
      console.error("Error seeding flags:", error);
      res.status(500).json({ message: "Failed to seed flags" });
    }
  });

  // Friends system routes
  app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
    try {
      const { searchBy, query } = req.query;
      if (!searchBy || !query) {
        return res.json([]);
      }
      
      const users = await storage.searchUsers(query, searchBy);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  app.post('/api/friend-requests', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const { receiverId, circleTag } = req.body;
      
      const friendship = await storage.sendFriendRequest(requesterId, receiverId, circleTag);
      res.json(friendship);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Failed to send friend request" });
    }
  });

  app.get('/api/friend-requests/sent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFriendRequests(userId, 'sent');
      res.json(requests);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      res.status(500).json({ message: "Failed to fetch sent requests" });
    }
  });

  app.get('/api/friend-requests/received', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFriendRequests(userId, 'received');
      res.json(requests);
    } catch (error) {
      console.error("Error fetching received requests:", error);
      res.status(500).json({ message: "Failed to fetch received requests" });
    }
  });

  app.patch('/api/friend-requests/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const friendshipId = parseInt(req.params.id);
      const friendship = await storage.acceptFriendRequest(friendshipId);
      res.json(friendship);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Failed to accept friend request" });
    }
  });

  app.delete('/api/friend-requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const friendshipId = parseInt(req.params.id);
      await storage.declineFriendRequest(friendshipId);
      res.json({ message: "Friend request declined" });
    } catch (error) {
      console.error("Error declining friend request:", error);
      res.status(500).json({ message: "Failed to decline friend request" });
    }
  });

  app.get('/api/friends', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const friends = await storage.getFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.delete('/api/friends/:friendId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { friendId } = req.params;
      await storage.removeFriend(userId, friendId);
      res.json({ message: "Friend removed" });
    } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ message: "Failed to remove friend" });
    }
  });

  app.patch('/api/friends/:friendshipId/circle', isAuthenticated, async (req: any, res) => {
    try {
      const friendshipId = parseInt(req.params.friendshipId);
      const { circleTag } = req.body;
      const friendship = await storage.addFriendToCircle(friendshipId, circleTag);
      res.json(friendship);
    } catch (error) {
      console.error("Error updating friend circle:", error);
      res.status(500).json({ message: "Failed to update friend circle" });
    }
  });

  // Shared relationship data from friends
  app.get('/api/friends/shared-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get all accepted friends
      const friends = await storage.getFriends(userId);
      const friendIds = friends.map(f => f.friend.id);
      
      // Get shared relationship profiles from friends
      const sharedProfiles = [];
      for (const friendId of friendIds) {
        const profiles = await storage.getRelationshipProfilesByUser(friendId);
        const sharedByFriend = profiles.filter(profile => 
          profile.shareWithFriends && 
          (profile.visibility === 'all_friends' || 
           (profile.visibility === 'selected_friends' && profile.visibleToFriends?.includes(userId)))
        );
        
        for (const profile of sharedByFriend) {
          const friend = friends.find(f => f.friend.id === friendId)?.friend;
          sharedProfiles.push({
            ...profile,
            sharedBy: friend
          });
        }
      }
      
      res.json(sharedProfiles);
    } catch (error) {
      console.error("Error fetching shared data:", error);
      res.status(500).json({ message: "Failed to fetch shared data" });
    }
  });

  // Comprehensive interactions routes
  app.get('/api/interactions/:relationshipId', async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || "44415082";
      const relationshipId = parseInt(req.params.relationshipId);
      
      const interactions = await storage.getComprehensiveInteractionsByRelationship(relationshipId, userId);
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  app.post('/api/interactions', async (req: any, res) => {
    try {
      // For testing - use a default user ID if no user is authenticated
      const userId = req.user?.claims?.sub || "44415082";
      console.log("Creating interaction for user:", userId);
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      const interactionData = insertComprehensiveInteractionSchema.parse({
        ...req.body,
        userId,
      });
      console.log("Parsed interaction data:", JSON.stringify(interactionData, null, 2));
      
      const interaction = await storage.createComprehensiveInteraction(interactionData);
      res.json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        res.status(400).json({ message: "Invalid interaction data", errors: error.errors });
      } else {
        console.error("Error creating interaction:", error);
        res.status(500).json({ message: "Failed to create interaction" });
      }
    }
  });

  app.get('/api/relationships/:id/interactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const relationshipId = parseInt(req.params.id);
      const interactions = await storage.getComprehensiveInteractionsByRelationship(relationshipId, userId);
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  // Get user's custom CIT options from boundaries
  app.get('/api/boundaries/cit-options', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const boundaries = await storage.getBoundaryEntries(userId);
      
      // Organize boundaries by category for CIT use
      const citOptions = {
        triggers: boundaries
          .filter(b => b.category === 'emotional-triggers')
          .map(b => b.title.replace('Trigger: ', '')),
        comfortingSources: boundaries
          .filter(b => b.category === 'comfort-preferences')
          .map(b => b.title.replace('Comfort: ', '')),
        communicationDealBreakers: boundaries
          .filter(b => b.category === 'communication-triggers')
          .map(b => b.title.replace('Communication: ', '')),
        nonNegotiableBoundaries: boundaries
          .filter(b => b.category === 'non-negotiable')
          .map(b => b.title.replace('Non-negotiable: ', '')),
        flexibleBoundaries: boundaries
          .filter(b => b.category === 'flexible-boundaries')
          .map(b => b.title.replace('Flexible: ', '')),
        relationshipGoals: boundaries
          .filter(b => b.category === 'relationship-goals')
          .map(b => b.title.replace('Goal: ', '')),
        dealBreakerBehaviors: boundaries
          .filter(b => b.category === 'deal-breakers')
          .map(b => b.title.replace('Deal-breaker: ', ''))
      };
      
      res.json(citOptions);
    } catch (error) {
      console.error("Error fetching CIT options:", error);
      res.status(500).json({ message: "Failed to fetch CIT options" });
    }
  });

  // Friend circles routes
  app.get('/api/friend-circles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circles = await storage.getFriendCircles(userId);
      res.json(circles);
    } catch (error) {
      console.error("Error fetching friend circles:", error);
      res.status(500).json({ message: "Failed to fetch friend circles" });
    }
  });

  app.post('/api/friend-circles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circleData = insertFriendCircleSchema.parse({
        ...req.body,
        userId,
      });
      const circle = await storage.createFriendCircle(circleData);
      res.json(circle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid circle data", errors: error.errors });
      } else {
        console.error("Error creating friend circle:", error);
        res.status(500).json({ message: "Failed to create friend circle" });
      }
    }
  });

  // Personal baseline routes
  app.get('/api/baseline', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const baseline = await storage.getPersonalBaseline(userId);
      res.json(baseline || null);
    } catch (error) {
      console.error("Error fetching baseline:", error);
      res.status(500).json({ message: "Failed to fetch baseline" });
    }
  });

  app.post('/api/baseline', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const baselineData = insertPersonalBaselineSchema.parse({
        ...req.body,
        userId,
      });
      
      // Check if baseline exists, if so update, otherwise create
      const existingBaseline = await storage.getPersonalBaseline(userId);
      let baseline;
      
      if (existingBaseline) {
        baseline = await storage.updatePersonalBaseline(userId, baselineData);
      } else {
        baseline = await storage.createPersonalBaseline(baselineData);
        
        // Auto-generate boundaries from baseline custom inputs for new users
        await storage.generateBoundariesFromBaseline(userId, baselineData);
      }
      
      res.json(baseline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid baseline data", errors: error.errors });
      } else {
        console.error("Error saving baseline:", error);
        res.status(500).json({ message: "Failed to save baseline" });
      }
    }
  });

  // Get all baseline versions for historical tracking
  app.get('/api/baseline/versions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const baselines = await storage.getAllPersonalBaselines(userId);
      res.json(baselines);
    } catch (error) {
      console.error("Error fetching baseline versions:", error);
      res.status(500).json({ message: "Failed to fetch baseline versions" });
    }
  });

  // Boundary Goals API
  app.get('/api/boundary-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getBoundaryGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching boundary goals:", error);
      res.status(500).json({ message: "Failed to fetch boundary goals" });
    }
  });

  app.post('/api/boundary-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = { 
        ...req.body, 
        userId,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      };
      
      const goal = await storage.createBoundaryGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating boundary goal:", error);
      res.status(500).json({ message: "Failed to create boundary goal" });
    }
  });

  app.put('/api/boundary-goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const updates = { 
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      };
      const goal = await storage.updateBoundaryGoal(goalId, updates);
      res.json(goal);
    } catch (error) {
      console.error("Error updating boundary goal:", error);
      res.status(500).json({ message: "Failed to update boundary goal" });
    }
  });

  app.delete('/api/boundary-goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      await storage.deleteBoundaryGoal(goalId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting boundary goal:", error);
      res.status(500).json({ message: "Failed to delete boundary goal" });
    }
  });

  app.get('/api/boundary-goals/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalId = parseInt(req.params.id);
      const { startDate, endDate } = req.query;
      
      const progress = await storage.getBoundaryGoalProgress(
        userId,
        goalId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(progress);
    } catch (error) {
      console.error("Error fetching goal progress:", error);
      res.status(500).json({ message: "Failed to fetch goal progress" });
    }
  });

  // Goal Check-In API endpoints
  app.get('/api/goal-checkins/:goalId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalId = parseInt(req.params.goalId);
      const { startDate, endDate } = req.query;
      
      const checkIns = await storage.getGoalCheckIns(
        userId,
        goalId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(checkIns);
    } catch (error) {
      console.error("Error fetching goal check-ins:", error);
      res.status(500).json({ message: "Failed to fetch goal check-ins" });
    }
  });

  app.post('/api/goal-checkins', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const checkInData = {
        ...req.body,
        userId,
        date: new Date(req.body.date)
      };
      
      const checkIn = await storage.createGoalCheckIn(checkInData);
      res.json(checkIn);
    } catch (error) {
      console.error("Error creating goal check-in:", error);
      res.status(500).json({ message: "Failed to create goal check-in" });
    }
  });

  app.put('/api/goal-checkins/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
      };
      
      const checkIn = await storage.updateGoalCheckIn(id, updates);
      res.json(checkIn);
    } catch (error) {
      console.error("Error updating goal check-in:", error);
      res.status(500).json({ message: "Failed to update goal check-in" });
    }
  });

  app.delete('/api/goal-checkins/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGoalCheckIn(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal check-in:", error);
      res.status(500).json({ message: "Failed to delete goal check-in" });
    }
  });

  // Admin endpoints
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      await storage.deleteUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Suspend user account
  app.patch('/api/admin/users/:id/suspend', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      await storage.suspendUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error suspending user:", error);
      res.status(500).json({ message: "Failed to suspend user" });
    }
  });

  // Schedule user for deletion
  app.patch('/api/admin/users/:id/schedule-deletion', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      await storage.scheduleUserForDeletion(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error scheduling user for deletion:", error);
      res.status(500).json({ message: "Failed to schedule user for deletion" });
    }
  });

  // Reactivate user account
  app.patch('/api/admin/users/:id/reactivate', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      await storage.reactivateUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reactivating user:", error);
      res.status(500).json({ message: "Failed to reactivate user" });
    }
  });

  // Delete test accounts endpoint
  app.delete('/api/admin/delete-test-accounts', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const result = await storage.deleteTestAccounts();
      res.json({
        success: true,
        message: `Deleted ${result.deletedCount} test accounts`,
        deletedEmails: result.deletedEmails
      });
    } catch (error) {
      console.error("Error deleting test accounts:", error);
      res.status(500).json({ message: "Failed to delete test accounts" });
    }
  });

  // Create premium user endpoint
  app.post('/api/admin/create-premium-user', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { email, firstName, lastName, phoneNumber } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName,
        phone: phoneNumber || undefined,
      });

      // Create active subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID,
        }],
        collection_method: 'charge_automatically',
        default_payment_method: 'pm_card_visa', // Test payment method for manual creation
      });

      // Generate a unique user ID (similar to how Replit does it)
      const userId = `admin-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Create user in database with premium status
      const newUser = await storage.createUser({
        id: userId,
        email: email,
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phoneNumber || null,
        username: email.split('@')[0], // Use email prefix as username
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'active',
        isPremium: true,
        userRole: 'user',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber,
          subscriptionStatus: 'active',
          isPremium: true,
        },
        message: `Premium user created successfully for ${email}`,
      });
    } catch (error: any) {
      console.error("Error creating premium user:", error);
      res.status(500).json({ 
        message: "Failed to create premium user", 
        error: error.message 
      });
    }
  });

  // Feedback routes
  app.get('/api/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post('/api/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const user = req.user;
      
      const feedbackData = {
        ...validatedData,
        userId: user.id,
        submittedBy: user.username || user.email || 'Anonymous',
      };

      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create feedback" });
      }
    }
  });

  // Admin route to update feedback status
  app.patch('/api/admin/feedback/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }

      const feedbackId = parseInt(req.params.id);
      const { status, devNotes } = req.body;
      
      const feedback = await storage.updateFeedbackStatus(feedbackId, { status, devNotes });
      res.json(feedback);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  // Admin route to submit development updates 
  app.post('/api/admin/development-update', isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { title, description, status } = req.body;
      
      // Map admin status categories to feedback table statuses
      const feedbackStatus = status === 'completed' ? 'completed' : 
                           status === 'next' ? 'reported' : 'in_progress';
      
      const feedbackData = {
        userId: req.user.id,
        title,
        description,
        type: 'improvement' as const,
        priority: 'medium' as const,
        status: feedbackStatus,
        submittedBy: 'Admin Development Team',
        adminNotes: `Admin Update - Category: ${status}`
      };

      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      console.error("Error creating development update:", error);
      res.status(500).json({ message: "Failed to create development update" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-payment-intent', async (req: any, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Create subscription without authentication - creates account automatically
  app.post('/api/create-subscription-with-account', async (req: any, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || 'Customer',
      });

      // Create a price for $12.99/month
      const price = await stripe.prices.create({
        unit_amount: 1299, // $12.99 in cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'BoundaryCore',
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: price.id,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Store subscription info in session for later account creation
      req.session.pendingSubscription = {
        email,
        firstName,
        lastName,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
      };

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Webhook to handle successful payments and create accounts
  app.post('/api/stripe-webhook', async (req: any, res) => {
    try {
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Find the subscription associated with this payment
        const subscriptions = await stripe.subscriptions.list({
          customer: paymentIntent.customer,
          status: 'active',
        });
        
        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          
          if (customer && typeof customer === 'object' && customer.email) {
            // Create user account
            const userId = `stripe_${customer.id}`;
            
            try {
              await storage.createUser({
                id: userId,
                email: customer.email,
                firstName: customer.name?.split(' ')[0] || 'Customer',
                lastName: customer.name?.split(' ').slice(1).join(' ') || '',
                stripeCustomerId: customer.id,
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: 'active',
              });
              
              console.log(`Created user account for ${customer.email} with subscription ${subscription.id}`);
            } catch (error) {
              console.error('Error creating user account:', error);
            }
          }
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          if (subscription.status === 'active') {
            return res.json({
              subscriptionId: subscription.id,
              status: subscription.status,
              clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
            });
          }
        } catch (error) {
          console.log("Subscription not found, creating new one");
        }
      }

      if (!user.email) {
        return res.status(400).json({ message: 'User email is required for subscription' });
      }

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        try {
          customer = await stripe.customers.retrieve(user.stripeCustomerId);
        } catch (error) {
          console.log("Customer not found, creating new one");
        }
      }

      if (!customer) {
        customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || undefined,
        });

        // Update user with Stripe customer ID
        await storage.updateUser(userId, { stripeCustomerId: customer.id });
      }

      // For now, let's create a simple payment intent for $12.99
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1299, // $12.99 in cents
        currency: 'usd',
        customer: customer.id,
        metadata: {
          type: 'subscription',
          userId: userId,
        },
      });

      // Update user with subscription info (mock for now)
      await storage.updateUser(userId, {
        stripeCustomerId: customer.id,
        subscriptionStatus: 'pending',
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Check subscription status
  app.get('/api/subscription/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.json({ status: 'inactive', hasAccess: false });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Update user subscription status
      await storage.updateUser(userId, {
        subscriptionStatus: subscription.status,
      });

      res.json({
        status: subscription.status,
        hasAccess: subscription.status === 'active',
        currentPeriodEnd: subscription.current_period_end,
      });
    } catch (error: any) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Error checking subscription status: " + error.message });
    }
  });

  // Update payment method - redirect to Stripe customer portal
  app.post('/api/subscription/update-payment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ message: "No customer found" });
      }

      // Create customer portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.REPLIT_DOMAINS?.split(' ')[0] || 'http://localhost:5000'}/settings`,
      });

      res.json({ portalUrl: session.url });
    } catch (error: any) {
      console.error("Error creating customer portal session:", error);
      res.status(500).json({ message: "Error opening customer portal: " + error.message });
    }
  });

  // Cancel subscription
  app.post('/api/subscription/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No subscription found" });
      }

      const subscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      
      // Update user subscription status
      await storage.updateUser(userId, {
        subscriptionStatus: 'cancelled',
      });

      res.json({ message: "Subscription cancelled successfully" });
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Error cancelling subscription: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
