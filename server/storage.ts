import {
  users,
  boundaries,
  boundaryEntries,
  reflectionEntries,
  userSettings,
  relationshipProfiles,
  emotionalCheckIns,
  behavioralFlags,
  type User,
  type UpsertUser,
  type Boundary,
  type InsertBoundary,
  type BoundaryEntry,
  type InsertBoundaryEntry,
  type ReflectionEntry,
  type InsertReflectionEntry,
  type UserSettings,
  type InsertUserSettings,
  type RelationshipProfile,
  type InsertRelationshipProfile,
  type EmotionalCheckIn,
  type InsertEmotionalCheckIn,
  type BehavioralFlag,
  type InsertBehavioralFlag,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Boundary operations
  createBoundary(boundary: InsertBoundary): Promise<Boundary>;
  getBoundariesByUser(userId: string): Promise<Boundary[]>;
  updateBoundary(id: number, updates: Partial<InsertBoundary>): Promise<Boundary>;
  deleteBoundary(id: number): Promise<void>;
  
  // Boundary entry operations
  createBoundaryEntry(entry: InsertBoundaryEntry): Promise<BoundaryEntry>;
  getBoundaryEntriesByUser(userId: string, limit?: number): Promise<BoundaryEntry[]>;
  getBoundaryEntriesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<BoundaryEntry[]>;
  
  // Reflection operations
  createReflectionEntry(entry: InsertReflectionEntry): Promise<ReflectionEntry>;
  getReflectionEntriesByUser(userId: string, limit?: number): Promise<ReflectionEntry[]>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  
  // Analytics operations
  getDashboardStats(userId: string): Promise<{
    todayEntries: number;
    todayRespected: number;
    todayChallenged: number;
    weeklyRespected: number;
    weeklyTotal: number;
    averageMood: number;
  }>;
  
  // Relationship profile operations
  createRelationshipProfile(profile: InsertRelationshipProfile): Promise<RelationshipProfile>;
  getRelationshipProfilesByUser(userId: string): Promise<RelationshipProfile[]>;
  getRelationshipProfile(id: number): Promise<RelationshipProfile | undefined>;
  updateRelationshipProfile(id: number, updates: Partial<InsertRelationshipProfile>): Promise<RelationshipProfile>;
  deleteRelationshipProfile(id: number): Promise<void>;
  
  // Emotional check-in operations
  createEmotionalCheckIn(checkIn: InsertEmotionalCheckIn): Promise<EmotionalCheckIn>;
  getEmotionalCheckInsByProfile(profileId: number): Promise<EmotionalCheckIn[]>;
  getEmotionalCheckInsByUser(userId: string): Promise<EmotionalCheckIn[]>;
  
  // Behavioral flag operations
  createBehavioralFlag(flag: InsertBehavioralFlag): Promise<BehavioralFlag>;
  getBehavioralFlagsByProfile(profileId: number): Promise<BehavioralFlag[]>;
  updateBehavioralFlag(id: number, updates: Partial<InsertBehavioralFlag>): Promise<BehavioralFlag>;
  deleteBehavioralFlag(id: number): Promise<void>;
  getRelationshipStats(profileId: number): Promise<{
    greenFlags: number;
    redFlags: number;
    averageSafetyRating: number;
    checkInCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Boundary operations
  async createBoundary(boundary: InsertBoundary): Promise<Boundary> {
    const [created] = await db
      .insert(boundaries)
      .values(boundary)
      .returning();
    return created;
  }

  async getBoundariesByUser(userId: string): Promise<Boundary[]> {
    return await db
      .select()
      .from(boundaries)
      .where(eq(boundaries.userId, userId))
      .orderBy(desc(boundaries.createdAt));
  }

  async updateBoundary(id: number, updates: Partial<InsertBoundary>): Promise<Boundary> {
    const [updated] = await db
      .update(boundaries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(boundaries.id, id))
      .returning();
    return updated;
  }

  async deleteBoundary(id: number): Promise<void> {
    await db.delete(boundaries).where(eq(boundaries.id, id));
  }

  // Boundary entry operations
  async createBoundaryEntry(entry: InsertBoundaryEntry): Promise<BoundaryEntry> {
    const [created] = await db
      .insert(boundaryEntries)
      .values(entry)
      .returning();
    return created;
  }

  async getBoundaryEntriesByUser(userId: string, limit = 50): Promise<BoundaryEntry[]> {
    return await db
      .select()
      .from(boundaryEntries)
      .where(eq(boundaryEntries.userId, userId))
      .orderBy(desc(boundaryEntries.createdAt))
      .limit(limit);
  }

  async getBoundaryEntriesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<BoundaryEntry[]> {
    return await db
      .select()
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          gte(boundaryEntries.createdAt, startDate),
          lte(boundaryEntries.createdAt, endDate)
        )
      )
      .orderBy(desc(boundaryEntries.createdAt));
  }

  // Reflection operations
  async createReflectionEntry(entry: InsertReflectionEntry): Promise<ReflectionEntry> {
    const [created] = await db
      .insert(reflectionEntries)
      .values(entry)
      .returning();
    return created;
  }

  async getReflectionEntriesByUser(userId: string, limit = 20): Promise<ReflectionEntry[]> {
    return await db
      .select()
      .from(reflectionEntries)
      .where(eq(reflectionEntries.userId, userId))
      .orderBy(desc(reflectionEntries.createdAt))
      .limit(limit);
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [upserted] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upserted;
  }

  // Analytics operations
  async getDashboardStats(userId: string): Promise<{
    todayEntries: number;
    todayRespected: number;
    todayChallenged: number;
    weeklyRespected: number;
    weeklyTotal: number;
    averageMood: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Today's stats
    const todayEntries = await db
      .select({ count: count() })
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          gte(boundaryEntries.createdAt, today),
          lte(boundaryEntries.createdAt, tomorrow)
        )
      );

    const todayRespected = await db
      .select({ count: count() })
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          eq(boundaryEntries.status, "respected"),
          gte(boundaryEntries.createdAt, today),
          lte(boundaryEntries.createdAt, tomorrow)
        )
      );

    const todayChallenged = await db
      .select({ count: count() })
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          eq(boundaryEntries.status, "challenged"),
          gte(boundaryEntries.createdAt, today),
          lte(boundaryEntries.createdAt, tomorrow)
        )
      );

    // Weekly stats
    const weeklyRespected = await db
      .select({ count: count() })
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          eq(boundaryEntries.status, "respected"),
          gte(boundaryEntries.createdAt, weekAgo)
        )
      );

    const weeklyTotal = await db
      .select({ count: count() })
      .from(boundaryEntries)
      .where(
        and(
          eq(boundaryEntries.userId, userId),
          gte(boundaryEntries.createdAt, weekAgo)
        )
      );

    // Average mood from reflections
    const moodData = await db
      .select({ avg: sql<number>`avg(${reflectionEntries.mood})` })
      .from(reflectionEntries)
      .where(
        and(
          eq(reflectionEntries.userId, userId),
          gte(reflectionEntries.createdAt, weekAgo)
        )
      );

    return {
      todayEntries: todayEntries[0]?.count || 0,
      todayRespected: todayRespected[0]?.count || 0,
      todayChallenged: todayChallenged[0]?.count || 0,
      weeklyRespected: weeklyRespected[0]?.count || 0,
      weeklyTotal: weeklyTotal[0]?.count || 0,
      averageMood: moodData[0]?.avg || 7.5,
    };
  }

  // Relationship profile operations
  async createRelationshipProfile(profile: InsertRelationshipProfile): Promise<RelationshipProfile> {
    const [created] = await db
      .insert(relationshipProfiles)
      .values(profile)
      .returning();
    return created;
  }

  async getRelationshipProfilesByUser(userId: string): Promise<RelationshipProfile[]> {
    return await db
      .select()
      .from(relationshipProfiles)
      .where(eq(relationshipProfiles.userId, userId))
      .orderBy(desc(relationshipProfiles.createdAt));
  }

  async getRelationshipProfile(id: number): Promise<RelationshipProfile | undefined> {
    const [profile] = await db
      .select()
      .from(relationshipProfiles)
      .where(eq(relationshipProfiles.id, id));
    return profile;
  }

  async updateRelationshipProfile(id: number, updates: Partial<InsertRelationshipProfile>): Promise<RelationshipProfile> {
    const [updated] = await db
      .update(relationshipProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(relationshipProfiles.id, id))
      .returning();
    return updated;
  }

  async deleteRelationshipProfile(id: number): Promise<void> {
    // Delete associated check-ins and flags first
    await db.delete(emotionalCheckIns).where(eq(emotionalCheckIns.profileId, id));
    await db.delete(behavioralFlags).where(eq(behavioralFlags.profileId, id));
    await db.delete(relationshipProfiles).where(eq(relationshipProfiles.id, id));
  }

  // Emotional check-in operations
  async createEmotionalCheckIn(checkIn: InsertEmotionalCheckIn): Promise<EmotionalCheckIn> {
    const [created] = await db
      .insert(emotionalCheckIns)
      .values(checkIn)
      .returning();
    return created;
  }

  async getEmotionalCheckInsByProfile(profileId: number): Promise<EmotionalCheckIn[]> {
    return await db
      .select()
      .from(emotionalCheckIns)
      .where(eq(emotionalCheckIns.profileId, profileId))
      .orderBy(desc(emotionalCheckIns.createdAt));
  }

  async getEmotionalCheckInsByUser(userId: string): Promise<EmotionalCheckIn[]> {
    return await db
      .select()
      .from(emotionalCheckIns)
      .where(eq(emotionalCheckIns.userId, userId))
      .orderBy(desc(emotionalCheckIns.createdAt));
  }

  // Behavioral flag operations
  async createBehavioralFlag(flag: InsertBehavioralFlag): Promise<BehavioralFlag> {
    const [created] = await db
      .insert(behavioralFlags)
      .values(flag)
      .returning();
    return created;
  }

  async getBehavioralFlagsByProfile(profileId: number): Promise<BehavioralFlag[]> {
    return await db
      .select()
      .from(behavioralFlags)
      .where(eq(behavioralFlags.profileId, profileId))
      .orderBy(desc(behavioralFlags.createdAt));
  }

  async updateBehavioralFlag(id: number, updates: Partial<InsertBehavioralFlag>): Promise<BehavioralFlag> {
    const [updated] = await db
      .update(behavioralFlags)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(behavioralFlags.id, id))
      .returning();
    return updated;
  }

  async deleteBehavioralFlag(id: number): Promise<void> {
    await db.delete(behavioralFlags).where(eq(behavioralFlags.id, id));
  }

  async getRelationshipStats(profileId: number): Promise<{
    greenFlags: number;
    redFlags: number;
    averageSafetyRating: number;
    checkInCount: number;
  }> {
    const greenFlags = await db
      .select({ count: count() })
      .from(behavioralFlags)
      .where(
        and(
          eq(behavioralFlags.profileId, profileId),
          eq(behavioralFlags.flagType, "green"),
          eq(behavioralFlags.isPresent, true)
        )
      );

    const redFlags = await db
      .select({ count: count() })
      .from(behavioralFlags)
      .where(
        and(
          eq(behavioralFlags.profileId, profileId),
          eq(behavioralFlags.flagType, "red"),
          eq(behavioralFlags.isPresent, true)
        )
      );

    const safetyData = await db
      .select({ avg: sql<number>`avg(${emotionalCheckIns.overallSafetyRating})` })
      .from(emotionalCheckIns)
      .where(eq(emotionalCheckIns.profileId, profileId));

    const checkInCount = await db
      .select({ count: count() })
      .from(emotionalCheckIns)
      .where(eq(emotionalCheckIns.profileId, profileId));

    return {
      greenFlags: greenFlags[0]?.count || 0,
      redFlags: redFlags[0]?.count || 0,
      averageSafetyRating: safetyData[0]?.avg || 0,
      checkInCount: checkInCount[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
