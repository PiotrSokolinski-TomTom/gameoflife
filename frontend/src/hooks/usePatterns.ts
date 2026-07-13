import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategory, fetchFeatured } from "../api/patterns";

export function useFeaturedPatterns() {
  return useQuery({
    queryKey: ["patterns", "featured"],
    queryFn: fetchFeatured,
  });
}

export function useCategoryPatterns(
  category: string | null,
  offset: number,
  limit: number,
) {
  return useQuery({
    queryKey: ["patterns", "category", category, offset, limit],
    queryFn: () => fetchCategory(category as string, offset, limit),
    enabled: category !== null,
    placeholderData: keepPreviousData,
  });
}
