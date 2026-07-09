import { useMutation } from "@tanstack/react-query";
import { nextBoardTick } from "../api/board";

export function useNextTick() {
  return useMutation({
    mutationFn: nextBoardTick,
  });
}
