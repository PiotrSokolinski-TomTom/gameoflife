export type Coordinate = `(${number}, ${number})`;
export type CellState = "ALIVE" | "DEAD";

export interface Board {
  cells: Partial<Record<Coordinate, CellState>>;
}
