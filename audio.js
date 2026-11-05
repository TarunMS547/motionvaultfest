/**
 * Web Audio API Sound Synthesizer for Diwali Celebrations
 * Provides zero-dependency, authentic festive sound effects and ambient melodic chimes.
 */

class DiwaliAudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.bgmNoteIndex = 0;

    // Raag Yaman / Bhairavi pentatonic festive scale frequencies (Hz)
    // Sa, Re, Ga, Pa, Dha, Sa' (Festive evening celebratory notes)
    this.festiveScale = [
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Sa')
      587.33, // D5 (Re')
      659.25  // E5 (Ga')
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState) {
    this.initContext();
    if (forceState !== undefined) {
      this.isMuted = !forceState;
    } else {
      this.isMuted = !this.isMuted;
    }
    return !this.isMuted;
  }

  toggleBgm() {
    this.initContext();
    this.isBgmPlaying = !this.isBgmPlaying;
    if (this.isBgmPlaying) {
      if (this.isMuted) this.isMuted = false;
      this.startAmbientMelody();
    } else {
      this.stopAmbientMelody();
    }
    return this.isBgmPlaying;
  }

  // Generate white noise buffer
  createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Firework Explosion Sound (Thump + crackle tail)
  playExplosion(intensity = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(0.4 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);

    // Burst Noise
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.frequency.exponentialRampToValueAtTime(200, t + 0.8);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3 * intensity, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.8);
    }
  }

  // 2. Sparkler Hiss / Crackle
  playSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500 + Math.random() * 2000;
    filter.Q.value = 4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.16);
  }

  // 3. Rocket Launch Whistle
  playRocketLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.7);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  // 4. Chakri Zipping Buzz
  playChakriSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(650, t + 0.8);
    osc.frequency.exponentialRampToValueAtTime(180, t + 1.6);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.8);
  }

  // 5. Sacred Temple Bell / Diya Chime
  playBell(freq = 523.25) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // Overtone harmonic for rich brass bell sound
    const harmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2.75, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    harmonicGain.gain.setValueAtTime(0.1, t);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    harmonic.connect(harmonicGain);
    gain.connect(this.ctx.destination);
    harmonicGain.connect(this.ctx.destination);

    osc.start(t);
    harmonic.start(t);
    osc.stop(t + 1.9);
    harmonic.stop(t + 1.0);
  }

  // 6. Ambient Festive Melody Loop (Tanpura / Santoor style arpeggio)
  startAmbientMelody() {
    this.stopAmbientMelody();
    const playNextNote = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      const note = this.festiveScale[this.bgmNoteIndex % this.festiveScale.length];
      this.playPluckNote(note);
      
      // Melody pattern progression
      this.bgmNoteIndex = (this.bgmNoteIndex + 1) % this.festiveScale.length;
      const delays = [450, 350, 600, 400, 800];
      const nextDelay = delays[Math.floor(Math.random() * delays.length)];
      this.bgmTimer = setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  stopAmbientMelody() {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playPluckNote(freq) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.75);
  }
}

// Global audio instance
window.diwaliAudio = new DiwaliAudioSystem();

