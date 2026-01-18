import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onChange]);

  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-9 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchQuery("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
