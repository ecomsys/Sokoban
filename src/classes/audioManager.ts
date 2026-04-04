import rawConfig from "@/classes/musicConfig.json";
type MusicConfig = {
  tracks: string[];
};
const musicConfig = rawConfig as MusicConfig;

let audioUnlocked = false;

// хранилище активных аудио
const activeAudios: Map<string, HTMLAudioElement[]> = new Map();

const getRandomTrack = (): string => {
  const tracks = musicConfig.tracks;
  const index = Math.floor(Math.random() * tracks.length);
  return tracks[index];
};

// ---------- UNLOCK ----------
export const unlockAudio = async (src?: string) => {
  if (audioUnlocked) return;

  const audio = new Audio(src || "");

  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audioUnlocked = true;
  } catch {
    // игнорируем ошибки autoplay policy
  }
};

// ---------- PLAY ----------
export const playSound = async (
  src: string,
  options?: {
    volume?: number;
    playbackRate?: number;
    loop?: boolean;
  }
) => {
  // гарантируем unlock перед проигрыванием
  if (!audioUnlocked) {
    await unlockAudio(src);
  }

  const audio = new Audio(src);

  if (options?.volume !== undefined) {
    audio.volume = options.volume;
  }

  if (options?.playbackRate !== undefined) {
    audio.playbackRate = options.playbackRate;
  }

  if (options?.loop) {
    audio.loop = options.loop;
  }

  try {
    await audio.play();
  } catch {
    // вв
  }

  // сохраняем ссылку
  if (!activeAudios.has(src)) {
    activeAudios.set(src, []);
  }

  activeAudios.get(src)!.push(audio);
};

// ---------- STOP ----------
export const stopSound = (src: string) => {
  const audios = activeAudios.get(src);
  if (!audios) return;

  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeAudios.delete(src);
};

// ---------- STOP ALL ----------
export const stopAllSounds = () => {
  activeAudios.forEach((audios) => {
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  });

  activeAudios.clear();
};

let currentMusic: HTMLAudioElement | null = null;

export const playMusic = async () => {
  if (!audioUnlocked) {
    await unlockAudio();
  }

  const src = getRandomTrack();

  // если уже играет — остановим
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }

  const audio = new Audio(src);
  audio.loop = false;

  currentMusic = audio;

  audio.addEventListener("ended", () => {
    playMusic(); // следующий рандомный трек
  });

  try {
    await audio.play();
  } catch {
    // fd
  }
};

export const stopMusic = () => {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }
};
