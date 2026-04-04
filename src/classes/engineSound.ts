import { ENGINE_SOUND_CONFIG as C } from "./engineConfig";

export class EngineSound {
  private ctx: AudioContext | null = null;

  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  private rafId: number | null = null;
  private startTime: number = 0;

  private enabled = true;
  private driving = false;
  private isRunning = false;

  // ---------- INIT ----------
  async initAudio() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
   
    if (!this.osc) {
      this.createNodes();
    }
  }

  // ---------- CREATE NODES ----------
  private createNodes() {
    if (!this.ctx) return;

    this.osc = this.ctx.createOscillator();
    this.gain = this.ctx.createGain();
    this.filter = this.ctx.createBiquadFilter();

    this.osc.type = "triangle";

    this.filter.type = "lowpass";
    this.filter.frequency.value = C.lowpassFrequency;

    this.gain.gain.value = 0.0001;

    this.osc.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);

    this.osc.start();
  }

  // ---------- ENABLE / DISABLE ----------
  setEnabled(value: boolean) {
    const prev = this.enabled;
    this.enabled = value;

    if (!prev && value) {
      // звук включили обратно
      if (this.driving) {
        this.start();
      }
    }

    if (!this.enabled) {
      this.stop();
    }
  }

  // ---------- DRIVE EVENTS ----------
  onDriveStart() {
    this.driving = true;

    if (!this.enabled) return;

    this.start();
  }

  onDriveStop() {
    this.driving = false;
    this.stop();
  }

  // ---------- START ----------
  async start() {
    await this.initAudio();

    if (!this.enabled) return;
    if (!this.ctx || !this.gain || this.isRunning) return;

    const now = this.ctx.currentTime;

    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(C.masterVolume, now, 0.05);

    this.startTime = performance.now();
    this.isRunning = true;

    this.loop();
  }

  // ---------- LOOP ----------
  private loop = () => {
    this.update();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update() {
    if (!this.ctx || !this.osc || !this.enabled || !this.driving) return;

    const t = (performance.now() - this.startTime) / 1000;

    let freq = C.minFrequency + t * C.rpmGrowthSpeed;
    freq = Math.min(freq, C.maxFrequency);

    const wobble =
      Math.sin(performance.now() / C.wobbleSpeed) * C.wobbleAmount;

    this.osc.frequency.setTargetAtTime(
      freq + wobble,
      this.ctx.currentTime,
      C.freqSmoothing
    );
  }

  // ---------- STOP ----------
  stop() {
    if (!this.ctx || !this.gain) return;

    const now = this.ctx.currentTime;

    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(0.0001, now, C.fadeOutTime);

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.isRunning = false;
  }

  // ---------- VOLUME ----------
  setVolume(volume: number) {
    if (!this.ctx || !this.gain) return;

    const now = this.ctx.currentTime;
    this.gain.gain.linearRampToValueAtTime(volume, now + 0.1);
  }

  // ---------- SHUTDOWN ----------
  shutdown() {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.gain) {
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setTargetAtTime(0.0001, now, C.fadeOutTime);
    }

    if (this.osc) {
      try {
        this.osc.stop(now + C.fadeOutTime);
      } catch {
        // вло
      }
    }

    this.osc?.disconnect();
    this.filter?.disconnect();
    this.gain?.disconnect();

    this.osc = null;
    this.filter = null;
    this.gain = null;

    this.isRunning = false;
    this.driving = false;
  }
}

export const engineSound = new EngineSound();