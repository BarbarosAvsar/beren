export class AudioService {
  #contextFactory;
  #speech;
  #context = null;
  #masterGain = null;
  #musicTimer = null;
  #isMusicPlaying = false;
  #step = 0;
  #nextTime = 0;
  #tempo = 124;

  constructor(options = {}) {
    this.#contextFactory = options.audioContextFactory ?? (() => {
      if (typeof window === "undefined") {
        return null;
      }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      return Ctx ? new Ctx() : null;
    });

    this.#speech = options.speech ?? (typeof window !== "undefined" ? window.speechSynthesis : null);
  }

  playClick() {
    this.#playTone({
      type: "square",
      frequency: 640,
      frequencyEnd: 420,
      duration: 0.08,
      gain: 0.07,
    });
  }

  playBoing() {
    this.#playTone({
      type: "triangle",
      frequency: 180,
      frequencyEnd: 520,
      duration: 0.2,
      gain: 0.1,
      ramp: "linear",
    });
  }

  playSuccess() {
    const notes = [392, 523, 659, 784];
    notes.forEach((note, index) => {
      this.#schedule(() => {
        this.#playTone({
          type: "sine",
          frequency: note,
          frequencyEnd: note,
          duration: 0.12,
          gain: 0.06,
        });
      }, index * 70);
    });
  }

  playScratch() {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const duration = 0.2;
    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i += 1) {
      const t = i / sampleCount;
      data[i] = (Math.random() * 2 - 1) * (1 - t) * 0.6;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(this.#masterGain);
    noise.start(ctx.currentTime);
  }

  startMusic() {
    if (this.#isMusicPlaying) {
      return;
    }

    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    this.#isMusicPlaying = true;
    this.#step = 0;
    this.#nextTime = ctx.currentTime;

    const scheduler = () => {
      if (!this.#isMusicPlaying) {
        return;
      }

      while (this.#nextTime < ctx.currentTime + 0.12) {
        this.#scheduleBeat(this.#nextTime, this.#step);
        this.#step += 1;
        this.#nextTime += 60 / this.#tempo / 4;
      }
    };

    scheduler();
    this.#musicTimer = setInterval(scheduler, 35);
  }

  stopMusic() {
    this.#isMusicPlaying = false;
    if (this.#musicTimer !== null) {
      clearInterval(this.#musicTimer);
      this.#musicTimer = null;
    }
  }

  speak(text) {
    if (!this.#speech || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    this.#speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.12;
    utterance.volume = 0.7;
    this.#speech.speak(utterance);
  }

  destroy() {
    this.stopMusic();
    if (this.#speech) {
      this.#speech.cancel();
    }
    if (this.#context && this.#context.state !== "closed") {
      this.#context.close();
    }
    this.#context = null;
    this.#masterGain = null;
  }

  #ensureContext() {
    if (this.#context) {
      if (this.#context.state === "suspended") {
        this.#context.resume();
      }
      return this.#context;
    }

    const created = this.#contextFactory();
    if (!created) {
      return null;
    }

    this.#context = created;
    this.#masterGain = this.#context.createGain();
    this.#masterGain.gain.value = 0.32;
    this.#masterGain.connect(this.#context.destination);

    if (this.#context.state === "suspended") {
      this.#context.resume();
    }

    return this.#context;
  }

  #playTone({ type, frequency, frequencyEnd, duration, gain, ramp = "exp" }) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    if (ramp === "linear") {
      osc.frequency.linearRampToValueAtTime(frequencyEnd, ctx.currentTime + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, frequencyEnd), ctx.currentTime + duration);
    }

    env.gain.setValueAtTime(gain, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(env);
    env.connect(this.#masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  #scheduleBeat(time, step) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const index = step % 16;

    if (index % 4 === 0) {
      this.#kick(time);
    }

    if (index % 8 === 4) {
      this.#snare(time);
    }

    if (index % 2 === 0) {
      this.#hihat(time, index % 4 === 2);
    }

    if (index % 4 === 0) {
      const bass = [55, 62, 65, 49][Math.floor(index / 4) % 4];
      this.#bass(time, bass);
    }
  }

  #kick(time) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.#masterGain);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  #snare(time) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const duration = 0.09;
    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1600;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#masterGain);
    noise.start(time);
  }

  #hihat(time, open) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const duration = open ? 0.16 : 0.05;
    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.#masterGain);
    noise.start(time);
  }

  #bass(time, note) {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return;
    }

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(note, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(260, time);
    filter.frequency.linearRampToValueAtTime(620, time + 0.08);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.#masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  #schedule(callback, delayMs) {
    setTimeout(callback, delayMs);
  }
}
