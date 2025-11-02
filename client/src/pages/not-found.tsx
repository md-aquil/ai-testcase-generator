import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-6">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion className="w-16 h-16 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Page Not Found</h1>
        <p className="text-base text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild size="lg">
        <a href="/" data-testid="button-go-home">
          Go Home
        </a>
      </Button>
    </div>
  );
}
