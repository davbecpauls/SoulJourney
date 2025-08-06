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
  // Enhanced for branching narratives
  lessonType: text("lesson_type").default("linear"), // linear, choice, quest, ritual
  choices: jsonb("choices"), // branching options for Twine-style navigation
  nextLessons: text("next_lessons").array(), // possible next lesson IDs
  prerequisites: text("prerequisites").array(), // required lessons/achievements
  mediaAssets: jsonb("media_assets"), // organized media files
  downloadableResources: jsonb("downloadable_resources"), // PDFs, worksheets, etc
  gamificationData: jsonb("gamification_data"), // XP, badges, rewards
  interactionElements: jsonb("interaction_elements"), // quizzes, journaling prompts, etc
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
  // Enhanced tracking
  choicesMade: jsonb("choices_made"), // track user decisions in branching lessons
  experiencePoints: integer("experience_points").default(0),
  pathTaken: text("path_taken").array(), // lesson sequence followed
  timeSpent: integer("time_spent").default(0), // in seconds
  interactionData: jsonb("interaction_data"), // quiz answers, journal entries, etc
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
  // Enhanced journaling features
  entryType: text("entry_type").default("reflection"), // reflection, ritual, dream, vision
  tags: text("tags").array(),
  mood: text("mood"), // for tracking emotional journey
  isPrivate: boolean("is_private").default(true),
  attachments: jsonb("attachments"), // images, audio recordings
});

// Virtual Altar Elements table
export const altarElements = pgTable("altar_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  element: text("element").notNull(), // candle, crystal, plant, etc
  elementData: jsonb("element_data").notNull(), // color, position, properties
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Media Assets table for organized content management
export const mediaAssets = pgTable("media_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // image, video, audio, pdf
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  description: text("description"),
  tags: text("tags").array(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isPublic: boolean("is_public").default(false),
});

// Language Support table
export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull(),
  language: text("language").notNull(), // en, es, nah (Nahuatl), la (Latin), arc (Aramaic)
  value: text("value").notNull(),
  context: text("context"), // page, component, or feature context
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community Circles table (foundation for future community features)
export const circles = pgTable("circles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  realmId: varchar("realm_id").references(() => realms.id),
  moderatorId: varchar("moderator_id").references(() => users.id).notNull(),
  maxMembers: integer("max_members").default(12),
  isPrivate: boolean("is_private").default(false),
  ageGroup: text("age_group").notNull(), // child, adult, mixed
  createdAt: timestamp("created_at").defaultNow(),
});

// Circle Memberships table
export const circleMemberships = pgTable("circle_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  circleId: varchar("circle_id").references(() => circles.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // member, moderator, guide
  joinedAt: timestamp("joined_at").defaultNow(),
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

export const insertAltarElementSchema = createInsertSchema(altarElements).omit({
  id: true,
  unlockedAt: true,
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssets).omit({
  id: true,
  uploadedAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCircleSchema = createInsertSchema(circles).omit({
  id: true,
  createdAt: true,
});

export const insertCircleMembershipSchema = createInsertSchema(circleMemberships).omit({
  id: true,
  joinedAt: true,
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

export type InsertAltarElement = z.infer<typeof insertAltarElementSchema>;
export type AltarElement = typeof altarElements.$inferSelect;

export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
export type MediaAsset = typeof mediaAssets.$inferSelect;

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

export type InsertCircle = z.infer<typeof insertCircleSchema>;
export type Circle = typeof circles.$inferSelect;

export type InsertCircleMembership = z.infer<typeof insertCircleMembershipSchema>;
export type CircleMembership = typeof circleMemberships.$inferSelect;
