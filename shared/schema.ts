import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Test Generation Result schema
export const testGenerations = pgTable("test_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requirement: text("requirement").notNull(),
  manualTestCases: jsonb("manual_test_cases").notNull(),
  cypressScript: text("cypress_script").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTestGenerationSchema = createInsertSchema(testGenerations).omit({
  id: true,
  createdAt: true,
});

export type InsertTestGeneration = z.infer<typeof insertTestGenerationSchema>;
export type TestGeneration = typeof testGenerations.$inferSelect;

// Manual Test Case interface
export interface ManualTestCase {
  id: string;
  description: string;
  steps: string;
  expectedResult: string;
  priority: "High" | "Medium" | "Low";
}

// Generation request/response types
export const generateTestRequestSchema = z.object({
  requirement: z.string().min(10, "Requirement must be at least 10 characters"),
});

export type GenerateTestRequest = z.infer<typeof generateTestRequestSchema>;

export interface GenerateTestResponse {
  id: string;
  requirement: string;
  manualTestCases: ManualTestCase[];
  cypressScript: string;
  createdAt: string;
}
