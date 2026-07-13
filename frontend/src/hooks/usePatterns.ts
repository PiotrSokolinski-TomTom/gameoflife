import { useQuery } from "@tanstack/react-query";
import { fetchCategory, fetchFeatured } from "../api/patterns";

export function useFeaturedPatterns() {
  return useQuery({
    queryKey: ["patterns", "featured"],
    queryFn: fetchFeatured,
  });
}

export function useCategoryPatterns(category: string | null) {
  return useQuery({
    queryKey: ["patterns", "category", category],
    queryFn: () => fetchCategory(category as string),
    enabled: category !== null,
  });
}
