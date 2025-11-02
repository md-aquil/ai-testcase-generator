import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2, Eye, FileText, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GenerateTestResponse, ManualTestCase } from "@shared/schema";
import { format } from "date-fns";

export default function History() {
  const [selectedItem, setSelectedItem] = useState<GenerateTestResponse | null>(null);
  const { toast } = useToast();

  const { data: historyItems = [], isLoading } = useQuery<GenerateTestResponse[]>({
    queryKey: ["/api/history"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest<{ success: boolean }>("DELETE", `/api/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Deleted",
        description: "History item deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete history item.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full">
      <section className="py-12 md:py-16 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-semibold tracking-tight">Generation History</h1>
          <p className="text-base text-muted-foreground mt-2">
            View and manage your previously generated test cases and scripts
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading history...</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="rounded-full bg-muted p-6">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">No saved results yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Generate your first test cases and they'll appear here for future reference.
                </p>
              </div>
              <Button asChild>
                <a href="/" data-testid="button-generate-first">
                  Generate Test Cases
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover-elevate transition-all"
                  data-testid={`card-history-${item.id}`}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3" data-testid={`text-requirement-${item.id}`}>
                      {truncateText(item.requirement)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {item.manualTestCases?.length || 0} test case
                        {item.manualTestCases?.length !== 1 ? "s" : ""} generated
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="flex-1 gap-2"
                          data-testid={`button-view-${item.id}`}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Generation Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Requirement</h3>
                <p className="text-sm">{selectedItem.requirement}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Manual Test Cases</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium py-3 px-4">ID</th>
                        <th className="text-left font-medium py-3 px-4">Description</th>
                        <th className="text-left font-medium py-3 px-4">Steps</th>
                        <th className="text-left font-medium py-3 px-4">Expected</th>
                        <th className="text-left font-medium py-3 px-4">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.manualTestCases.map((tc: ManualTestCase, idx: number) => (
                        <tr key={tc.id} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
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
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Cypress Test Script</h3>
                <div className="rounded-md bg-muted p-4 max-h-96 overflow-y-auto">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    <code>{selectedItem.cypressScript}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
