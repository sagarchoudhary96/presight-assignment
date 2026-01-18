import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserFilterParams, UsersFilterMetadata } from "@/types/user";

interface FilterSidebarProps {
  filterParams: UserFilterParams;
  onUpdateFilter: (key: keyof UserFilterParams, value: string) => void;
}

export function FilterSidebar({
  filterParams,
  onUpdateFilter,
}: FilterSidebarProps) {
  const { data: filters, isLoading } = useQuery<UsersFilterMetadata>({
    queryKey: ["filters"],
    queryFn: () => userService.getFilters(),
  });

  if (isLoading) {
    return (
      <div className="w-64 space-y-8 animate-pulse p-4">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 space-y-8 p-4 border rounded-xl bg-card">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Nationalities</h3>
          {filterParams.nationality && (
            <Button
              variant="link"
              size="sm"
              onClick={() => onUpdateFilter("nationality", "")}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto space-y-1 pr-2 overflow-x-hidden">
          {filters?.nationalities.map((nationality) => (
            <Button
              key={nationality}
              variant={
                filterParams.nationality === nationality ? "default" : "ghost"
              }
              size="sm"
              onClick={() =>
                onUpdateFilter(
                  "nationality",
                  filterParams.nationality === nationality ? "" : nationality
                )
              }
              className="w-full text-start font-normal text-ellipsis line-clamp-1 overflow-hidden"
            >
              {nationality}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Top Hobbies</h3>
          {filterParams.hobby && (
            <Button
              variant="link"
              size="sm"
              onClick={() => onUpdateFilter("hobby", "")}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {filters?.topHobbies.map((hobby) => (
            <Button
              key={hobby.name}
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() =>
                onUpdateFilter(
                  "hobby",
                  filterParams.hobby === hobby.name ? "" : hobby.name
                )
              }
            >
              <Badge
                variant={
                  filterParams.hobby === hobby.name ? "default" : "secondary"
                }
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {hobby.name}
                <span className="ml-1 opacity-50 text-[10px] font-normal">
                  {hobby.count}
                </span>
              </Badge>
            </Button>
          ))}
        </div>
      </section>
    </aside>
  );
}
