import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levels } from "@/pages/Game/Levels";

import type {
  GameState,
  UserSession,
  Gamer,
  SokobanState,
  Direction,
  Box,
  Position,
  CellSymbol
} from "@/types/types";

const STORAGE_KEY = "zokoban-game-storage";
const MAX_HISTORY = 10;
const BOX_PUSH_DELAY = 320;  // задержка при толкании ящика

const boxMoveSound = new Audio(
  `${import.meta.env.BASE_URL}audio/move-box.mp3`
);

const playBoxMoveSound = () => {
  boxMoveSound.currentTime = 0;
  boxMoveSound.play().catch(() => { });
};

/* ==== UTILS ==== */

const rotationMap: Record<Direction, number> = {
  up: 180,
  right: -90,
  down: 0,
  left: 90,
};

function getShortestAngle(current: number, target: number) {
  return current + ((target - current + 540) % 360) - 180;
}


const parseLevel = (level: string[]): SokobanState => {
  const grid: CellSymbol[][] = level.map((row) =>
    row.split("") as CellSymbol[]
  );

  const boxes: Box[] = [];
  let player: Position = { x: 0, y: 0 };

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "$" || cell === "*") {
        boxes.push({
          id: crypto.randomUUID(),
          position: { x, y },
          onTarget: cell === "*",
        });
      }

      if (cell === "@" || cell === "+") {
        player = { x, y };
      }
    });
  });

  return {
    grid,
    width: grid[0]?.length ?? 0,
    height: grid.length,
    boxes,
    player: {
      position: player,
    },
  };
};

const isWin = (boxes: Box[]) => {
  return boxes.every((b) => b.onTarget);
};


/* ==== STORE ==== */

interface GameStore {
  userSession: UserSession | null;
  unlockedLevels: number[];

  setUserSession: (session: UserSession) => void;
  initUserSession: (user: Gamer) => void;

  startNewGame: (levelIndex?: number) => void;
  tickTime: () => void;
  unlockLevel: (levelIndex: number) => void

  movePlayer: (direction: Direction) => void;
  clearPushTimeout: () => void;

  sounds: boolean;
  toggleSounds: () => void;
  setSounds: (value: boolean) => void;

  music: boolean;
  toggleMusic: () => void;
  setMusic: (value: boolean) => void;
}

let pushTimeout: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameStore>()(

  persist((set, get) => {

    // helper
    const applyGameUpdate = ({
      session,
      gameIndex,
      game,
      sokoban,
      newPlayer,
      boxes,
    }: {
      session: UserSession;
      gameIndex: number;
      game: GameState;
      sokoban: SokobanState;
      newPlayer: Position;
      boxes: Box[];
    }) => {
      const updatedBoxes = boxes.map((b) => {
        const cell = sokoban.grid[b.position.y][b.position.x];
        return {
          ...b,
          onTarget: cell === ".",
        };
      });
      const won = isWin(updatedBoxes);
      if (won) {
        const nextLevel = game.levelIndex + 1;
        if (levels[nextLevel]) {
          get().unlockLevel(nextLevel);
        }
      }
      const updatedGames = [...session.games];
      updatedGames[gameIndex] = {
        ...game,
        sokoban: {
          ...sokoban,
          player: {
            position: newPlayer,
          },
          boxes: updatedBoxes,
        },
        movesCount: game.movesCount + 1,
        completed: won,
      };
      set({
        userSession: {
          ...session,
          games: updatedGames,
        },
      });
    };


    // сам стор 
    return {
      userSession: null,

      unlockedLevels: [0],

      setUserSession: (session) => set({ userSession: session }),

      initUserSession: (user: Gamer) => {
        set((state) => {
          if (state.userSession) return state;

          return {
            userSession: {
              gamer: user,
              games: [],
              currentGameId: undefined,
            },
          };
        });
      },

      sounds: true,

      toggleSounds: () => {
        set((state) => ({
          sounds: !state.sounds,
        }));
      },

      setSounds: (value: boolean) => {
        set({ sounds: value });
      },

      music: false,
      toggleMusic: () => {
        set((state) => ({
          music: !state.music,
        }));
      },
      setMusic: (value: boolean) => {
        set({ music: value });
      },


      startNewGame: (levelIndex: number = 0) => {
        const session = get().userSession;
        if (!session) return;

        const level = levels[levelIndex];
        if (!level) return;

        const sokoban = parseLevel(level);

        const newGame: GameState = {
          id: crypto.randomUUID(),
          level,
          levelIndex,
          angle: rotationMap["right"], // начальное направление
          direction: "right",
          sokoban,
          movesCount: 0,
          time: 0,
          startedAt: Date.now(),
          completed: false,
        };

        let updatedGames = [newGame, ...session.games];

        if (updatedGames.length > MAX_HISTORY) {
          updatedGames = updatedGames.slice(0, MAX_HISTORY);
        }

        set({
          userSession: {
            ...session,
            games: updatedGames,
            currentGameId: newGame.id,
          },
        });
      },

      tickTime: () => {
        const session = get().userSession;
        if (!session || !session.currentGameId) return;

        const games = session.games;
        const gameIndex = games.findIndex(
          (g) => g.id === session.currentGameId
        );
        if (gameIndex === -1) return;
        const game = games[gameIndex];
        if (game.completed) return;
        const updatedGames = [...games];
        updatedGames[gameIndex] = {
          ...game,
          time: game.time + 1,
        };
        set({
          userSession: {
            ...session,
            games: updatedGames,
          },
        });
      },

      unlockLevel: (levelIndex: number) => {
        const current = get().unlockedLevels;
        if (current.includes(levelIndex)) return;
        const updated = [...current, levelIndex].sort((a, b) => a - b);
        set({
          unlockedLevels: updated,
        });
      },

      movePlayer: (direction) => {
        const session = get().userSession;
        if (!session || !session.currentGameId) return;
        const games = session.games;
        const gameIndex = games.findIndex(
          (g) => g.id === session.currentGameId
        );
        if (gameIndex === -1) return;
        const game = games[gameIndex];
        const sokoban = game.sokoban;
        const clearPushTimeout = get().clearPushTimeout;

        // ---------- ROTATION ----------
        if (game.direction !== direction) {
          clearPushTimeout();

          const targetAngle = rotationMap[direction];
          const newAngle = getShortestAngle(game.angle ?? 0, targetAngle);
          const updatedGames = [...games];
          updatedGames[gameIndex] = {
            ...game,
            direction,
            angle: newAngle,
          };

          set({
            userSession: {
              ...session,
              games: updatedGames,
            },
          });

          return;
        }

        // ---------- MOVEMENT ----------
        const { x, y } = sokoban.player.position;

        let dx = 0;
        let dy = 0;

        if (direction === "up") dy = -1;
        if (direction === "down") dy = 1;
        if (direction === "left") dx = -1;
        if (direction === "right") dx = 1;

        const nextX = x + dx;
        const nextY = y + dy;

        const nextCell = sokoban.grid[nextY]?.[nextX];
        if (!nextCell || nextCell === "#") return;

        const boxes = [...sokoban.boxes];

        // ---------- BOX ----------
        const boxIndex = boxes.findIndex(
          (b) => b.position.x === nextX && b.position.y === nextY
        );

        if (boxIndex !== -1) {
          clearPushTimeout();

          const box = boxes[boxIndex];

          const boxNextX = box.position.x + dx;
          const boxNextY = box.position.y + dy;

          const boxNextCell = sokoban.grid[boxNextY]?.[boxNextX];

          if (
            boxNextCell === "#" ||
            boxes.some(
              (b) =>
                b.position.x === boxNextX &&
                b.position.y === boxNextY
            )
          ) {
            return;
          }

          if (pushTimeout) return;

          pushTimeout = setTimeout(() => {
            const sessionNow = get().userSession;
            if (!sessionNow || !sessionNow.currentGameId) return;

            const gamesNow = sessionNow.games;
            const gameIdx = gamesNow.findIndex(
              (g) => g.id === sessionNow.currentGameId
            );

            if (gameIdx === -1) return;

            const gameNow = gamesNow[gameIdx];
            const sokobanNow = gameNow.sokoban;

            const boxesNow = [...sokobanNow.boxes];

            const bIndex = boxesNow.findIndex(
              (b) =>
                b.position.x === nextX &&
                b.position.y === nextY
            );

            if (bIndex === -1) return;

            const b = boxesNow[bIndex];

            boxesNow[bIndex] = {
              ...b,
              position: {
                x: b.position.x + dx,
                y: b.position.y + dy,
              },
            };

            // единая логика через helper
            applyGameUpdate({
              session: sessionNow,
              gameIndex: gameIdx,
              game: gameNow,
              sokoban: sokobanNow,
              newPlayer: { x: nextX, y: nextY },
              boxes: boxesNow,
            });

            if (get().sounds) playBoxMoveSound();

            pushTimeout = null;
          }, BOX_PUSH_DELAY);

          return;
        }

        // ---------- PLAYER ----------
        const newPlayer: Position = { x: nextX, y: nextY };

        applyGameUpdate({
          session,
          gameIndex,
          game,
          sokoban,
          newPlayer,
          boxes,
        });
      },
      // сброс задержки при толкании ящика
      clearPushTimeout: () => {
        if (pushTimeout) {
          clearTimeout(pushTimeout);
          pushTimeout = null;
        }
      },
    };
  },
    {
      name: STORAGE_KEY,
      //  исключаем music из localStorage
      partialize: (state) => ({
        // сохраняем всё кроме music
        ...state,
        music: undefined,
      }),
    }
  )
);

/* ==== HOOK ==== */

export const useGame = () => {
  const userSession = useGameStore((s) => s.userSession);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const movePlayer = useGameStore((s) => s.movePlayer);
  const tickTime = useGameStore((s) => s.tickTime);
  const sounds = useGameStore((s) => s.sounds);
  const toggleSounds = useGameStore((s) => s.toggleSounds);
  const music = useGameStore((s) => s.music);
  const toggleMusic = useGameStore((s) => s.toggleMusic);
  const setMusic = useGameStore((s) => s.setMusic);

  return {
    userSession,
    startNewGame,
    movePlayer,
    tickTime,
    sounds,
    toggleSounds,
    music,
    toggleMusic,
    setMusic
  };
};