import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: varchar("username").unique(),
  phoneNumber: varchar("phone_number").unique(),
  profileImageUrl: varchar("profile_image_url"),
  userRole: varchar("user_role").default("standard"), // standard, therapist, guardian, minor
  notificationPreferences: jsonb("notification_preferences").default({ email: true, push: false }),
  defaultPrivacySetting: varchar("default_privacy_setting").default("private"), // private, friends_only, public
  bio: text("bio"),
  isProfileComplete: boolean("is_profile_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Boundary categories/definitions
export const boundaries = pgTable("boundaries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // work-life, social-media, personal-space, etc.
  importance: integer("importance").notNull().default(5), // 1-10 scale
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily boundary tracking entries
export const boundaryEntries = pgTable("boundary_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  boundaryId: integer("boundary_id"),
  category: varchar("category").notNull(),
  description: text("description").notNull(),
  emotionalImpact: varchar("emotional_impact").notNull(), // very-negative, negative, neutral, positive, very-positive
  status: varchar("status").notNull(), // respected, challenged, communicated, violated
  createdAt: timestamp("created_at").defaultNow(),
});

// Reflection journal entries
export const reflectionEntries = pgTable("reflection_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  prompt: text("prompt"),
  content: text("content").notNull(),
  mood: real("mood"), // 1-10 scale
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings and preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  dailyReminders: boolean("daily_reminders").notNull().default(true),
  weeklyReflections: boolean("weekly_reflections").notNull().default(true),
  progressUpdates: boolean("progress_updates").notNull().default(false),
  reminderTime: varchar("reminder_time").default("18:00"),
  timezone: varchar("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Friendship system
export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  requesterId: varchar("requester_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  status: varchar("status").notNull().default("requested"), // requested, accepted, blocked
  circleTag: varchar("circle_tag"), // optional grouping like "therapist", "trusted", etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Friend circles for organizing friends
export const friendCircles = pgTable("friend_circles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  color: varchar("color").default("#3B82F6"), // hex color for UI
  createdAt: timestamp("created_at").defaultNow(),
});

// Relationship profiles for dating behavior checklist
export const relationshipProfiles = pgTable("relationship_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  nickname: varchar("nickname"),
  relationshipType: varchar("relationship_type").notNull(), // romantic, platonic, situationship, family, workplace, other
  relationshipStatus: varchar("relationship_status"), // interested, mutual-interest, talking, flirting, etc.
  dateMet: timestamp("date_met"),
  howMet: varchar("how_met"), // app, social-media, irl, work, friends, other
  currentStatus: varchar("current_status").default("active"), // active, inactive, ended
  isPrivate: boolean("is_private").notNull().default(false),
  
  // Privacy & Sharing Controls
  shareWithFriends: boolean("share_with_friends").default(false),
  shareWithTherapist: boolean("share_with_therapist").default(false),
  silentEndNotification: boolean("silent_end_notification").default(false),
  flagVisibility: varchar("flag_visibility").default("private"), // private, friends, therapist
  
  // Enhanced Visibility Controls
  visibility: varchar("visibility").default("private"), // private, all_friends, selected_friends, therapist_only
  visibleToFriends: text("visible_to_friends").array().default([]), // array of friend IDs
  visibleToCircles: text("visible_to_circles").array().default([]), // array of circle IDs
  
  // Emotional Tracking Preferences
  enableEmotionalCheckins: boolean("enable_emotional_checkins").default(true),
  supportPrompts: text("support_prompts").array(), // boundaries, conversations, ending, journaling
  
  // Notes & Tags
  importantNotes: text("important_notes"),
  customTags: text("custom_tags").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emotional safety check-ins for relationships
export const emotionalCheckIns = pgTable("emotional_check_ins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  profileId: integer("profile_id").notNull(),
  feelSafeAndExcited: varchar("feel_safe_and_excited"), // yes, no, unsure
  feelSupported: varchar("feel_supported"), // yes, no, unsure
  emotionalToneChanged: varchar("emotional_tone_changed"), // yes, no, unsure
  overallSafetyRating: integer("overall_safety_rating"), // 1-10 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Behavioral flags for relationship tracking
export const behavioralFlags = pgTable("behavioral_flags", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  profileId: integer("profile_id").notNull(),
  flagCategory: varchar("flag_category").notNull(), // communication, respect, consistency, etc.
  flagName: varchar("flag_name").notNull(), // specific behavior
  flagType: varchar("flag_type").notNull(), // green, red
  isPresent: boolean("is_present").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Flag Example Bank - Master library of all flag definitions
export const flagExamples = pgTable("flag_examples", {
  id: serial("id").primaryKey(),
  flagType: varchar("flag_type", { length: 10 }).notNull(), // green, red
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  exampleScenario: text("example_scenario").notNull(),
  emotionalImpact: text("emotional_impact").notNull(),
  addressability: varchar("addressability", { length: 50 }).notNull(), // always_worth_addressing, sometimes_worth_addressing, dealbreaker
  actionSteps: text("action_steps").notNull(),
  theme: varchar("theme", { length: 100 }).notNull(), // trust, communication, reliability, emotional_safety, etc
  severity: varchar("severity", { length: 20 }).notNull(), // minor, moderate, dealbreaker
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User's saved flags from the example bank
export const userSavedFlags = pgTable("user_saved_flags", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  flagExampleId: integer("flag_example_id").notNull().references(() => flagExamples.id, { onDelete: "cascade" }),
  personalNotes: text("personal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comprehensive interaction tracking
export const comprehensiveInteractions = pgTable("comprehensive_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  relationshipId: integer("relationship_id").notNull().references(() => relationshipProfiles.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").defaultNow(),
  
  // Pre-interaction state
  energyBefore: integer("energy_before").notNull(), // 1-10
  moodBefore: varchar("mood_before", { length: 20 }).notNull(), // very-negative, negative, neutral, positive, very-positive
  anxietyBefore: integer("anxiety_before").notNull(), // 1-10
  selfWorthBefore: integer("self_worth_before").notNull(), // 1-10
  physicalStateBefore: jsonb("physical_state_before").default([]),
  emotionalWarningSignsPresent: jsonb("emotional_warning_signs_present").default([]),
  
  // Interaction details
  interactionType: varchar("interaction_type", { length: 100 }).notNull(),
  duration: integer("duration").notNull(), // minutes
  location: varchar("location", { length: 200 }),
  witnesses: boolean("witnesses").default(false),
  topicsDiscussed: jsonb("topics_discussed").default([]),
  boundariesTested: boolean("boundaries_tested").default(false),
  
  // Immediate post-interaction
  energyAfter: integer("energy_after").notNull(), // 1-10
  moodAfter: varchar("mood_after", { length: 20 }).notNull(),
  anxietyAfter: integer("anxiety_after").notNull(), // 1-10
  selfWorthAfter: integer("self_worth_after").notNull(), // 1-10
  physicalSymptomsAfter: jsonb("physical_symptoms_after").default([]),
  emotionalStateAfter: jsonb("emotional_state_after").default([]),
  
  // Recovery tracking
  recoveryTime: integer("recovery_time").notNull(), // minutes to feel normal
  recoveryStrategies: jsonb("recovery_strategies").default([]),
  whatHelped: jsonb("what_helped").default([]),
  whatMadeItWorse: jsonb("what_made_it_worse").default([]),
  
  // Resilience building
  boundariesMaintained: jsonb("boundaries_maintained").default([]),
  copingSkillsUsed: jsonb("coping_skills_used").default([]),
  supportSystemEngaged: boolean("support_system_engaged").default(false),
  selfAdvocacyActions: jsonb("self_advocacy_actions").default([]),
  
  // Reflection
  lessonsLearned: text("lessons_learned"),
  warningSignsNoticed: jsonb("warning_signs_noticed").default([]),
  futurePreparation: jsonb("future_preparation").default([]),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  boundaries: many(boundaries),
  boundaryEntries: many(boundaryEntries),
  reflectionEntries: many(reflectionEntries),
  settings: one(userSettings),
  relationshipProfiles: many(relationshipProfiles),
  emotionalCheckIns: many(emotionalCheckIns),
  behavioralFlags: many(behavioralFlags),
  savedFlags: many(userSavedFlags),
  sentFriendRequests: many(friendships, { relationName: "requester" }),
  receivedFriendRequests: many(friendships, { relationName: "receiver" }),
  friendCircles: many(friendCircles),
  comprehensiveInteractions: many(comprehensiveInteractions),
}));

export const boundariesRelations = relations(boundaries, ({ one, many }) => ({
  user: one(users, {
    fields: [boundaries.userId],
    references: [users.id],
  }),
  entries: many(boundaryEntries),
}));

export const boundaryEntriesRelations = relations(boundaryEntries, ({ one }) => ({
  user: one(users, {
    fields: [boundaryEntries.userId],
    references: [users.id],
  }),
  boundary: one(boundaries, {
    fields: [boundaryEntries.boundaryId],
    references: [boundaries.id],
  }),
}));

export const reflectionEntriesRelations = relations(reflectionEntries, ({ one }) => ({
  user: one(users, {
    fields: [reflectionEntries.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const relationshipProfilesRelations = relations(relationshipProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [relationshipProfiles.userId],
    references: [users.id],
  }),
  emotionalCheckIns: many(emotionalCheckIns),
  behavioralFlags: many(behavioralFlags),
  comprehensiveInteractions: many(comprehensiveInteractions),
}));

export const emotionalCheckInsRelations = relations(emotionalCheckIns, ({ one }) => ({
  user: one(users, {
    fields: [emotionalCheckIns.userId],
    references: [users.id],
  }),
  profile: one(relationshipProfiles, {
    fields: [emotionalCheckIns.profileId],
    references: [relationshipProfiles.id],
  }),
}));

export const behavioralFlagsRelations = relations(behavioralFlags, ({ one }) => ({
  user: one(users, {
    fields: [behavioralFlags.userId],
    references: [users.id],
  }),
  profile: one(relationshipProfiles, {
    fields: [behavioralFlags.profileId],
    references: [relationshipProfiles.id],
  }),
}));

export const flagExamplesRelations = relations(flagExamples, ({ many }) => ({
  savedByUsers: many(userSavedFlags),
}));

export const userSavedFlagsRelations = relations(userSavedFlags, ({ one }) => ({
  user: one(users, {
    fields: [userSavedFlags.userId],
    references: [users.id],
  }),
  flagExample: one(flagExamples, {
    fields: [userSavedFlags.flagExampleId],
    references: [flagExamples.id],
  }),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(users, {
    fields: [friendships.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  receiver: one(users, {
    fields: [friendships.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const friendCirclesRelations = relations(friendCircles, ({ one }) => ({
  user: one(users, {
    fields: [friendCircles.userId],
    references: [users.id],
  }),
}));

export const comprehensiveInteractionsRelations = relations(comprehensiveInteractions, ({ one }) => ({
  user: one(users, {
    fields: [comprehensiveInteractions.userId],
    references: [users.id],
  }),
  relationshipProfile: one(relationshipProfiles, {
    fields: [comprehensiveInteractions.relationshipId],
    references: [relationshipProfiles.id],
  }),
}));

// Schemas for validation
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertBoundarySchema = createInsertSchema(boundaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBoundary = z.infer<typeof insertBoundarySchema>;
export type Boundary = typeof boundaries.$inferSelect;

export const insertBoundaryEntrySchema = createInsertSchema(boundaryEntries).omit({
  id: true,
  createdAt: true,
});
export type InsertBoundaryEntry = z.infer<typeof insertBoundaryEntrySchema>;
export type BoundaryEntry = typeof boundaryEntries.$inferSelect;

export const insertReflectionEntrySchema = createInsertSchema(reflectionEntries).omit({
  id: true,
  createdAt: true,
});
export type InsertReflectionEntry = z.infer<typeof insertReflectionEntrySchema>;
export type ReflectionEntry = typeof reflectionEntries.$inferSelect;

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export const insertRelationshipProfileSchema = createInsertSchema(relationshipProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  dateMet: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});
export type InsertRelationshipProfile = z.infer<typeof insertRelationshipProfileSchema>;
export type RelationshipProfile = typeof relationshipProfiles.$inferSelect;

export const insertEmotionalCheckInSchema = createInsertSchema(emotionalCheckIns).omit({
  id: true,
  createdAt: true,
});
export type InsertEmotionalCheckIn = z.infer<typeof insertEmotionalCheckInSchema>;
export type EmotionalCheckIn = typeof emotionalCheckIns.$inferSelect;

export const insertBehavioralFlagSchema = createInsertSchema(behavioralFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBehavioralFlag = z.infer<typeof insertBehavioralFlagSchema>;
export type BehavioralFlag = typeof behavioralFlags.$inferSelect;

export const insertFlagExampleSchema = createInsertSchema(flagExamples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFlagExample = z.infer<typeof insertFlagExampleSchema>;
export type FlagExample = typeof flagExamples.$inferSelect;

export const insertUserSavedFlagSchema = createInsertSchema(userSavedFlags).omit({
  id: true,
  createdAt: true,
});
export type InsertUserSavedFlag = z.infer<typeof insertUserSavedFlagSchema>;
export type UserSavedFlag = typeof userSavedFlags.$inferSelect;

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export const insertFriendCircleSchema = createInsertSchema(friendCircles).omit({
  id: true,
  createdAt: true,
});
export type InsertFriendCircle = z.infer<typeof insertFriendCircleSchema>;
export type FriendCircle = typeof friendCircles.$inferSelect;

export const insertComprehensiveInteractionSchema = createInsertSchema(comprehensiveInteractions).omit({
  id: true,
  createdAt: true,
});
export type InsertComprehensiveInteraction = z.infer<typeof insertComprehensiveInteractionSchema>;
export type ComprehensiveInteraction = typeof comprehensiveInteractions.$inferSelect;
