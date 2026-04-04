import type { CellSymbol } from "@/types/types";

export const getTargetsCount = (grid: CellSymbol[][]): number => {
  let count = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];

      if (cell === "." || cell === "+" || cell === "*") {
        count++;
      }
    }
  }

  return count;
};