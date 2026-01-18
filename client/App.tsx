import { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserList } from "@/components/UserList";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
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
      <main className="h-full w-full bg-background p-4 md:p-8">
        <div className="max-w-full mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                User Directory
              </h1>
              <p className="text-muted-foreground font-medium">
                Explore our community with precision filtering.
              </p>
            </div>

            <div className="w-full md:w-80 group">
              <SearchBox
                value={filters.search || ""}
                onChange={(val) => updateFilter("search", val)}
              />
            </div>
          </header>

          <div className="grid grid-cols-[280px_1fr] gap-4 items-start h-full overflow-hidden">
            <div className="sticky top-8 space-y-6">
              <FilterSidebar
                filterParams={filters}
                onUpdateFilter={updateFilter}
              />
            </div>

            <div className="space-y-3 h-full flex flex-col overflow-hidden">
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
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
