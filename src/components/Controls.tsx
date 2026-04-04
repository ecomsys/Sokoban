import type { Direction } from "@/types/types";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { engineSound } from "@/classes/engineSound";

interface ControlsProps {
  startMoving: (dir: Direction) => void;
  stopMoving: () => void;
}

const Controls = ({ startMoving, stopMoving }: ControlsProps) => {

  const bind = (dir: Direction) => ({

    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      startMoving(dir);
    },

    onPointerUp: (e: React.PointerEvent) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      stopMoving();
    },

    onPointerCancel: stopMoving,
  });


  const btn =
    "w-12 h-12 flex items-center justify-center bg-teal-900/20 backdrop-blur rounded-full transition active:bg-teal-900/70";

  return (
    <div onClick={() => { engineSound.initAudio() }} onContextMenu={(e) => e.preventDefault()} className="fixed bottom-3 right-4.5 select-none touch-none rounded-full bg-white/15 p-2">
      <div className="grid grid-cols-3 grid-rows-3 gap-0">
        {/* пусто */}
        <div />

        {/* UP */}
        <div {...bind("up")} className={btn} style={{ touchAction: "manipulation" }}>
          <ChevronUp size={'2rem'} className="text-white" />
        </div>

        <div />

        {/* LEFT */}
        <div {...bind("left")} className={btn} style={{ touchAction: "manipulation" }}>
          <ChevronLeft size={'2rem'} className="text-white" />
        </div>

        {/* центр (пусто или можно логотип) */}
        <div />

        {/* RIGHT */}
        <div {...bind("right")} className={btn} style={{ touchAction: "manipulation" }}>
          <ChevronRight size={'2rem'} className="text-white" />
        </div>

        <div />

        {/* DOWN */}
        <div {...bind("down")} className={btn} style={{ touchAction: "manipulation" }}>
          <ChevronDown size={'2rem'} className="text-white" />
        </div>

        <div />
      </div>
    </div>
  );
};

export default Controls;