import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import UserCard from "./UserCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

import { userService } from "@/services/user.service";
import type { UserFilterParams } from "@/types/user";

interface UserListProps extends UserFilterParams {
  onClearFilters?: () => void;
}

export function UserList({
  search = "",
  nationality = "",
  hobby = "",
  onClearFilters,
}: UserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["users", { search, nationality, hobby }],
      queryFn: ({ pageParam = 1 }) =>
        userService.getUsers({
          page: pageParam as number,
          search,
          nationality,
          hobby,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.page < lastPage.pagination.totalPages) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
    });

  const allUsers = data ? data.pages.flatMap((page) => page.users) : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allUsers.length + 1 : allUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated height of UserCard
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allUsers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allUsers.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  if (status === "pending") {
    return (
      <div className="space-y-4 p-4 h-150 overflow-hidden border rounded-md">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading users. Please try again later.
      </div>
    );
  }

  if (status === "success" && allUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-2xl animate-in fade-in zoom-in duration-500 min-h-100">
        <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <SearchX className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold mb-2">No matching users</h3>
        <p className="text-muted-foreground text-center max-w-xs mb-8 font-medium">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto border rounded-md"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const isLoaderRow = virtualItem.index > allUsers.length - 1;
            const user = allUsers[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
              >
                <div className="px-4 pt-4">
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      "Nothing more to load"
                    )
                  ) : (
                    <UserCard user={user} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
