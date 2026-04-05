import type { CellSymbol } from "@/types/types";
import { useGameStore } from "@/stores/gameStore";
import { Grid } from "./Grid";
import { Targets } from "./Targets";
import { Boxes } from "./Boxes";
import { PlayerLayer } from "./PlayerLayer";
import React, { useRef, useEffect } from "react";

import { getScaleFactor } from "@/utils/autoRem";

interface BoardProps {
  grid: CellSymbol[][];
}

const Board = ({ grid }: BoardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Размер клетки зависит от ширины экрана
  const [cellSize, setCellSize] = React.useState(() =>
    window.innerWidth >= 640 ? 3.5 : 2.5
  );

  // Масштаб из autoRem
  const [scale, setScale] = React.useState(getScaleFactor);

  const width = grid[0]?.length ?? 0;

  // 🎮 Текущая игра
  const game = useGameStore((s) =>
    s.userSession?.games.find(
      (g) => g.id === s.userSession?.currentGameId
    )
  );

  // Параметры камеры
  const deadZoneY = 0.5;
  let deadZoneX = 0.5;
  
  

  if (game?.direction === "right" && window.innerWidth <= 640) {
    deadZoneX = 0.65
  } else if (game?.direction === "left" || (game?.direction === "right" &&  window.innerWidth > 640)) {
    deadZoneX = 0.5
  }



  // плавность движения камеры
  let lerp = 0.02;

  if (window.innerWidth <= 640) {
    lerp = 0.02;
  } else {
    lerp = 0.01;
  };

  const player = game?.sokoban.player;
  const boxes = game?.sokoban.boxes ?? [];

  /**
   * 🎥 Камера: следит за игроком с плавным движением
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !player) return;

    // Позиция игрока в rem
    const playerXRem = player.position.x * cellSize;
    const playerYRem = player.position.y * cellSize;

    // Размеры viewport (с учётом scale)
    const viewWidthRem = (container.clientWidth / 16) / scale;
    const viewHeightRem = (container.clientHeight / 16) / scale;

    const currentScrollX = container.scrollLeft;
    const currentScrollY = container.scrollTop;

    // Позиция игрока на экране (в px)
    const playerScreenX = (playerXRem * 16 * scale) - currentScrollX;
    const playerScreenY = (playerYRem * 16 * scale) - currentScrollY;

    // Dead zone (границы, где камера не двигается)
    const zoneX = viewWidthRem * 16 * scale * deadZoneX;
    const zoneY = viewHeightRem * 16 * scale * deadZoneY;

    let targetX = currentScrollX;
    let targetY = currentScrollY;

    const leftBoundary = zoneX;
    const rightBoundary = container.clientWidth - zoneX;
    const topBoundary = zoneY;
    const bottomBoundary = container.clientHeight - zoneY;

    // Горизонтальное движение камеры
    if (playerScreenX < leftBoundary) {
      targetX = currentScrollX - (leftBoundary - playerScreenX);
    } else if (playerScreenX > rightBoundary) {
      targetX = currentScrollX + (playerScreenX - rightBoundary);
    }

    // Вертикальное движение камеры
    if (playerScreenY < topBoundary) {
      targetY = currentScrollY - (topBoundary - playerScreenY);
    } else if (playerScreenY > bottomBoundary) {
      targetY = currentScrollY + (playerScreenY - bottomBoundary);
    }

    // Плавная анимация (lerp)
    let animationFrame: number;

    const animate = () => {
      const nextX =
        container.scrollLeft + (targetX - container.scrollLeft) * lerp;

      const nextY =
        container.scrollTop + (targetY - container.scrollTop) * lerp;

      container.scrollLeft = nextX;
      container.scrollTop = nextY;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [player?.position.x, player?.position.y, cellSize, scale]);

  /**
   * Resize + блокировка wheel
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Отключаем scroll колесом
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    // Обновление scale и cellSize при resize
    const handleResize = () => {
      setScale(getScaleFactor());
      setCellSize(window.innerWidth >= 640 ? 3.5 : 2.5);
    };

    window.addEventListener("resize", handleResize);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="px-2 ">
      <div
        ref={containerRef}
        className="
          relative
          h-full
          w-full
          min-w-[18rem]
          max-w-[calc(100vw-1rem)]
          max-h-[calc(100dvh-9.5rem)]
          menu:max-h-[calc(100dvh-8rem)]
          overflow-scroll
          scrollbar-none         
        "
      >
        {/* Слои рендера */}
        <Grid grid={grid} width={width} cellSize={cellSize} />
        <Targets grid={grid} cellSize={cellSize} />
        <Boxes boxes={boxes} cellSize={cellSize} />
        <PlayerLayer
          player={player}
          angle={game?.angle ?? 0}
          cellSize={cellSize}
        />
      </div>
    </div>
  );
};

export default React.memo(Board);