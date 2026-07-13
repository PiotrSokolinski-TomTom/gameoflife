import { useQuery } from "@tanstack/react-query";
import { fetchCategory, fetchFeatured } from "../api/patterns";

export function useFeaturedPatterns() {
  return useQuery({
    queryKey: ["patterns", "featured"],
    queryFn: fetchFeatured,
  });
}

export function useCategoryPatterns(category: string | null, limit: number) {
  return useQuery({
    queryKey: ["patterns", "category", category, limit],
    queryFn: () => fetchCategory(category as string, limit),
    enabled: category !== null,
  });
}
