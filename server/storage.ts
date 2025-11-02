import { type User, type InsertUser, type TestGeneration, type InsertTestGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Test generation methods
  getTestGeneration(id: string): Promise<TestGeneration | undefined>;
  getAllTestGenerations(): Promise<TestGeneration[]>;
  createTestGeneration(testGen: InsertTestGeneration): Promise<TestGeneration>;
  deleteTestGeneration(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private testGenerations: Map<string, TestGeneration>;

  constructor() {
    this.users = new Map();
    this.testGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTestGeneration(id: string): Promise<TestGeneration | undefined> {
    return this.testGenerations.get(id);
  }

  async getAllTestGenerations(): Promise<TestGeneration[]> {
    return Array.from(this.testGenerations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createTestGeneration(insertTestGen: InsertTestGeneration): Promise<TestGeneration> {
    const id = randomUUID();
    const testGen: TestGeneration = {
      ...insertTestGen,
      id,
      createdAt: new Date(),
    };
    this.testGenerations.set(id, testGen);
    return testGen;
  }

  async deleteTestGeneration(id: string): Promise<boolean> {
    return this.testGenerations.delete(id);
  }
}

export const storage = new MemStorage();
