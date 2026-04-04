import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFullscreen } from "@/hooks/useFullScreen";

export default function Home() {
  const navigate = useNavigate();
  const { openFullscreen } = useFullscreen();

  const baseBtn =
    "font-[Montserrat] cursor-pointer font-bold text-[1rem] xs:text-[1.25rem] w-full sm:w-[initial] xs:max-w-xs px-10 py-4 rounded-2xl transition-all duration-200";

  const tealBtn = `
    bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700
    text-white
    shadow-[inset_0_0.375rem_0.75rem_rgba(255,255,255,0.2),0_0.375rem_0.75rem_rgba(0,0,0,0.25)]
    hover:shadow-[inset_0_0.0625rem_0.125rem_rgba(255,255,255,0.3),0_0.25rem_0.625rem_rgba(0,0,0,0.3)]
    active:translate-y-[0.0625rem]
  `;

  return (
    <div className="mt-36 sm:mt-0 h-full sm:h-[100dvh] flex flex-col items-center justify-center px-2.5 relative min-w-[20rem]">

      {/* КНОПКА НАЗАД (fixed) */}
      <a
        href="https://ecomsys.ru"
        className="
          cursor-pointer
          fixed top-4 sm:top-8 left-2.5 sm:left-8
          w-[5rem] h-[5rem]
          rounded-full
          flex items-center justify-center
          bg-white/20 backdrop-blur-md
          border border-white/30
          shadow-lg
          hover:bg-white/30 hover:scale-105
          text-white  hover:text-teal-800
          transition
        "
      >
        <svg className="w-[3.4375rem] h-[3.4375rem]">
          <use xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#back`} />
        </svg>
      </a>

      {/* Заголовок */}
      <div className="flex flex-col gap-4 items-center ">
        <h1 className="text-center leading-[1] uppercase flex flex-col gap-2 mb-2">
          <span className="text-5xl xs:text-6xl md:text-7xl font-extrabold text-teal-800">Sokoban</span>
          <span className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-teal-800">Японская головоломка</span>
        </h1>

        {/* Подзаголовок / описание */}
        <p className="text-xl xs:text-2xl md:text-3xl font-semibold text-teal-900 text-center max-w-[85%]  sm:max-w-3xl mb-3 leading-[1] ">
          Добро пожаловать! Перемещайте ящики по складу и расставьте их на отмеченные позиции.
          Продумывайте каждый шаг, чтобы решить задачу за минимальное количество ходов!
        </p>

        {/* Кнопка начать игру */}
        <button
          className={`${baseBtn} ${tealBtn} cursor-pointer`}
          onClick={() => {
            openFullscreen();
            navigate("/game");
          }}
        >
          <span className="leading-[1]">Начать игру</span>
        </button>

      </div>

      {/* Подпись разработчика */}
      <span className="text-[1rem] md:text-[1.125rem] text-teal-900 mt-5">
        Разработано{" "}
        <Link
          className="text-teal-600 uppercase font-semibold"
          to="https://ecomsys.ru"
        >
          EcomSys.ru
        </Link>
      </span>


    </div>
  );
}