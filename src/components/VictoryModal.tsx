import { type FC, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useGameStore } from "@/stores/gameStore";
import { playSound } from "@/classes/audioManager";

interface ModalProps {
  time: number;
  onRestart: () => void;
}

const VictoryModal: FC<ModalProps> = ({ time, onRestart }) => {
  const [confetti, setConfetti] = useState(false);
  const sounds = useGameStore((s) => s.sounds);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  useEffect(() => {
    queueMicrotask(() => {
      setConfetti(true);
    })

    if (sounds) playSound("/games/sokoban/audio/victory.mp3");
  }, []);

  // --- обработка клика по overlay ---
  const handleOverlayClick = () => {
    onRestart();
  };

  // --- чтобы клики по контенту не закрывали модалку ---
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50
                   bg-black/40 backdrop-blur-sm p-4"
        onClick={handleOverlayClick} // клик по overlay
      >
        <div
          className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
                     rounded-3xl shadow-[0_0.625rem_1.875rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]
                     w-full max-w-[26.25rem] p-8 flex flex-col items-center gap-6 animate-fadeIn"
          onClick={handleContentClick} // клики по контенту не закрывают
        >
          {/* Заголовок */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-[6.5rem] h-[6.5rem]">
              <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#cake`} />
            </svg>
            <span className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg leading-[1]">
              Мои поздравления !
            </span>
          </div>

          {/* Статистика */}
          <div className="flex flex-col gap-3 text-white text-xl md:text-2xl font-semibold text-center">
            <p className="leading-[1]">Вы наконец то навели порядок во всех складах !!!</p>
            <p>
              Время: <span className="font-bold">{minutes}:{seconds}</span>
            </p>

          </div>

          {/* Кнопка */}
          <button
            className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 leading-[1.1]
                       text-white font-bold text-xl px-6 py-4 rounded-2xl
                       shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.25),0_0.125rem_0.375rem_rgba(0,0,0,0.15)]
                       hover:scale-105 transition-transform duration-200
                       w-full max-w-[13.75rem] cursor-pointer"
            onClick={onRestart}
          >
            <span>Начать заново</span>
          </button>
        </div>
      </div>

      {confetti && (
        <Confetti
          numberOfPieces={150}
          recycle={false}
          gravity={0.3}
          tweenDuration={5000}
          initialVelocityX={{ min: -10, max: 10 }}
          initialVelocityY={{ min: -10, max: 10 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default VictoryModal;