import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Personal baseline assessment - core foundation
export const personalBaselines = pgTable("personal_baselines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  
  // Communication Preferences
  communicationStyle: varchar("communication_style"), // direct, gentle, collaborative, assertive
  conflictResolution: varchar("conflict_resolution"), // address-immediately, need-time-to-process, avoid-conflict, address-when-calm
  feedbackPreference: varchar("feedback_preference"), // frequent-check-ins, only-when-needed, scheduled-discussions
  
  // Emotional Needs
  emotionalSupport: varchar("emotional_support"), // high, medium, low
  emotionalProcessingTime: integer("emotional_processing_time"), // hours needed to process
  validationNeeds: varchar("validation_needs"), // frequent, moderate, minimal
  
  // Boundary Requirements
  personalSpaceNeeds: varchar("personal_space_needs"), // high, medium, low
  responseTimeExpectation: integer("response_time_expectation"), // hours
  aloneTimeFrequency: varchar("alone_time_frequency"), // daily, few-times-week, weekly, rarely
  
  // Array fields for lists
  triggers: text("triggers").array(),
  dealBreakerBehaviors: text("deal_breaker_behaviors").array(),
  nonNegotiableBoundaries: text("non_negotiable_boundaries").array(),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relationship profiles
export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  relationshipType: varchar("relationship_type"), // romantic, friend, family, work, etc.
  status: varchar("status").default("active"), // active, ended, complicated
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comprehensive Interaction Tracking (CIT)
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  relationshipId: integer("relationship_id").notNull().references(() => relationships.id, { onDelete: "cascade" }),
  
  // Pre-interaction state
  preEnergyLevel: integer("pre_energy_level"), // 1-10
  preAnxietyLevel: integer("pre_anxiety_level"), // 1-10
  preSelfWorth: integer("pre_self_worth"), // 1-10
  
  // Interaction details
  interactionType: varchar("interaction_type"), // casual, planned, conflict, etc.
  duration: integer("duration"), // minutes
  boundaryTested: boolean("boundary_tested").default(false),
  
  // Post-interaction impact
  postEnergyLevel: integer("post_energy_level"), // 1-10
  postAnxietyLevel: integer("post_anxiety_level"), // 1-10
  postSelfWorth: integer("post_self_worth"), // 1-10
  
  // Recovery and learning
  recoveryTime: integer("recovery_time"), // minutes to feel normal
  
  // Boundary violations/respect
  boundariesRespected: text("boundaries_respected").array(),
  boundariesViolated: text("boundaries_violated").array(),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Boundary tracking from baseline
export const boundaryGoals = pgTable("boundary_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  boundaryName: varchar("boundary_name").notNull(),
  description: text("description"),
  isFromBaseline: boolean("is_from_baseline").default(true),
  targetRespectRate: integer("target_respect_rate").default(80), // percentage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertPersonalBaselineSchema = createInsertSchema(personalBaselines).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRelationshipSchema = createInsertSchema(relationships).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertBoundaryGoalSchema = createInsertSchema(boundaryGoals).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type PersonalBaseline = typeof personalBaselines.$inferSelect;
export type InsertPersonalBaseline = z.infer<typeof insertPersonalBaselineSchema>;
export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type BoundaryGoal = typeof boundaryGoals.$inferSelect;
export type InsertBoundaryGoal = z.infer<typeof insertBoundaryGoalSchema>;