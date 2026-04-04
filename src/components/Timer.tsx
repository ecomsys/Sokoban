// src/components/Timer.tsx
import { type FC } from "react";

interface TimerProps {
  /** Время в секундах */
  time: number;
}

const Timer: FC<TimerProps> = ({ time }) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center menu:gap-[0.625rem] lg:gap-5 text-white" title="Время игры" >
      <svg className="hidden menu:block w-[2.5rem] h-[2.5rem] lg:w-[3rem] lg:h-[3rem]">
        <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#clock`} />
      </svg>
      <span className="menu:min-w-[5.625rem] font-bold text-[1.45rem] menu:text-[1.875rem] lg:text-[2.225rem] leading-[1]">{minutes}:{seconds}</span>
    </div>
  );
};

export default Timer;
