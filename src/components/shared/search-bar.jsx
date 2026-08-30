"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/lib/use-debounce";

export default function SearchBar({
  placeholder = "Search",
  onSearch,
  delay = 400,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, delay);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <label
      className={`flex h-10 items-center gap-2 rounded-lg border border-[#dce4d8] bg-white px-3 text-sm text-[#829084] ${className}`}
    >
      <Search className="size-4 shrink-0" />

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#a4b0a4]"
      />
    </label>
  );
}
