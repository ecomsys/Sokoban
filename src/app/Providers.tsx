import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Routes";
import OrientationGuard from "./OrentationGuard";
import autoREM from "@/utils/autoRem";

export function AppProviders() {
  const [visible, setVisible] = useState(false);  

  useEffect(() => {
    const cleanup = autoREM(1536, 16);

    // триггерим появление после маунта
    queueMicrotask(() => {
      setVisible(true);
    })

    return cleanup;
  }, []);

  return (
    <BrowserRouter basename="/games/sokoban">
      <OrientationGuard>
        <div className={`app ${visible ? "app--visible" : ""}`}>
          <AppRouter />
        </div>
      </OrientationGuard>
    </BrowserRouter>
  );
}
export default AppProviders;
