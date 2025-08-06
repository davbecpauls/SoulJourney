import { 
  type User, 
  type InsertUser,
  type Realm,
  type InsertRealm,
  type Module,
  type InsertModule,
  type Lesson,
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type JournalEntry,
  type InsertJournalEntry
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Realm methods
  getRealms(): Promise<Realm[]>;
  getRealm(id: string): Promise<Realm | undefined>;
  createRealm(realm: InsertRealm): Promise<Realm>;
  updateRealm(id: string, realm: Partial<Realm>): Promise<Realm | undefined>;
  deleteRealm(id: string): Promise<boolean>;

  // Module methods
  getModulesByRealm(realmId: string): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<Module>): Promise<Module | undefined>;
  deleteModule(id: string): Promise<boolean>;

  // Lesson methods
  getLessonsByModule(moduleId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<boolean>;

  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  grantAchievement(userId: string, achievementId: string): Promise<boolean>;

  // Journal methods
  getUserJournalEntries(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, entry: Partial<JournalEntry>): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private realms: Map<string, Realm> = new Map();
  private modules: Map<string, Module> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, { userId: string; achievementId: string; earnedAt: Date }> = new Map();
  private journalEntries: Map<string, JournalEntry> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default realms
    const earthRealm: Realm = {
      id: randomUUID(),
      title: "Earth Realm",
      description: "Discover the grounding wisdom of the earth element through crystal work, herbalism, and nature connection.",
      element: "earth",
      backgroundImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      icon: "🌱",
      order: 1,
      isActive: true,
      childTheme: { colors: ["#10B981", "#059669"], creatures: ["Earth Dragons", "Crystal Sprites"] },
      adultTheme: { colors: ["#065F46", "#047857"], symbols: ["Sacred Geometry", "Ancient Trees"] }
    };

    const waterRealm: Realm = {
      id: randomUUID(),
      title: "Water Realm",
      description: "Flow with the emotional wisdom of water through healing, intuition, and purification practices.",
      element: "water",
      backgroundImage: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      icon: "🌊",
      order: 2,
      isActive: true,
      childTheme: { colors: ["#3B82F6", "#2563EB"], creatures: ["Water Elementals", "Moon Dolphins"] },
      adultTheme: { colors: ["#1E40AF", "#1D4ED8"], symbols: ["Sacred Pools", "Lunar Cycles"] }
    };

    this.realms.set(earthRealm.id, earthRealm);
    this.realms.set(waterRealm.id, waterRealm);

    // Create sample modules
    const foundationsModule: Module = {
      id: randomUUID(),
      realmId: earthRealm.id,
      title: "Foundations of Earth",
      description: "Learn the fundamental principles of earth element wisdom and grounding practices.",
      order: 1,
      isActive: true,
      prerequisites: []
    };

    this.modules.set(foundationsModule.id, foundationsModule);

    // Create sample lessons
    const groundingLesson: Lesson = {
      id: randomUUID(),
      moduleId: foundationsModule.id,
      title: "Grounding Practices",
      description: "Discover ancient techniques for connecting with earth's stabilizing energy.",
      content: {
        text: "Grounding is the practice of connecting your energy with the earth...",
        video: "https://example.com/grounding-video",
        audio: "https://example.com/grounding-meditation",
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"]
      },
      order: 1,
      duration: 15,
      isActive: true,
      childContent: {
        story: "Meet Terra the Earth Dragon who will teach you magical grounding spells!",
        quest: "Help Terra collect 5 grounding crystals by completing the breathing exercise",
        rewards: ["Earth Shield Spell", "Crystal Collector Badge"]
      },
      adultContent: {
        meditation: "A 10-minute guided grounding meditation",
        journalPrompts: ["How do you feel when you're disconnected from earth?", "What grounding practices resonate with you?"],
        resources: ["Grounding techniques PDF", "Sacred earth connections guide"]
      }
    };

    this.lessons.set(groundingLesson.id, groundingLesson);

    // Create sample achievements
    const firstSteps: Achievement = {
      id: randomUUID(),
      title: "First Steps",
      description: "Complete your first lesson in any realm",
      icon: "🌟",
      type: "milestone",
      requirement: { lessonCount: 1 },
      childVersion: { title: "Young Seeker", icon: "⭐", reward: "Magic Wand" },
      adultVersion: { title: "Soul Awakening", icon: "🕉️", reward: "Sacred Journal" }
    };

    this.achievements.set(firstSteps.id, firstSteps);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin ?? false,
      theme: insertUser.theme ?? "adult",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Realm methods
  async getRealms(): Promise<Realm[]> {
    return Array.from(this.realms.values()).sort((a, b) => a.order - b.order);
  }

  async getRealm(id: string): Promise<Realm | undefined> {
    return this.realms.get(id);
  }

  async createRealm(insertRealm: InsertRealm): Promise<Realm> {
    const id = randomUUID();
    const realm: Realm = { 
      ...insertRealm, 
      id,
      backgroundImage: insertRealm.backgroundImage ?? null,
      icon: insertRealm.icon ?? null,
      isActive: insertRealm.isActive ?? true,
      childTheme: insertRealm.childTheme ?? null,
      adultTheme: insertRealm.adultTheme ?? null
    };
    this.realms.set(id, realm);
    return realm;
  }

  async updateRealm(id: string, realmData: Partial<Realm>): Promise<Realm | undefined> {
    const realm = this.realms.get(id);
    if (!realm) return undefined;

    const updatedRealm = { ...realm, ...realmData };
    this.realms.set(id, updatedRealm);
    return updatedRealm;
  }

  async deleteRealm(id: string): Promise<boolean> {
    return this.realms.delete(id);
  }

  // Module methods
  async getModulesByRealm(realmId: string): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.realmId === realmId)
      .sort((a, b) => a.order - b.order);
  }

  async getModule(id: string): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = randomUUID();
    const module: Module = { 
      ...insertModule, 
      id,
      isActive: insertModule.isActive ?? true,
      prerequisites: insertModule.prerequisites ?? []
    };
    this.modules.set(id, module);
    return module;
  }

  async updateModule(id: string, moduleData: Partial<Module>): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (!module) return undefined;

    const updatedModule = { ...module, ...moduleData };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }

  async deleteModule(id: string): Promise<boolean> {
    return this.modules.delete(id);
  }

  // Lesson methods
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      duration: insertLesson.duration ?? null,
      isActive: insertLesson.isActive ?? true,
      childContent: insertLesson.childContent ?? null,
      adultContent: insertLesson.adultContent ?? null
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: string, lessonData: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;

    const updatedLesson = { ...lesson, ...lessonData };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }

  async deleteLesson(id: string): Promise<boolean> {
    return this.lessons.delete(id);
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      progress: insertProgress.progress ?? 0,
      completed: insertProgress.completed ?? false,
      notes: insertProgress.notes ?? null,
      badges: insertProgress.badges ?? [],
      startedAt: new Date(),
      completedAt: insertProgress.completed ? new Date() : null
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, progressData: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;

    const updatedProgress = { 
      ...progress, 
      ...progressData,
      completedAt: progressData.completed ? new Date() : progress.completedAt
    };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const userAchievementIds = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);

    return Array.from(this.achievements.values())
      .filter(achievement => userAchievementIds.includes(achievement.id));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { 
      ...insertAchievement, 
      id,
      icon: insertAchievement.icon ?? null,
      childVersion: insertAchievement.childVersion ?? null,
      adultVersion: insertAchievement.adultVersion ?? null
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async grantAchievement(userId: string, achievementId: string): Promise<boolean> {
    const id = randomUUID();
    this.userAchievements.set(id, {
      userId,
      achievementId,
      earnedAt: new Date()
    });
    return true;
  }

  // Journal methods
  async getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = { 
      ...insertEntry, 
      id,
      title: insertEntry.title ?? null,
      lessonId: insertEntry.lessonId ?? null,
      prompt: insertEntry.prompt ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async updateJournalEntry(id: string, entryData: Partial<JournalEntry>): Promise<JournalEntry | undefined> {
    const entry = this.journalEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry = { 
      ...entry, 
      ...entryData,
      updatedAt: new Date()
    };
    this.journalEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    return this.journalEntries.delete(id);
  }
}

export const storage = new MemStorage();