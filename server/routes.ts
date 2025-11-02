import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTestCases } from "./gemini";
import { firestoreStorage } from "./firebase";
import { generateTestRequestSchema } from "@shared/schema";
import type { GenerateTestResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/generate - Generate test cases from requirement
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body
      const validation = generateTestRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validation.error.errors,
        });
      }

      const { requirement } = validation.data;

      // Generate test cases using Gemini AI
      const { manualTestCases, cypressScript } = await generateTestCases(requirement);

      // Save to storage (Firebase if available, otherwise in-memory)
      let savedResult;
      try {
        // Try Firebase first
        savedResult = await firestoreStorage.createTestGeneration({
          requirement,
          manualTestCases,
          cypressScript,
        });
      } catch (firestoreError) {
        // Fallback to in-memory storage
        console.log("Firebase save failed, using in-memory storage");
        savedResult = await storage.createTestGeneration({
          requirement,
          manualTestCases,
          cypressScript,
        });
      }

      const response: GenerateTestResponse = {
        id: savedResult.id,
        requirement: savedResult.requirement,
        manualTestCases: savedResult.manualTestCases,
        cypressScript: savedResult.cypressScript,
        createdAt: savedResult.createdAt.toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("Error in /api/generate:", error);
      res.status(500).json({
        error: "Failed to generate test cases",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // GET /api/history - Get all test generation history
  app.get("/api/history", async (req, res) => {
    try {
      let historyItems;
      
      try {
        // Try Firebase first
        historyItems = await firestoreStorage.getAllTestGenerations();
      } catch (firestoreError) {
        // Fallback to in-memory storage
        console.log("Firebase fetch failed, using in-memory storage");
        historyItems = await storage.getAllTestGenerations();
      }

      const response: GenerateTestResponse[] = historyItems.map((item) => ({
        id: item.id,
        requirement: item.requirement,
        manualTestCases: item.manualTestCases,
        cypressScript: item.cypressScript,
        createdAt: item.createdAt.toISOString(),
      }));

      res.json(response);
    } catch (error) {
      console.error("Error in /api/history:", error);
      res.status(500).json({
        error: "Failed to fetch history",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // GET /api/history/:id - Get a specific test generation
  app.get("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let item;

      try {
        // Try Firebase first
        item = await firestoreStorage.getTestGeneration(id);
      } catch (firestoreError) {
        // Fallback to in-memory storage
        console.log("Firebase fetch failed, using in-memory storage");
        item = await storage.getTestGeneration(id);
      }

      if (!item) {
        return res.status(404).json({
          error: "Not found",
          message: "Test generation not found",
        });
      }

      const response: GenerateTestResponse = {
        id: item.id,
        requirement: item.requirement,
        manualTestCases: item.manualTestCases,
        cypressScript: item.cypressScript,
        createdAt: item.createdAt.toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("Error in /api/history/:id:", error);
      res.status(500).json({
        error: "Failed to fetch test generation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // DELETE /api/history/:id - Delete a test generation
  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let success;

      try {
        // Try Firebase first
        success = await firestoreStorage.deleteTestGeneration(id);
      } catch (firestoreError) {
        // Fallback to in-memory storage
        console.log("Firebase delete failed, using in-memory storage");
        success = await storage.deleteTestGeneration(id);
      }

      if (!success) {
        return res.status(404).json({
          error: "Not found",
          message: "Test generation not found",
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error in /api/history/:id:", error);
      res.status(500).json({
        error: "Failed to delete test generation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
