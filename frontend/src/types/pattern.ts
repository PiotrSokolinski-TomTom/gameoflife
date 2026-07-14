export interface Pattern {
  apgcode: string;
  name: string | null;
  occurrences: string;
  kind: string;
  cells: number[];
  width: number;
  height: number;
}
