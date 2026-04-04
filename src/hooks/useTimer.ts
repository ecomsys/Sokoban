import { useEffect, useRef } from "react";
import { useGame } from "@/stores/gameStore";

export const useTimer = () => {
  const { userSession, tickTime } = useGame();
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef<number>(0);

  const currentGame = userSession?.currentGameId
    ? userSession.games.find((g) => g.id === userSession.currentGameId)
    : undefined;

  useEffect(() => {
    if (!currentGame || currentGame.completed) return;

    const loop = (time: number) => {
      if (!lastTick.current) {
        lastTick.current = time;
      }

      const delta = time - lastTick.current;

      if (delta >= 1000) {
        tickTime();
        lastTick.current = time;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      lastTick.current = 0;
    };
  }, [currentGame?.id, currentGame?.completed, tickTime]);
};