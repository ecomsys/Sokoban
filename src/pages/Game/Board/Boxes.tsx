import React from "react";
import type { Box } from "@/types/types";

interface Props {
  boxes: Box[];
  cellSize: number;
}

export const Boxes = React.memo(({ boxes, cellSize }: Props) => {
  return (
    <>
      {boxes.map((box) => (
        <div
          key={box.id}
          className="absolute transition-transform duration-300 ease-linear will-change-transform top-0 left-0"
          style={{
            transform: `translate(${box.position.x * cellSize}rem, ${
              box.position.y * cellSize
            }rem)`,
          }}
        >
          <div
            className={`w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem] ${
              box.onTarget ? "" : "filter grayscale"
            }`}
          >
            <img
              className="w-full h-full object-cover"
              src={`${import.meta.env.BASE_URL}images/box.jpg`}
              alt=""
            />
          </div>
        </div>
      ))}
    </>
  );
});