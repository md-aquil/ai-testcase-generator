import { Link, useLocation } from "wouter";
import { FileCheck2, History, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3 transition-colors" data-testid="link-home">
              <FileCheck2 className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">AI Test Generator</span>
            </a>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Link href="/">
              <a data-testid="link-generator">
                <Button
                  variant={location === "/" ? "secondary" : "ghost"}
                  size="default"
                  className="gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Generator</span>
                </Button>
              </a>
            </Link>
            <Link href="/history">
              <a data-testid="link-history">
                <Button
                  variant={location === "/history" ? "secondary" : "ghost"}
                  size="default"
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </a>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
