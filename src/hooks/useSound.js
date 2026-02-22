import { useCallback } from 'react';

// =====================================================
//  TECHNO BEAT ENGINE – Pure Web Audio API synthesizer
//  Generates a real 4-on-the-floor techno beat loop
// =====================================================
class TechnoBeatEngine {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.nextNoteTime = 0;
        this.currentBeat = 0;
        this.tempo = 128;         // BPM
        this.timerID = null;
        this.masterGain = null;
    }

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioCtx.destination);
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // Kick drum using oscillator + noise burst
    playKick(time) {
        const ctx = this.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.3);
    }

    // Hi-hat using filtered noise
    playHihat(time, open = false) {
        const ctx = this.audioCtx;
        const dur = open ? 0.2 : 0.05;
        const bufferSize = ctx.sampleRate * dur;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(time);
    }

    // Snare: noise + tone
    playSnare(time) {
        const ctx = this.audioCtx;
        // Noise part
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(time);

        // Tone part
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.4, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    // Bass synth line
    playBass(time, note) {
        const ctx = this.audioCtx;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, time);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, time);
        filter.frequency.linearRampToValueAtTime(800, time + 0.1);
        filter.frequency.linearRampToValueAtTime(300, time + 0.2);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.25);
    }

    scheduleNote() {
        const secondsPerBeat = 60.0 / this.tempo;
        const beat = this.currentBeat % 16; // 4 bar loop (16 steps at 16th notes, or 4 at quarter notes)

        const time = this.nextNoteTime;

        // Kick on 1, 2, 3, 4 (every beat)
        if (beat % 4 === 0) this.playKick(time);

        // Snare on 2 and 4
        if (beat % 8 === 4) this.playSnare(time);

        // Hi-hat on every 8th note
        if (beat % 2 === 0) this.playHihat(time, beat % 4 === 2);

        // Bass on 1 and sometimes 3
        const bassNotes = [55, 65, 55, 73]; // A1, C2, A1, D2
        if (beat % 4 === 0) {
            this.playBass(time, bassNotes[Math.floor(beat / 4) % bassNotes.length]);
        }

        this.nextNoteTime += secondsPerBeat / 4; // 16th note resolution
        this.currentBeat++;
    }

    scheduler() {
        while (this.nextNoteTime < this.audioCtx.currentTime + 0.1) {
            this.scheduleNote();
        }
        this.timerID = setTimeout(() => this.scheduler(), 25);
    }

    start() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentBeat = 0;
        this.nextNoteTime = this.audioCtx.currentTime;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
    }
}

// Singleton
let beatEngine = null;
const getBeatEngine = () => {
    if (!beatEngine) beatEngine = new TechnoBeatEngine();
    return beatEngine;
};

// =====================================================
//  useSound Hook
// =====================================================
export const useSound = () => {
    const getCtx = () => new (window.AudioContext || window.webkitAudioContext)();

    const playTone = useCallback((freq, type, duration) => {
        const audioCtx = getCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, []);

    const playClick = () => playTone(800, 'sine', 0.08);

    const playBoing = () => {
        const audioCtx = getCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.08);
        osc.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    };

    const playSuccess = () => {
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.15), i * 80);
        });
    };

    const playScratch = () => {
        const audioCtx = getCtx();
        const dur = 0.25;
        const bufferSize = audioCtx.sampleRate * dur;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        // Create a "vinyl scratch" by modulating noise with a sweep
        for (let i = 0; i < bufferSize; i++) {
            const t = i / audioCtx.sampleRate;
            const sweep = Math.sin(t * 200 * Math.PI * (1 - t * 2));
            data[i] = (Math.random() * 2 - 1) * sweep * 0.5;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
    };

    const playCamera = () => {
        const audioCtx = getCtx();
        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        noise.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
    };

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.1;
            u.pitch = 1.4;
            u.volume = 0.7;
            window.speechSynthesis.speak(u);
        }
    }, []);

    const startMusic = () => getBeatEngine().start();
    const stopMusic = () => getBeatEngine().stop();

    return { playClick, playBoing, playSuccess, playScratch, playCamera, speak, startMusic, stopMusic };
};
