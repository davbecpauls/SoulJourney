import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  theme: text("theme").default("adult"), // 'adult' or 'child'
  createdAt: timestamp("created_at").defaultNow(),
});

// Realms table
export const realms = pgTable("realms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  element: text("element").notNull(), // earth, water, fire, air, spirit
  backgroundImage: text("background_image"),
  icon: text("icon"),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  childTheme: jsonb("child_theme"), // colors, images, etc for children
  adultTheme: jsonb("adult_theme"), // colors, images, etc for adults
});

// Modules table
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  realmId: varchar("realm_id").references(() => realms.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  prerequisites: text("prerequisites").array(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").references(() => modules.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").notNull(), // rich content with multimedia
  order: integer("order").notNull(),
  duration: integer("duration"), // in minutes
  isActive: boolean("is_active").default(true),
  childContent: jsonb("child_content"), // gamified version
  adultContent: jsonb("adult_content"), // spiritual version
});

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0), // 0-100
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  badges: text("badges").array(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  type: text("type").notNull(), // badge, spell, milestone
  requirement: jsonb("requirement").notNull(),
  childVersion: jsonb("child_version"),
  adultVersion: jsonb("adult_version"),
});

// User Achievements table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Journal Entries table
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  title: text("title"),
  content: text("content").notNull(),
  prompt: text("prompt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRealmSchema = createInsertSchema(realms).omit({
  id: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRealm = z.infer<typeof insertRealmSchema>;
export type Realm = typeof realms.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
