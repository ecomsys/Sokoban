import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/games/sokoban/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
  open: true,
    fs: {
      strict: false, // разрешаем доступ к файловой системе
    },
    host: true, // разрешаем все хосты
    strictPort: true   
  },
});
