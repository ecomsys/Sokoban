import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// фикс для __dirname в ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { levels } from "../src/pages/Game/Levels.ts";

function markOutside(level) {
  const h = level.length;
  const w = Math.max(...level.map(row => row.length));

  const grid = level.map(row => row.padEnd(w, " ").split(""));
  const visited = Array.from({ length: h }, () => Array(w).fill(false));

  const queue = [];

  for (let x = 0; x < w; x++) {
    queue.push([0, x], [h - 1, x]);
  }
  for (let y = 0; y < h; y++) {
    queue.push([y, 0], [y, w - 1]);
  }

  while (queue.length) {
    const [y, x] = queue.shift();

    if (
      y < 0 || y >= h ||
      x < 0 || x >= w ||
      visited[y][x] ||
      grid[y][x] !== " "
    ) continue;

    visited[y][x] = true;
    grid[y][x] = "-";

    queue.push(
      [y + 1, x],
      [y - 1, x],
      [y, x + 1],
      [y, x - 1]
    );
  }

  return grid.map(row => row.join(""));
}

// обработка
const processedLevels = levels.map(markOutside);

// генерим новый файл
const output = `import type { LevelMap } from "../src/types/types";

export const levels: LevelMap[] = ${JSON.stringify(processedLevels, null, 2)};
`;

// путь
const filePath = path.resolve(__dirname, "../src/pages/Game/Levels2.ts");

// запись
fs.writeFileSync(filePath, output, "utf-8");

console.log("Levels.ts успешно создан!");