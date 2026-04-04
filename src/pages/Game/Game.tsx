import { useState } from "react";
import { useGamer } from "@/hooks/useGamer";
import { useEffect } from "react";
import { getTargetsCount } from "@/utils/getTargetsCount";

import { useGame } from "@/stores/gameStore";
import { useGameStore } from "@/stores/gameStore";
import Board from "./Board/Board";
import { Loader } from "@/ui/loader";
import GameHeader from "./Header";
import Modal from "@/components/Modal";
import VictoryModal from "@/components/VictoryModal";
import { levels } from "./Levels";

import { usePlayerControls } from "@/hooks/usePlayerControls";
// import Joystick from "@/components/Joystick";
import Controls from "@/components/Controls";
import { useTimer } from "@/hooks/useTimer";

export default function Game() {
  const [showModal, setShowModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const { startMoving, stopMoving } = usePlayerControls();

  useGamer();
  useTimer();

  const {
    startNewGame,
    sounds,
    toggleSounds,
    music,
    toggleMusic,
    setMusic
  } = useGame();

  const currentGame = useGameStore((s) =>
    s.userSession?.games.find(
      (g) => g.id === s.userSession?.currentGameId
    )
  );

  const userSession = useGameStore((s) => s.userSession);
  const isWin = currentGame?.completed;
  let nextLevel: number | null;


  useEffect(() => {
    if (!userSession) return;
    if (!userSession.currentGameId) startNewGame();
  }, [userSession, startNewGame]);


  const isLastLevel = currentGame
    ? currentGame.levelIndex >= levels.length - 1
    : false;

  if (currentGame) {
    nextLevel = isLastLevel
      ? null
      : currentGame.levelIndex + 1;
  }

  useEffect(() => {
    if (!isWin || !nextLevel) {
      queueMicrotask(() => {
        setShowModal(false);
      })
      return;
    }

    const timeout = setTimeout(() => {
      setShowModal(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, [isWin]);

  useEffect(() => {
    if (!isWin || !isLastLevel) {
      queueMicrotask(() => {
        setShowVictoryModal(false);
      })
      return;
    }

    const timeout = setTimeout(() => {
      setShowVictoryModal(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isWin, isLastLevel]);

  if (!currentGame) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const grid = currentGame.sokoban.grid;
  const boxes = currentGame.sokoban.boxes;

  const totalTargets = getTargetsCount(grid);
  const boxesOnTargets = boxes.filter(b => b.onTarget).length;


  return (
    <div className="flex flex-col items-center gap-2.5">

      <GameHeader
        moves={currentGame.movesCount}
        localTime={currentGame.time ?? 0}
        onRestart={startNewGame}
        levels={levels}
        currentLevelIndex={currentGame?.levelIndex}
        className="my-container"
        sounds={sounds}
        toggleSounds={toggleSounds}
        music={music}
        toggleMusic={toggleMusic}
        setMusic={setMusic}
        boxesOnTargets={boxesOnTargets}
        totalTargets={totalTargets}
      />

      <Board grid={currentGame.sokoban.grid} />

      {showModal && (
        <div className="my-container">
          <Modal
            index={currentGame.levelIndex}
            time={currentGame.time}
            onNextLevel={() => {
              if (nextLevel !== null) startNewGame(nextLevel);
            }}
          />
        </div>
      )}

      {showVictoryModal && (
        <div className="my-container">
          <VictoryModal
            time={currentGame.time}
            onRestart={() => startNewGame(0)}
          />
        </div>
      )}

      {/* <Joystick onMove={handleMove} /> */}
      <Controls startMoving={startMoving} stopMoving={stopMoving} />

    </div>
  );
}