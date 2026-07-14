import type { Board } from "../types/board";

const BASE_URL = "http://localhost:8080/api";

export async function createRandomBoard(
  width?: number,
  height?: number,
  seed?: number,
): Promise<Board> {
  const params = new URLSearchParams();
  if (width !== undefined && width !== null)
    params.append("width", width.toString());
  if (height !== undefined && height !== null)
    params.append("height", height.toString());
  if (seed !== undefined && seed !== null)
    params.append("seed", seed.toString());
  let url = `${BASE_URL}/board/random?${params}`;
  if (params.size === 0) {
    url = `${BASE_URL}/board/random`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("API error");
  }
  return response.json() as Promise<Board>;
}

export async function nextBoardTick(board: Board): Promise<Board> {
  const response = await fetch(`${BASE_URL}/board/tick`, {
    method: "POST",
    body: JSON.stringify(board),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  if (!response.ok) {
    throw new Error("API error");
  }
  return response.json() as Promise<Board>;
}
