import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import type { Direction } from "@/types/types";
import { engineSound } from "@/classes/engineSound";
import { unlockAudio } from "@/classes/audioManager";

export const usePlayerControls = () => {
  const movePlayer = useGameStore((s) => s.movePlayer);
  const sounds = useGameStore((s) => s.sounds);

  const pressedKey = useRef<Direction | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastMoveTime = useRef<number>(0);

  const clearPushTimeout = useGameStore((s) => s.clearPushTimeout);

  const isGameBlocked = () => {
    const state = useGameStore.getState();
    const game = state.userSession?.games.find(
      (g) => g.id === state.userSession?.currentGameId
    );
    return game?.completed;
  };

  const loop = (time: number) => {
    if (!pressedKey.current) return;

    if (!lastMoveTime.current) {
      lastMoveTime.current = time;
    }

    const delta = time - lastMoveTime.current;

    if (delta >= 250) {
      if (!isGameBlocked()) {
        movePlayer(pressedKey.current);
      }
      lastMoveTime.current = time;
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  const startMoving = (direction: Direction) => {    
    
    if (sounds) unlockAudio("/games/sokoban/audio/win.mp3");
    if (sounds) unlockAudio("/games/sokoban/audio/victory.mp3");

    if (isGameBlocked()) return;
    if (pressedKey.current === direction) return;

    if (pressedKey.current && pressedKey.current !== direction) {
      clearPushTimeout(); // смена направления
    }

    stopMoving();

    engineSound.onDriveStart();

    movePlayer(direction); // первый шаг сразу

    pressedKey.current = direction;
    lastMoveTime.current = 0;

    rafRef.current = requestAnimationFrame(loop);
  };

  const stopMoving = () => {
    pressedKey.current = null;
    lastMoveTime.current = 0;

    clearPushTimeout();

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    engineSound.onDriveStop();
  };

  useEffect(() => {
    engineSound.setEnabled(sounds);
  }, [sounds]);

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = keyMap[e.key];
      if (!direction) return;

      startMoving(direction);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = keyMap[e.key];
      if (!direction) return;

      if (pressedKey.current === direction) {
        stopMoving();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopMoving();
    };
  }, []);

  // ВАЖНО — отдаём наружу
  return {
    startMoving,
    stopMoving,
  };
};