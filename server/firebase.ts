import admin from "firebase-admin";
import type { TestGeneration, InsertTestGeneration } from "@shared/schema";

// Initialize Firebase Admin SDK
let db: admin.firestore.Firestore | null = null;

export function initializeFirebase() {
  try {
    // Check if Firebase credentials are available
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccount) {
      console.warn("Firebase not configured: FIREBASE_SERVICE_ACCOUNT not found. Using in-memory storage.");
      return null;
    }

    // Parse service account JSON
    const credentials = JSON.parse(serviceAccount);

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    }

    db = admin.firestore();
    console.log("Firebase Firestore initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    console.warn("Falling back to in-memory storage");
    return null;
  }
}

// Initialize on module load
initializeFirebase();

export class FirestoreStorage {
  private collection = "test_generations";

  async getTestGeneration(id: string): Promise<TestGeneration | undefined> {
    if (!db) return undefined;

    try {
      const doc = await db.collection(this.collection).doc(id).get();
      if (!doc.exists) return undefined;

      const data = doc.data();
      return {
        id: doc.id,
        requirement: data!.requirement,
        manualTestCases: data!.manualTestCases,
        cypressScript: data!.cypressScript,
        createdAt: data!.createdAt.toDate(),
      };
    } catch (error) {
      console.error("Error getting test generation:", error);
      throw error;
    }
  }

  async getAllTestGenerations(): Promise<TestGeneration[]> {
    if (!db) return [];

    try {
      const snapshot = await db
        .collection(this.collection)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          requirement: data.requirement,
          manualTestCases: data.manualTestCases,
          cypressScript: data.cypressScript,
          createdAt: data.createdAt.toDate(),
        };
      });
    } catch (error) {
      console.error("Error getting all test generations:", error);
      throw error;
    }
  }

  async createTestGeneration(testGen: InsertTestGeneration): Promise<TestGeneration> {
    if (!db) throw new Error("Firebase not initialized");

    try {
      const docRef = await db.collection(this.collection).add({
        requirement: testGen.requirement,
        manualTestCases: testGen.manualTestCases,
        cypressScript: testGen.cypressScript,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const doc = await docRef.get();
      const data = doc.data();

      return {
        id: doc.id,
        requirement: data!.requirement,
        manualTestCases: data!.manualTestCases,
        cypressScript: data!.cypressScript,
        createdAt: data!.createdAt.toDate(),
      };
    } catch (error) {
      console.error("Error creating test generation:", error);
      throw error;
    }
  }

  async deleteTestGeneration(id: string): Promise<boolean> {
    if (!db) return false;

    try {
      await db.collection(this.collection).doc(id).delete();
      return true;
    } catch (error) {
      console.error("Error deleting test generation:", error);
      throw error;
    }
  }
}

export const firestoreStorage = new FirestoreStorage();
