/**
 * Ambient Luxury Soundscape Synthesizer using Web Audio API.
 * Zero external audio file dependencies.
 * Provides:
 * - Ethereal ambient warm harmonic drone
 * - Silk whisper / fabric rustle noise filter on mouse drag
 * - Harmonic chime when changing chapters or revealing details
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch {
      // AudioContext not supported
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx && !muted) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    if (this.droneGain && this.ctx) {
      const target = muted ? 0 : 0.08;
      this.droneGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.5);
    } else if (!muted) {
      this.startAmbientDrone();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public startAmbientDrone() {
    if (!this.ctx || this.isMuted || this.droneGain) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.droneGain.gain.setTargetAtTime(0.08, this.ctx.currentTime, 1.2);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.droneGain.connect(this.filterNode);
      this.filterNode.connect(this.ctx.destination);

      // Warm luxury chord frequencies: C3 (130.81Hz), G3 (196.00Hz), D4 (293.66Hz), A4 (440Hz harmonic)
      const freqs = [130.81, 196.0, 261.63, 392.0];

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);

        // Subtle detune for natural analog warmth
        osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.25 / freqs.length, this.ctx.currentTime);

        osc.connect(oscGain);
        if (this.droneGain) {
          oscGain.connect(this.droneGain);
        }
        osc.start();
        this.droneOscillators.push(osc);
      });
    } catch {
      // Audio setup fallback
    }
  }

  /**
   * Delicate crystal bell chime on chapter navigation
   */
  public playChime(freqMultiplier: number = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33 * freqMultiplier, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880 * freqMultiplier, now + 0.15); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignore
    }
  }

  /**
   * Whispering silk sound on drag
   */
  public playFabricRustle(intensity: number = 0.5) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // Synthesize pink noise burst for fabric friction
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.11;
        b2 = 0.85 * b2 + white * 0.25;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05 * Math.min(1, intensity), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundEngine();
