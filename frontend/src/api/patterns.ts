import type { Pattern } from "../types/pattern";

const BASE_URL = "http://localhost:8080/api";

export async function fetchFeatured(): Promise<Pattern[]> {
  const response = await fetch(`${BASE_URL}/patterns/featured`);
  if (!response.ok) {
    throw new Error("API error");
  }
  return response.json() as Promise<Pattern[]>;
}

export interface PatternPage {
  patterns: Pattern[];
  offset: number;
  limit: number;
  hasMore: boolean;
}

export async function fetchCategory(
  category: string,
  offset = 0,
  limit = 15,
): Promise<PatternPage> {
  const response = await fetch(
    `${BASE_URL}/patterns/category/${category}?offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("API error");
  }
  return response.json() as Promise<PatternPage>;
}

export interface BrowseParams {
  prefix: string;
  rule?: string;
  symmetry?: string;
  limit?: number;
}

export async function fetchPatterns({
  prefix,
  rule,
  symmetry,
  limit,
}: BrowseParams): Promise<Pattern[]> {
  const params = new URLSearchParams();
  params.append("prefix", prefix);
  if (rule) params.append("rule", rule);
  if (symmetry) params.append("symmetry", symmetry);
  if (limit !== undefined) params.append("limit", limit.toString());

  const response = await fetch(`${BASE_URL}/patterns?${params}`);
  if (!response.ok) {
    throw new Error("API error");
  }
  return response.json() as Promise<Pattern[]>;
}
