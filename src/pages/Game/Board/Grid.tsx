import React from "react";
import type { CellSymbol } from "@/types/types";

interface Props {
  grid: CellSymbol[][];
  width: number;
  cellSize: number;
}

const Cell = React.memo(({ type }: { type: CellSymbol }) => {
  let content: React.ReactNode = null;
  let base = "w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem] flex items-center justify-center";

  switch (type) {
    case "#":
      content = (
        <img
          className="w-full h-full object-cover"
          src={`${import.meta.env.BASE_URL}images/bricks.png`}
          alt=""
        />
      );
      break;
    case "%":
      base += " bg-teal-900";
      content = (
        <img
          className="w-full h-full object-cover"
          src={`${import.meta.env.BASE_URL}images/diamand.webp`}
          alt=""
        />
      );
      break;

    case "-":
      base += " bg-transparent";
      break;

    default:
      base += " bg-teal-900";
  }

  return <div className={base}>{content}</div>;
});

export const Grid = React.memo(({ grid, width, cellSize }: Props) => {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${width}, ${cellSize}rem)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell key={`${x}-${y}`} type={cell} />
        ))
      )}
    </div>
  );
});