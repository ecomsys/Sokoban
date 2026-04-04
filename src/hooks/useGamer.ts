// src/hooks/useGamer.ts

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

export const useGamer = () => {
  const userSession = useGameStore((s) => s.userSession);
  const setUserSession = useGameStore((s) => s.setUserSession);  

  useEffect(() => {
    // ЕСЛИ уже есть сессия – НИЧЕГО НЕ ДЕЛАЕМ
    if (userSession) return;    

     const gamer = {
        id:"1",       
        username: "@gamer",
        photo_url: "images/avatar.png",
      };

      setUserSession({
        gamer,
        games: [],
        currentGameId: undefined,
      });   

  }, [userSession, setUserSession]);  
};
