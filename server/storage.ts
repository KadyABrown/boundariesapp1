import {
  users,
  boundaries,
  boundaryEntries,
  reflectionEntries,
  userSettings,
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
}

export const storage = new DatabaseStorage();
