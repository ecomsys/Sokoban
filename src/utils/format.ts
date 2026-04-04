// src/utils/formatTime.ts

/**
 * ==========================================================
 * Преобразует секунды в формат MM:SS
 * ==========================================================
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}
