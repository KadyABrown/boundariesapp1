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
  profileImageUrl: varchar("profile_image_url"),
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

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  boundaries: many(boundaries),
  boundaryEntries: many(boundaryEntries),
  reflectionEntries: many(reflectionEntries),
  settings: one(userSettings),
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
