import { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserList } from "@/components/UserList";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { StreamingDisplay } from "@/components/StreamingDisplay";
import { TaskTracker } from "@/components/TaskTracker";
import { XIcon, Users, FileText, LayoutGrid } from "lucide-react";
import type { UserFilterParams } from "@/types/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

const initialFilters: UserFilterParams = {
  search: "",
  nationality: "",
  hobby: "",
};

function App() {
  const [view, setView] = useState<"directory" | "stream" | "tasks">(
    "directory"
  );
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters);

  const updateFilter = useCallback(
    (key: keyof UserFilterParams, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = () => setFilters(initialFilters);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-full w-full bg-background p-4">
        <div className="max-w-full mx-auto space-y-8 flex flex-col h-full overflow-hidden">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {view === "directory"
                    ? "User Directory"
                    : view === "stream"
                    ? "Response Streamer"
                    : "Task Processor"}
                </h1>
                <p className="text-muted-foreground font-medium">
                  {view === "directory"
                    ? "Explore our community with precision filtering."
                    : view === "stream"
                    ? "Real-time HTTP body streaming with progressive rendering."
                    : "Background worker tasks with WebSocket notifications."}
                </p>
              </div>

              <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                <Button
                  variant={view === "directory" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("directory")}
                  className="gap-2 font-bold px-4"
                >
                  <Users className="h-4 w-4" /> Directory
                </Button>
                <Button
                  variant={view === "stream" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("stream")}
                  className="gap-2 font-bold px-4"
                >
                  <FileText className="h-4 w-4" /> Streamer
                </Button>
                <Button
                  variant={view === "tasks" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("tasks")}
                  className="gap-2 font-bold px-4"
                >
                  <LayoutGrid className="h-4 w-4" /> Tasks
                </Button>
              </div>
            </div>

            {view === "directory" && (
              <div className="w-full md:w-80 group">
                <SearchBox
                  value={filters.search || ""}
                  onChange={(val) => updateFilter("search", val)}
                />
              </div>
            )}
          </header>

          {view === "directory" ? (
            <div className="flex flex-1 gap-4 items-start overflow-hidden animate-in fade-in duration-500">
              <div className="sticky top-8 space-y-6 h-full overflow-hidden">
                <FilterSidebar
                  filterParams={filters}
                  onUpdateFilter={updateFilter}
                />
              </div>

              <div className="space-y-3 flex-1 h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {hasActiveFilters ? "Filtered Results" : "All Members"}
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearFilters}
                      className="text-white"
                    >
                      Clear all filters
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <UserList {...filters} onClearFilters={clearFilters} />
              </div>
            </div>
          ) : view === "stream" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col overflow-hidden">
              <StreamingDisplay />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col overflow-hidden">
              <TaskTracker />
            </div>
          )}
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
