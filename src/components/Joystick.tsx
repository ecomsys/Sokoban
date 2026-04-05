import React, { useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | null;

interface JoystickProps {
  onMove: (dir: Direction) => void;
}

const Joystick = ({ onMove }: JoystickProps) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const [lockedAxis, setLockedAxis] = useState<"x" | "y" | null>(null);

  const [dragging, setDragging] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });

  const maxRadius = 30; // радиус стика
  const deadZone = 50;  // минимальное движение  

  const handleStart = () => {
    setDragging(true);
  };

  const handleMove = (e: React.TouchEvent) => {
    if (!dragging || !baseRef.current) return;

    const touch = e.touches[0];
    const rect = baseRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    //  определяем ось ТОЛЬКО один раз
    if (!lockedAxis && distance > deadZone) {
      setLockedAxis(Math.abs(dx) > Math.abs(dy) ? "x" : "y");
    }

    let finalX = dx;
    let finalY = dy;

    //  блокируем одну ось
    if (lockedAxis === "x") {
      finalY = 0;
    } else if (lockedAxis === "y") {
      finalX = 0;
    }

    setStickPos({ x: finalX, y: finalY });

    // направление
    if (distance < deadZone) {
      onMove(null);
      return;
    }

    if (lockedAxis === "x") {
      onMove(dx > 0 ? "right" : "left");
    } else if (lockedAxis === "y") {
      onMove(dy > 0 ? "down" : "up");
    }
  };

  const handleEnd = () => {
    setDragging(false);
    setStickPos({ x: 0, y: 0 });
    setLockedAxis(null);
    onMove(null);
  };

  return (
    <div
      ref={baseRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="fixed bottom-2.5 right-4.5 w-[9rem] h-[9rem] bg-white/20 rounded-full flex items-center justify-center touch-none"
    >
      <div
        className="select-none pointer-events-none relative w-[6rem] h-[6rem] rounded-full transition-transform overflow-hidden"
        style={{
          transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
        }}>
        <img
          className="w-full h-full object-cover"
          src={`${import.meta.env.BASE_URL}images/speed-stick.webp`}
          alt=""
        />
      </div>
    </div>
  );
};

export default Joystick;