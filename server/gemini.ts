import { GoogleGenAI } from "@google/genai";
import type { ManualTestCase } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface TestGenerationResult {
  manualTestCases: ManualTestCase[];
  cypressScript: string;
}

export async function generateTestCases(requirement: string): Promise<TestGenerationResult> {
  try {
    const systemPrompt = `You are an expert QA automation engineer. Given a software requirement or test scenario, you will:

1. Generate comprehensive manual test cases with the following structure:
   - Test Case ID (e.g., TC-001, TC-002)
   - Description: Brief description of what is being tested
   - Steps: Detailed step-by-step instructions (use numbered steps, separate with newlines)
   - Expected Result: What should happen when test is executed
   - Priority: High, Medium, or Low

2. Generate a complete Cypress test script that automates the test cases.

Respond with valid JSON in this exact format:
{
  "manualTestCases": [
    {
      "id": "TC-001",
      "description": "...",
      "steps": "1. Step one\\n2. Step two\\n3. Step three",
      "expectedResult": "...",
      "priority": "High"
    }
  ],
  "cypressScript": "describe('Test Suite', () => {\\n  it('test case 1', () => {\\n    // test code\\n  });\\n});"
}

Generate 3-5 comprehensive test cases that cover positive, negative, and edge cases.
Make the Cypress script production-ready with proper selectors, assertions, and error handling.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            manualTestCases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  description: { type: "string" },
                  steps: { type: "string" },
                  expectedResult: { type: "string" },
                  priority: { type: "string" },
                },
                required: ["id", "description", "steps", "expectedResult", "priority"],
              },
            },
            cypressScript: { type: "string" },
          },
          required: ["manualTestCases", "cypressScript"],
        },
      },
      contents: `Software Requirement/Test Scenario:\n\n${requirement}`,
    });

    const rawJson = response.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const data: TestGenerationResult = JSON.parse(rawJson);

    // Validate the response structure
    if (!data.manualTestCases || !Array.isArray(data.manualTestCases)) {
      throw new Error("Invalid response structure: missing manualTestCases array");
    }

    if (!data.cypressScript || typeof data.cypressScript !== "string") {
      throw new Error("Invalid response structure: missing cypressScript");
    }

    // Validate each test case has required fields
    data.manualTestCases.forEach((tc, index) => {
      if (!tc.id || !tc.description || !tc.steps || !tc.expectedResult || !tc.priority) {
        throw new Error(`Invalid test case at index ${index}: missing required fields`);
      }
      
      // Ensure priority is valid
      if (!["High", "Medium", "Low"].includes(tc.priority)) {
        tc.priority = "Medium";
      }
    });

    return data;
  } catch (error) {
    console.error("Error generating test cases with Gemini:", error);
    throw new Error(`Failed to generate test cases: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
