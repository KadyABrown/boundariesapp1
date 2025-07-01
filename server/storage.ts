import {
  users,
  boundaries,
  boundaryEntries,
  reflectionEntries,
  userSettings,
  relationshipProfiles,
  emotionalCheckIns,
  behavioralFlags,
  flagExamples,
  userSavedFlags,
  friendships,
  friendCircles,
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
  type FlagExample,
  type InsertFlagExample,
  type UserSavedFlag,
  type InsertUserSavedFlag,
  type Friendship,
  type InsertFriendship,
  type FriendCircle,
  type InsertFriendCircle,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count, or, like } from "drizzle-orm";

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
  
  // Flag Example Bank operations
  createFlagExample(example: InsertFlagExample): Promise<FlagExample>;
  getAllFlagExamples(): Promise<FlagExample[]>;
  getFlagExamplesByType(flagType: string): Promise<FlagExample[]>;
  getFlagExamplesByTheme(theme: string): Promise<FlagExample[]>;
  searchFlagExamples(query: string): Promise<FlagExample[]>;
  updateFlagExample(id: number, updates: Partial<InsertFlagExample>): Promise<FlagExample>;
  deleteFlagExample(id: number): Promise<void>;
  getPairedFlagsByTheme(): Promise<Array<{
    theme: string;
    greenFlag?: FlagExample;
    redFlag?: FlagExample;
  }>>;
  
  // User saved flags operations
  saveFlag(userId: string, flagExampleId: number, notes?: string): Promise<UserSavedFlag>;
  getUserSavedFlags(userId: string): Promise<UserSavedFlag[]>;
  removeSavedFlag(userId: string, flagExampleId: number): Promise<void>;
  updateSavedFlagNotes(id: number, notes: string): Promise<UserSavedFlag>;
  
  // Friend system operations
  sendFriendRequest(requesterId: string, receiverId: string, circleTag?: string): Promise<Friendship>;
  acceptFriendRequest(friendshipId: number): Promise<Friendship>;
  declineFriendRequest(friendshipId: number): Promise<void>;
  blockUser(userId: string, blockedUserId: string): Promise<Friendship>;
  unblockUser(userId: string, unblockUserId: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  getFriends(userId: string): Promise<Array<Friendship & { friend: User }>>;
  getFriendRequests(userId: string, type: 'sent' | 'received'): Promise<Array<Friendship & { user: User }>>;
  searchUsers(query: string, searchBy: 'username' | 'email' | 'phone'): Promise<User[]>;
  
  // Friend circles operations
  createFriendCircle(circle: InsertFriendCircle): Promise<FriendCircle>;
  getFriendCircles(userId: string): Promise<FriendCircle[]>;
  updateFriendCircle(id: number, updates: Partial<InsertFriendCircle>): Promise<FriendCircle>;
  deleteFriendCircle(id: number): Promise<void>;
  addFriendToCircle(friendshipId: number, circleTag: string): Promise<Friendship>;
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

  // Flag Example Bank operations
  async createFlagExample(example: InsertFlagExample): Promise<FlagExample> {
    const [created] = await db
      .insert(flagExamples)
      .values(example)
      .returning();
    return created;
  }

  async getAllFlagExamples(): Promise<FlagExample[]> {
    return await db
      .select()
      .from(flagExamples)
      .where(eq(flagExamples.isActive, true))
      .orderBy(flagExamples.theme, flagExamples.flagType);
  }

  async getFlagExamplesByType(flagType: string): Promise<FlagExample[]> {
    return await db
      .select()
      .from(flagExamples)
      .where(and(
        eq(flagExamples.flagType, flagType),
        eq(flagExamples.isActive, true)
      ))
      .orderBy(flagExamples.theme);
  }

  async getFlagExamplesByTheme(theme: string): Promise<FlagExample[]> {
    return await db
      .select()
      .from(flagExamples)
      .where(and(
        eq(flagExamples.theme, theme),
        eq(flagExamples.isActive, true)
      ))
      .orderBy(flagExamples.flagType);
  }

  async searchFlagExamples(query: string): Promise<FlagExample[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(flagExamples)
      .where(and(
        eq(flagExamples.isActive, true),
        sql`(
          lower(${flagExamples.title}) LIKE ${searchTerm} OR
          lower(${flagExamples.description}) LIKE ${searchTerm} OR
          lower(${flagExamples.theme}) LIKE ${searchTerm} OR
          lower(${flagExamples.exampleScenario}) LIKE ${searchTerm}
        )`
      ))
      .orderBy(flagExamples.theme, flagExamples.flagType);
  }

  async updateFlagExample(id: number, updates: Partial<InsertFlagExample>): Promise<FlagExample> {
    const [updated] = await db
      .update(flagExamples)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(flagExamples.id, id))
      .returning();
    return updated;
  }

  async deleteFlagExample(id: number): Promise<void> {
    await db
      .update(flagExamples)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(flagExamples.id, id));
  }

  // User saved flags operations
  async saveFlag(userId: string, flagExampleId: number, notes?: string): Promise<UserSavedFlag> {
    const [saved] = await db
      .insert(userSavedFlags)
      .values({
        userId,
        flagExampleId,
        personalNotes: notes || null,
      })
      .returning();
    return saved;
  }

  async getUserSavedFlags(userId: string): Promise<UserSavedFlag[]> {
    return await db
      .select()
      .from(userSavedFlags)
      .where(eq(userSavedFlags.userId, userId))
      .orderBy(desc(userSavedFlags.createdAt));
  }

  async removeSavedFlag(userId: string, flagExampleId: number): Promise<void> {
    await db
      .delete(userSavedFlags)
      .where(and(
        eq(userSavedFlags.userId, userId),
        eq(userSavedFlags.flagExampleId, flagExampleId)
      ));
  }

  async updateSavedFlagNotes(id: number, notes: string): Promise<UserSavedFlag> {
    const [updated] = await db
      .update(userSavedFlags)
      .set({ personalNotes: notes })
      .where(eq(userSavedFlags.id, id))
      .returning();
    return updated;
  }

  async getPairedFlagsByTheme(): Promise<Array<{
    theme: string;
    greenFlag?: FlagExample;
    redFlag?: FlagExample;
  }>> {
    const allFlags = await db.select().from(flagExamples).orderBy(flagExamples.theme, flagExamples.createdAt);
    
    // Group flags by theme and try to pair them based on similar descriptions or creation time
    const flagsByTheme = new Map<string, FlagExample[]>();
    
    for (const flag of allFlags) {
      const theme = flag.theme || 'general';
      if (!flagsByTheme.has(theme)) {
        flagsByTheme.set(theme, []);
      }
      flagsByTheme.get(theme)!.push(flag);
    }
    
    const pairedFlags: Array<{ theme: string; greenFlag?: FlagExample; redFlag?: FlagExample }> = [];
    
    // For each theme, try to pair green and red flags
    for (const [theme, flags] of flagsByTheme.entries()) {
      const greenFlags = flags.filter(f => f.flagType === 'green');
      const redFlags = flags.filter(f => f.flagType === 'red');
      
      // If we have both green and red flags for this theme, pair them
      if (greenFlags.length > 0 && redFlags.length > 0) {
        // For now, pair the first green with first red for each theme
        // In future, we could improve this with better matching logic
        pairedFlags.push({
          theme,
          greenFlag: greenFlags[0],
          redFlag: redFlags[0]
        });
      } else if (greenFlags.length > 0) {
        // Only green flag available
        pairedFlags.push({
          theme,
          greenFlag: greenFlags[0],
          redFlag: undefined
        });
      } else if (redFlags.length > 0) {
        // Only red flag available
        pairedFlags.push({
          theme,
          greenFlag: undefined,
          redFlag: redFlags[0]
        });
      }
    }
    
    return pairedFlags;
  }

  // Friend system operations
  async sendFriendRequest(requesterId: string, receiverId: string, circleTag?: string): Promise<Friendship> {
    const [friendship] = await db
      .insert(friendships)
      .values({
        requesterId,
        receiverId,
        status: 'pending',
        circleTag
      })
      .returning();
    return friendship;
  }

  async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    const [friendship] = await db
      .update(friendships)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(friendships.id, friendshipId))
      .returning();
    return friendship;
  }

  async declineFriendRequest(friendshipId: number): Promise<void> {
    await db
      .delete(friendships)
      .where(eq(friendships.id, friendshipId));
  }

  async blockUser(userId: string, blockedUserId: string): Promise<Friendship> {
    const [friendship] = await db
      .insert(friendships)
      .values({
        requesterId: userId,
        receiverId: blockedUserId,
        status: 'blocked'
      })
      .onConflictDoUpdate({
        target: [friendships.requesterId, friendships.receiverId],
        set: { status: 'blocked', updatedAt: new Date() }
      })
      .returning();
    return friendship;
  }

  async unblockUser(userId: string, unblockUserId: string): Promise<void> {
    await db
      .delete(friendships)
      .where(
        and(
          eq(friendships.requesterId, userId),
          eq(friendships.receiverId, unblockUserId),
          eq(friendships.status, 'blocked')
        )
      );
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    await db
      .delete(friendships)
      .where(
        or(
          and(
            eq(friendships.requesterId, userId),
            eq(friendships.receiverId, friendId)
          ),
          and(
            eq(friendships.requesterId, friendId),
            eq(friendships.receiverId, userId)
          )
        )
      );
  }

  async getFriends(userId: string): Promise<Array<Friendship & { friend: User }>> {
    const friendsAsRequester = await db
      .select({
        id: friendships.id,
        requesterId: friendships.requesterId,
        receiverId: friendships.receiverId,
        status: friendships.status,
        circleTag: friendships.circleTag,
        createdAt: friendships.createdAt,
        updatedAt: friendships.updatedAt,
        friend: users
      })
      .from(friendships)
      .innerJoin(users, eq(users.id, friendships.receiverId))
      .where(
        and(
          eq(friendships.requesterId, userId),
          eq(friendships.status, 'accepted')
        )
      );

    const friendsAsReceiver = await db
      .select({
        id: friendships.id,
        requesterId: friendships.requesterId,
        receiverId: friendships.receiverId,
        status: friendships.status,
        circleTag: friendships.circleTag,
        createdAt: friendships.createdAt,
        updatedAt: friendships.updatedAt,
        friend: users
      })
      .from(friendships)
      .innerJoin(users, eq(users.id, friendships.requesterId))
      .where(
        and(
          eq(friendships.receiverId, userId),
          eq(friendships.status, 'accepted')
        )
      );

    return [...friendsAsRequester, ...friendsAsReceiver];
  }

  async getFriendRequests(userId: string, type: 'sent' | 'received'): Promise<Array<Friendship & { user: User }>> {
    if (type === 'sent') {
      return await db
        .select({
          id: friendships.id,
          requesterId: friendships.requesterId,
          receiverId: friendships.receiverId,
          status: friendships.status,
          circleTag: friendships.circleTag,
          createdAt: friendships.createdAt,
          updatedAt: friendships.updatedAt,
          user: users
        })
        .from(friendships)
        .innerJoin(users, eq(users.id, friendships.receiverId))
        .where(
          and(
            eq(friendships.requesterId, userId),
            eq(friendships.status, 'pending')
          )
        );
    } else {
      return await db
        .select({
          id: friendships.id,
          requesterId: friendships.requesterId,
          receiverId: friendships.receiverId,
          status: friendships.status,
          circleTag: friendships.circleTag,
          createdAt: friendships.createdAt,
          updatedAt: friendships.updatedAt,
          user: users
        })
        .from(friendships)
        .innerJoin(users, eq(users.id, friendships.requesterId))
        .where(
          and(
            eq(friendships.receiverId, userId),
            eq(friendships.status, 'pending')
          )
        );
    }
  }

  async searchUsers(query: string, searchBy: 'username' | 'email' | 'phone'): Promise<User[]> {
    let whereClause;
    
    switch (searchBy) {
      case 'username':
        whereClause = like(users.username, `%${query}%`);
        break;
      case 'email':
        whereClause = like(users.email, `%${query}%`);
        break;
      case 'phone':
        whereClause = like(users.phoneNumber, `%${query}%`);
        break;
      default:
        return [];
    }

    return await db
      .select()
      .from(users)
      .where(whereClause)
      .limit(10);
  }

  // Friend circles operations
  async createFriendCircle(circle: InsertFriendCircle): Promise<FriendCircle> {
    const [created] = await db
      .insert(friendCircles)
      .values(circle)
      .returning();
    return created;
  }

  async getFriendCircles(userId: string): Promise<FriendCircle[]> {
    return await db
      .select()
      .from(friendCircles)
      .where(eq(friendCircles.userId, userId))
      .orderBy(desc(friendCircles.createdAt));
  }

  async updateFriendCircle(id: number, updates: Partial<InsertFriendCircle>): Promise<FriendCircle> {
    const [updated] = await db
      .update(friendCircles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(friendCircles.id, id))
      .returning();
    return updated;
  }

  async deleteFriendCircle(id: number): Promise<void> {
    await db
      .delete(friendCircles)
      .where(eq(friendCircles.id, id));
  }

  async addFriendToCircle(friendshipId: number, circleTag: string): Promise<Friendship> {
    const [updated] = await db
      .update(friendships)
      .set({ circleTag, updatedAt: new Date() })
      .where(eq(friendships.id, friendshipId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
