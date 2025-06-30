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
  insertFlagExampleSchema,
  insertUserSavedFlagSchema,
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

  const httpServer = createServer(app);
  return httpServer;
}
