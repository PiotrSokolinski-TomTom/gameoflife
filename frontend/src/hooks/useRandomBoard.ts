import { useEffect, useState } from "react";
import type { Board } from "../types/board";
import { createRandomBoard } from "../api/board";

export function useRandomBoard(
  width?: number | string | undefined,
  height?: number | string | undefined,
  seed?: number | string | undefined,
) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);
    createRandomBoard(width as number, height as number, seed as number)
      .then((data) => {
        if (!ignore) setBoard(data);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "unknown error"),
      )
      .finally(() => setLoading(false));
    return () => {
      ignore = true;
    };
  }, [width, height, seed]);

  return { board, loading, error };
}
