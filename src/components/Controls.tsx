import type { Direction } from "@/types/types";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ControlsProps {
  startMoving: (dir: Direction) => void;
  stopMoving: () => void;
}

const Controls = ({ startMoving, stopMoving }: ControlsProps) => {
  const bind = (dir: Direction) => ({
    onTouchStart: () => {
      startMoving(dir);
    },
    onTouchEnd: () => {
      stopMoving();
    },
    onTouchCancel: stopMoving,

    //  бонус: работает и мышкой
    onMouseDown: () => startMoving(dir),
    onMouseUp: stopMoving,
    onMouseLeave: stopMoving,
  });

  const btn =
    "w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur rounded-full active:scale-95 transition cursor-pointer active:bg-teal-900";

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="fixed bottom-3 right-4.5 select-none touch-manipulation rounded-full bg-white/15 p-2">
      <div className="grid grid-cols-3 grid-rows-3 gap-0">
        {/* пусто */}
        <div />

        {/* UP */}
        <button {...bind("up")} className={btn}>
          <ChevronUp size={'2rem'} className="text-white" />
        </button>

        <div />

        {/* LEFT */}
        <button {...bind("left")} className={btn}>
          <ChevronLeft size={'2rem'} className="text-white" />
        </button>

        {/* центр (пусто или можно логотип) */}
        <div />

        {/* RIGHT */}
        <button {...bind("right")} className={btn}>
          <ChevronRight size={'2rem'} className="text-white" />
        </button>

        <div />

        {/* DOWN */}
        <button {...bind("down")} className={btn}>
          <ChevronDown size={'2rem'} className="text-white" />
        </button>

        <div />
      </div>
    </div>
  );
};

export default Controls;