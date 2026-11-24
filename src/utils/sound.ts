// Cute toybox Web Audio API synthesizer (no external audio assets needed)

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private ensureContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.ensureContext();
  }

  // Cute soft marimba/bubble tap for UI buttons & presets
  public playButton(pitchBoost = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const base = 587.33 + pitchBoost * 45;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.28, now + 0.045);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Cute wooden xylophone hop for Spotlight Jump
  public playTick(step = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    // Cheerful major pentatonic scale: C5, D5, E5, G5, A5, C6
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = scale[step % scale.length];

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.06, now + 0.05);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(0.03, now);
    overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    overtone.connect(overGain);
    overGain.connect(ctx.destination);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.12);
    overtone.stop(now + 0.06);
  }

  // Gacha capsule tumbling inside glass dome ("뾱, 뺙, 뿅!")
  public playTumble(step = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const pitches = [440, 523.25, 659.25, 587.33, 783.99, 880];
    const freq = pitches[step % pitches.length];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.88, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.18, now + 0.055);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Cute gacha lever turn ("드르륵-찰칵!")
  public playCrank(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.0, 493.88, 587.33, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.065;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + 0.045);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.095);
    });
  }

  // Rubbery cartoon bounce ("띠용~!") when capsule drops out
  public playBounce(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Crisp bubble pop + sparkle ("뿅! 띠링") when capsule opens
  public playPop(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Bubble pop
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(340, now);
    popOsc.frequency.exponentialRampToValueAtTime(1180, now + 0.065);

    popGain.gain.setValueAtTime(0.001, now);
    popGain.gain.linearRampToValueAtTime(0.22, now + 0.008);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.11);

    // Cute sparkle ping
    const pingOsc = ctx.createOscillator();
    const pingGain = ctx.createGain();
    pingOsc.type = 'triangle';
    pingOsc.frequency.setValueAtTime(1318.5, now + 0.045);

    pingGain.gain.setValueAtTime(0.001, now + 0.045);
    pingGain.gain.linearRampToValueAtTime(0.11, now + 0.055);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    pingOsc.connect(pingGain);
    pingGain.connect(ctx.destination);
    pingOsc.start(now + 0.045);
    pingOsc.stop(now + 0.24);
  }

  // Cheerful toybox fanfare + cute double-chirp
  public playFanfare(isFinalTeam = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = isFinalTeam
      ? [
          { freq: 523.25, delay: 0, dur: 0.12 }, // C5
          { freq: 659.25, delay: 0.09, dur: 0.12 }, // E5
          { freq: 783.99, delay: 0.18, dur: 0.12 }, // G5
          { freq: 1046.5, delay: 0.27, dur: 0.16 }, // C6
          { freq: 1318.51, delay: 0.39, dur: 0.14 }, // E6
          { freq: 1567.98, delay: 0.5, dur: 0.42 }, // G6
        ]
      : [
          { freq: 523.25, delay: 0, dur: 0.13 }, // C5
          { freq: 659.25, delay: 0.09, dur: 0.13 }, // E5
          { freq: 783.99, delay: 0.18, dur: 0.13 }, // G5
          { freq: 1046.5, delay: 0.28, dur: 0.34 }, // C6
          { freq: 1318.51, delay: 0.41, dur: 0.22 }, // E6 cute chirp!
        ];

    melody.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();
      const subGain = ctx.createGain();
      const start = now + delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq * 0.5, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.16, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      subGain.gain.setValueAtTime(0.001, start);
      subGain.gain.linearRampToValueAtTime(0.06, start + 0.015);
      subGain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      sub.connect(subGain);
      gain.connect(ctx.destination);
      subGain.connect(ctx.destination);

      osc.start(start);
      sub.start(start);
      osc.stop(start + dur + 0.03);
      sub.stop(start + dur + 0.03);
    });
  }

  // Gentle descending sweep when resetting round
  public playReset(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [783.99, 659.25, 523.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }
}

export const sound = new SoundEngine();
