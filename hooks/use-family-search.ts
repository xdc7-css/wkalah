"use client";

import { useState, useEffect } from "react";
import { searchFamiliesApi } from "@/server/distribution-actions";

export type FamilyLite = {
  id: string;
  family_code: string;
  family_name: string;
  members_count: number;
  area: string | null;
};

export function useFamilySearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<FamilyLite[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim() && !initialQuery) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await searchFamiliesApi(query);
        setResults(data ?? []);
      } catch (error) {
        console.error("Family search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeout);
  }, [query, initialQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching,
  };
}
