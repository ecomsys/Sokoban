export const Player = ({ angle }: { angle: number }) => {
  return (
    <div
      className="w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem]"
      style={{
        transform: `rotate(${angle}deg)`,
        transition: "transform 350ms ease-in-out",
      }}
    >
      <img className="w-full h-full object-cover" src={`${import.meta.env.BASE_URL}images/tractor.png`} alt="" />
    </div>
  );
};