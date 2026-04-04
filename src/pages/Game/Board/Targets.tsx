import React, { useMemo } from "react";
import type { CellSymbol } from "@/types/types";

interface Props {
  grid: CellSymbol[][];
  cellSize: number;
}

export const Targets = React.memo(({ grid, cellSize }: Props) => {
  const targets = useMemo(() => {
    const result: { x: number; y: number }[] = [];

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "." || cell === "+" || cell === "*") {
          result.push({ x, y });
        }
      });
    });

    return result;
  }, [grid]);

  return (
    <>
      {targets.map((t) => (
        <div
          key={`target-${t.x}-${t.y}`}
          className="absolute pointer-events-none top-0 left-0"
          style={{
            transform: `translate(${t.x * cellSize}rem, ${t.y * cellSize}rem)`,
          }}
        >
          <div className="w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem] flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500">
              <use href={`${import.meta.env.BASE_URL}sprite/sprite.svg#target`} />
            </svg>
          </div>
        </div>
      ))}
    </>
  );
});