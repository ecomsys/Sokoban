import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const navigate = useNavigate();

  const rulesList = [
    "Игра проходит на складе, где есть стены, ящики и целевые клетки для их размещения.",
    "Вы управляете персонажем, который может двигаться вверх, вниз, влево и вправо.",
    "Персонаж может толкать ящики, но не может их тянуть.",
    "За один ход можно переместить только один ящик, если за ним есть свободная клетка.",
    "Нельзя пройти сквозь стены или через другие ящики.",
    "Цель игры — переместить все ящики на отмеченные целевые клетки.",
    "Если ящик зажат в углу или у стены без возможности сдвига, уровень может стать непроходимым.",
    "Продумывайте свои действия заранее, чтобы решить задачу за минимальное количество ходов."
  ];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const buttonBase = "font-[Montserrat] font-bold text-xl md:text-2xl px-6 py-3 rounded-2xl transition-all duration-200 shadow-md w-full max-w-xs";

  const buttonTeal = "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white hover:scale-105 active:translate-y-[0.0625rem]";

  return (
    <div className="flex flex-col gap-8 px-2.5 pt-8 pb-16 bg-teal-50/10 items-center min-w-[20rem]">

      {/* Кнопка "Вернуться в игру" */}
      <button
        className={`${buttonBase} ${buttonTeal} cursor-pointer`}
        onClick={() => navigate("/game")}
      >
        Вернуться в игру
      </button>

      {/* Заголовок */}
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-center">
        Правила игры
      </h1>

      {/* Вступление */}
      <p className={`text-xl md:text-2xl max-w-2xl text-teal-900 text-center transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        Добро пожаловать в Sokoban! Перемещайте ящики по складу и расставьте их на нужные позиции. Ниже — основные правила игры:
      </p>

      {/* Список правил */}
      <ul className="flex flex-col gap-4 max-w-3xl w-full">
        {rulesList.map((rule, index) => (
          <li
            key={index}
            className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 
                         rounded-2xl p-4 shadow-[0_0.375rem_0.625rem_rgba(0,0,0,0.2),0_0.125rem_0.25rem_rgba(0,0,0,0.1)]
                         text-white font-semibold text-lg transition-all transform"
            style={{
              transitionDelay: `${index * 150}ms`,
              transitionProperty: "opacity, transform",
              transitionDuration: "500ms",
              transitionTimingFunction: "ease-out",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(1rem)"
            }}
          >
            <span className="font-bold mr-2">{index + 1}.</span>
            {rule}
          </li>
        ))}
      </ul>

    </div>
  );
}