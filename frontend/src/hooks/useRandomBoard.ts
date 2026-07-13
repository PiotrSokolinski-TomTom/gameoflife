import { useMutation } from "@tanstack/react-query";
import { createRandomBoard } from "../api/board";

type RandomBoardParams = {
  width?: number | string | null;
  height?: number | string | null;
  seed?: number | string | null;
};

const toNumber = (value?: number | string | null): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export function useRandomBoard() {
  return useMutation({
    mutationFn: ({ width, height, seed }: RandomBoardParams) =>
      createRandomBoard(toNumber(width), toNumber(height), toNumber(seed)),
  });
}
