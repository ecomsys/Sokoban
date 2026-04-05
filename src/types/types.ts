export type CellSymbol =
  | "#"
  | "."
  | "$"
  | "@"
  | " "
  | "*"
  | "+"
  | "%"
  | "-";

export type LevelMap = string[];

export type Direction = "up" | "down" | "left" | "right";

/* ==== POSITION ==== */

export interface Position {
  x: number;
  y: number;
}

/* ==== ENTITIES ==== */

export interface Box {
  id: string;
  position: Position;
  onTarget: boolean;
}

export interface PlayerState {
  position: Position;
}

/* ==== GAME STATE ==== */

export interface SokobanState {
  grid: CellSymbol[][];
  width: number;
  height: number;
  player: PlayerState;
  boxes: Box[];
}

/* ==== GAME ==== */

export interface GameState {
  id: string;
  level: LevelMap;
  levelIndex: number;
  direction: Direction;
  sokoban: SokobanState;
  movesCount: number;
  time: number;
  startedAt: number;
  completed: boolean;
  started?: boolean;
  finishedAt?: number;
  angle?: number;
}

/* ==== USER ==== */

export interface Gamer {
  id: string;
  username?: string;
  photo_url?: string;
}

export interface UserSession {
  gamer: Gamer;
  games: GameState[];
  currentGameId?: string;
}