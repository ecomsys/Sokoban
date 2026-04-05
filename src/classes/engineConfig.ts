export const ENGINE_SOUND_CONFIG = {
  //  Общая громкость
  masterVolume: 0.3,

  //  Частоты двигателя
  minFrequency: 60,
  maxFrequency: 140,

  // Скорость набора оборотов
  rpmGrowthSpeed: 140,

  // Стартовые значения
  startFrequency: 90,
  startRampTo: 180,

  // Вибрация двигателя
  wobbleAmount: 3,
  wobbleSpeed: 50,

  // Фильтр (тембр звука)
  lowpassFrequency: 1000,

  // Время затухания / старта
  fadeInTime: 0.15,
  fadeOutTime: 0.2,

  // Smoothing для частоты
  freqSmoothing: 0.03
};