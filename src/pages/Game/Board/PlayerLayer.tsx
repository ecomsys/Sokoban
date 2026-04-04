import React from "react";
import { Player } from "./Player";
import type { Position } from "@/types/types";

interface Props {
  player?: { position: Position };
  angle: number;
  cellSize: number;
}

export const PlayerLayer = React.memo(({ player, angle, cellSize }: Props) => {
  if (!player) return null;

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translate(${player.position.x * cellSize}rem, ${
          player.position.y * cellSize
        }rem) scale(1.2)`,
        transition: "transform 250ms linear",
      }}
    >
      <Player angle={angle} />
    </div>
  );
});