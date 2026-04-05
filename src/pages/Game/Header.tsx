
import { useState, useRef, useEffect } from "react";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Timer from "@/components/Timer";
import type { LevelMap } from "@/types/types";
import { useGameStore } from "@/stores/gameStore";
import { useFullscreen } from "@/hooks/useFullScreen";
import { playMusic, stopMusic } from "@/classes/audioManager";

interface GameHeaderProps {
  className?: string,
  moves?: number;
  localTime: number;
  onRestart: (index: number) => void;
  isDisabled?: boolean;
  levels?: LevelMap[];
  currentLevelIndex?: number;
  boxesOnTargets: number;
  totalTargets: number;
}

export default function GameHeader({
  localTime,
  onRestart,
  isDisabled = false,
  currentLevelIndex,
  totalTargets,
  boxesOnTargets
}: GameHeaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sounds = useGameStore((s) => s.sounds);
  const toggleSounds = useGameStore((s) => s.toggleSounds);
  const music = useGameStore((s) => s.music);
  const toggleMusic = useGameStore((s) => s.toggleMusic);

  const { closeFullscreen } = useFullscreen();
  const navigate = useNavigate();

  const currentLevelIdx = currentLevelIndex ?? 0;

  const unlockedLevels = useGameStore(
    (s) => s.unlockedLevels
  );

  // закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (music) {
      playMusic();
    } else {
      stopMusic();
    }
  }, [music]);

  const toHome = () => {
    closeFullscreen();
    navigate('/home');
  }

  return (
    <div className="px-2 sm:px-4 pt-2.5 w-full min-w-[20rem]">
      <nav
        className="relative flex items-center flex-col menu:flex-row justify-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 border border-teal-600/40 shadow-[0_0.625rem_1.25rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]
      px-2 sm:px-3 lg:px-6 py-2 sm:py-4 rounded-lg sm:rounded-2xl gap-1.5 mx-auto w-full
      md:justify-evenly sm:gap-3 lg:gap-6"
      >
        <div className="flex items-center lg:gap-6 gap-3 justify-between">
          <div className="flex items-center lg:gap-6 gap-3">
            {/* на главную */}
            <button onClick={toHome} title="На главную">
              <svg className="cursor-pointer w-10 h-10 text-white transition-all duration-200 hover:scale-110 hover:text-yellow-400">
                <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#home`} />
              </svg>
            </button>

            {/* инфо */}
            <NavLink to="/rules" title="Правила игры">
              <svg className="w-10 h-10 text-white transition-all duration-200 hover:scale-110 hover:text-yellow-400">
                <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#info`} />
              </svg>
            </NavLink>

            {/* новая игра */}
            <button
              title="Заново"
              className="group cursor-pointer disabled:opacity-40 transition-all duration-200 hover:scale-110 active:scale-95"
              disabled={isDisabled}
              onClick={() => onRestart(currentLevelIdx ?? 0)}
            >
              <svg className="w-10 h-10 text-white group-hover:text-yellow-400 transition-colors">
                <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#refresh`} />
              </svg>
            </button>
          </div>


          {/* LEVEL DROPDOWN */}
          <div className="relative" ref={ref}>
            <button
              title="Выбрать доступный склад"
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-pointer flex items-center gap-[0.625rem] lg:gap-5 px-4 py-3.5 rounded-xl bg-teal-900/40 shadow-inner border border-blue-600/30"
            >
              <span className="font-semibold text-[1.25rem] lg:text-[2rem] leading-[1] text-white min-w-[5.875rem]">Склад {currentLevelIdx !== undefined ? currentLevelIdx + 1 : 1}</span>
            </button>

            {open && (
              <div className=" touch-auto scrollbar-none overflow-y-auto max-h-[16rem] absolute top-full mt-[0rem] left-0 bg-teal-800 border border-teal-600 rounded-xl z-50 min-w-[7.5rem] w-full"
              style={{ WebkitOverflowScrolling: "touch" }}>
                {unlockedLevels.map((levelIndex) => (
                  <button
                    key={levelIndex}
                    onClick={() => {
                      onRestart(levelIndex);
                      setOpen(false);
                    }}
                    className={`w-full cursor-pointer text-white text-center  px-3 py-3 text-xl hover:bg-teal-700 transition ${levelIndex === currentLevelIdx ? "bg-teal-700" : ""
                      }`}
                  >
                    Склад {levelIndex + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center">
          <h2 className="hidden soko:block text-4xl lg:text-5xl leading-[0.5] text-white font-extrabold">Sokoban</h2>
        </div>

        <div className="flex items-center lg:gap-6 gap-3">
          {/* ящики */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem]">
              <img
                className="w-full h-full object-cover"
                src={`${import.meta.env.BASE_URL}images/box.jpg`}
                alt=""
              />
            </div>
            <span className="font-semibold text-[1.25rem] lg:text-[2rem] leading-[1] text-white">{boxesOnTargets}/{totalTargets}</span>
          </div>

          {/* таймер */}
          <div className="menu:hidden md:block px-2 menu:px-4 py-2 rounded-md menu:rounded-xl bg-blue-800/40 shadow-inner border border-blue-600/30">
            <Timer time={localTime} />
          </div>

          {/* звуки  */}
          <button
            title="Вкл/выкл звуки"
            className="cursor-pointer"
            onClick={toggleSounds}
          >
            <svg className={`w-10 h-10 ${sounds ? "text-white" : "text-amber-500"} hover:text-amber-300 transition duration-300`}>
              <use xlinkHref={`${import.meta.env.BASE_URL}/sprite/sprite.svg#sounds`} />
            </svg>
          </button>

          {/* музыка  */}
          <button
            title="Вкл/выкл музыку"
            className="cursor-pointer"
            onClick={() => {
              toggleMusic();
            }
            }
          >
            <svg className={`w-10 h-10 ${!music ? "text-white" : "text-amber-500"} hover:text-amber-300 transition duration-300`}>
              <use xlinkHref={`${import.meta.env.BASE_URL}/sprite/sprite.svg#music`} />
            </svg>
          </button>

        </div>
      </nav>

    </div>
  );
}