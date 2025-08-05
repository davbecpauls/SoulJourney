import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertRealmSchema, 
  insertModuleSchema, 
  insertLessonSchema,
  insertUserProgressSchema,
  insertJournalEntrySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  });

  // Realm routes
  app.get("/api/realms", async (req, res) => {
    try {
      const realms = await storage.getRealms();
      res.json(realms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch realms", error });
    }
  });

  app.get("/api/realms/:id", async (req, res) => {
    try {
      const realm = await storage.getRealm(req.params.id);
      if (!realm) {
        return res.status(404).json({ message: "Realm not found" });
      }
      res.json(realm);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch realm", error });
    }
  });

  app.post("/api/realms", async (req, res) => {
    try {
      const realmData = insertRealmSchema.parse(req.body);
      const realm = await storage.createRealm(realmData);
      res.json(realm);
    } catch (error) {
      res.status(400).json({ message: "Invalid realm data", error });
    }
  });

  app.put("/api/realms/:id", async (req, res) => {
    try {
      const updates = req.body;
      const realm = await storage.updateRealm(req.params.id, updates);
      if (!realm) {
        return res.status(404).json({ message: "Realm not found" });
      }
      res.json(realm);
    } catch (error) {
      res.status(400).json({ message: "Failed to update realm", error });
    }
  });

  // Module routes
  app.get("/api/realms/:realmId/modules", async (req, res) => {
    try {
      const modules = await storage.getModulesByRealm(req.params.realmId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules", error });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.json(module);
    } catch (error) {
      res.status(400).json({ message: "Invalid module data", error });
    }
  });

  // Lesson routes
  app.get("/api/modules/:moduleId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByModule(req.params.moduleId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons", error });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson", error });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      res.status(400).json({ message: "Invalid lesson data", error });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress", error });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error });
    }
  });

  app.put("/api/progress/:id", async (req, res) => {
    try {
      const updates = req.body;
      const progress = await storage.updateUserProgress(req.params.id, updates);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to update progress", error });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements", error });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements", error });
    }
  });

  // Journal routes
  app.get("/api/users/:userId/journal", async (req, res) => {
    try {
      const entries = await storage.getUserJournalEntries(req.params.userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries", error });
    }
  });

  app.post("/api/journal", async (req, res) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data", error });
    }
  });

  app.put("/api/journal/:id", async (req, res) => {
    try {
      const updates = req.body;
      const entry = await storage.updateJournalEntry(req.params.id, updates);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Failed to update journal entry", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
