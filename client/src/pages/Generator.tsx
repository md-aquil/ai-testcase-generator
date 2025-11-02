import { useState } from "react";
import { Loader2, Copy, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { ManualTestCase, GenerateTestResponse } from "@shared/schema";

export default function Generator() {
  const [requirement, setRequirement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateTestResponse | null>(null);
  const [copiedTestCases, setCopiedTestCases] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (requirement.trim().length < 10) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least 10 characters describing your requirement.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      // This will be connected to the backend in Phase 3
      const mockResult: GenerateTestResponse = {
        id: "mock-id",
        requirement,
        manualTestCases: [],
        cypressScript: "",
        createdAt: new Date().toISOString(),
      };
      setResult(mockResult);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate test cases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: "testcases" | "script") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "testcases") {
        setCopiedTestCases(true);
        setTimeout(() => setCopiedTestCases(false), 2000);
      } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      }
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatTestCasesAsText = (testCases: ManualTestCase[]): string => {
    return testCases
      .map(
        (tc) =>
          `ID: ${tc.id}\nDescription: ${tc.description}\nSteps: ${tc.steps}\nExpected Result: ${tc.expectedResult}\nPriority: ${tc.priority}\n`
      )
      .join("\n---\n\n");
  };

  const characterCount = requirement.length;
  const isValidLength = characterCount >= 10;

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 border-b">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            AI-Powered Test Case Generator
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Transform your software requirements into comprehensive manual test cases and automated Cypress scripts instantly.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="requirement" className="text-sm font-medium">
                Software Requirement or Test Scenario
              </label>
              <Textarea
                id="requirement"
                placeholder="Example: A user should be able to log in to the application using their email and password. The system should validate credentials and display appropriate error messages for invalid attempts."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="min-h-32 md:min-h-48 resize-none text-base"
                data-testid="input-requirement"
              />
              <div className="flex items-center justify-between text-sm">
                <span className={isValidLength ? "text-muted-foreground" : "text-destructive"}>
                  {isValidLength ? "Ready to generate" : "Minimum 10 characters required"}
                </span>
                <span className="text-muted-foreground">
                  {characterCount} characters
                </span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!isValidLength || isGenerating}
              size="lg"
              className="w-full md:w-auto gap-2"
              data-testid="button-generate"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Test Cases
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <Card className="border-2 border-primary/20">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Generating Test Cases</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Our AI is analyzing your requirement and creating comprehensive test cases and Cypress scripts...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result && !isGenerating && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
                  <CardTitle className="text-lg font-medium">Manual Test Cases</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(formatTestCasesAsText(result.manualTestCases), "testcases")
                    }
                    className="gap-2"
                    data-testid="button-copy-testcases"
                  >
                    {copiedTestCases ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {result.manualTestCases.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left font-medium py-3 px-4">ID</th>
                            <th className="text-left font-medium py-3 px-4">Description</th>
                            <th className="text-left font-medium py-3 px-4">Steps</th>
                            <th className="text-left font-medium py-3 px-4">Expected</th>
                            <th className="text-left font-medium py-3 px-4">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.manualTestCases.map((tc, idx) => (
                            <tr
                              key={tc.id}
                              className={idx % 2 === 0 ? "bg-muted/30" : ""}
                              data-testid={`row-testcase-${tc.id}`}
                            >
                              <td className="py-3 px-4 align-top">{tc.id}</td>
                              <td className="py-3 px-4 align-top">{tc.description}</td>
                              <td className="py-3 px-4 align-top whitespace-pre-wrap">{tc.steps}</td>
                              <td className="py-3 px-4 align-top">{tc.expectedResult}</td>
                              <td className="py-3 px-4 align-top">
                                <span
                                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                                    tc.priority === "High"
                                      ? "bg-destructive/10 text-destructive"
                                      : tc.priority === "Medium"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {tc.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p>No test cases generated yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
                  <CardTitle className="text-lg font-medium">Cypress Test Script</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.cypressScript, "script")}
                    className="gap-2"
                    data-testid="button-copy-script"
                  >
                    {copiedScript ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {result.cypressScript ? (
                    <div className="rounded-md bg-muted p-4 max-h-96 overflow-y-auto">
                      <pre className="font-mono text-sm whitespace-pre-wrap" data-testid="text-cypress-script">
                        <code>{result.cypressScript}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p>No Cypress script generated yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
