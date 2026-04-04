let audioContext: AudioContext | null = null;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

export const resumeAudioContext = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }
};