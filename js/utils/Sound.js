/**
 * @class TechnoBeatEngine
 * @description Synthesizes a real 4-on-the-floor techno beat loop using Web Audio API.
 * Encapsulates all audio scheduling logic.
 */
class TechnoBeatEngine {
    #audioCtx = null;
    #isPlaying = false;
    #nextNoteTime = 0;
    #currentBeat = 0;
    #tempo = 128; // BPM
    #timerID = null;
    #masterGain = null;

    #init() {
        if (!this.#audioCtx) {
            this.#audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.#masterGain = this.#audioCtx.createGain();
            this.#masterGain.gain.value = 0.3;
            this.#masterGain.connect(this.#audioCtx.destination);
        }
        if (this.#audioCtx.state === 'suspended') {
            this.#audioCtx.resume();
        }
    }

    #playKick(time) {
        const ctx = this.#audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.connect(gain);
        gain.connect(this.#masterGain);
        osc.start(time);
        osc.stop(time + 0.3);
    }

    #playHihat(time, open = false) {
        const ctx = this.#audioCtx;
        const dur = open ? 0.2 : 0.05;
        const bufferSize = Math.floor(ctx.sampleRate * dur);
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
        gain.connect(this.#masterGain);
        noise.start(time);
    }

    #playSnare(time) {
        const ctx = this.#audioCtx;
        const bufferSize = Math.floor(ctx.sampleRate * 0.1);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        noise.connect(noiseGain);
        noiseGain.connect(this.#masterGain);
        noise.start(time);
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.4, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(oscGain);
        oscGain.connect(this.#masterGain);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    #playBass(time, note) {
        const ctx = this.#audioCtx;
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
        gain.connect(this.#masterGain);
        osc.start(time);
        osc.stop(time + 0.25);
    }

    #scheduleNote() {
        const secondsPerBeat = 60.0 / this.#tempo;
        const beat = this.#currentBeat % 16;
        const time = this.#nextNoteTime;
        if (beat % 4 === 0) this.#playKick(time);
        if (beat % 8 === 4) this.#playSnare(time);
        if (beat % 2 === 0) this.#playHihat(time, beat % 4 === 2);
        const bassNotes = [55, 65, 55, 73];
        if (beat % 4 === 0) this.#playBass(time, bassNotes[Math.floor(beat / 4) % bassNotes.length]);
        this.#nextNoteTime += secondsPerBeat / 4;
        this.#currentBeat++;
    }

    #scheduler() {
        while (this.#nextNoteTime < this.#audioCtx.currentTime + 0.1) {
            this.#scheduleNote();
        }
        this.#timerID = setTimeout(() => this.#scheduler(), 25);
    }

    start() {
        this.#init();
        if (this.#isPlaying) return;
        this.#isPlaying = true;
        this.#currentBeat = 0;
        this.#nextNoteTime = this.#audioCtx.currentTime;
        this.#scheduler();
    }

    stop() {
        this.#isPlaying = false;
        if (this.#timerID) {
            clearTimeout(this.#timerID);
            this.#timerID = null;
        }
    }

    get isPlaying() { return this.#isPlaying; }
}

/** @type {TechnoBeatEngine|null} Singleton instance of the beat engine. */
let _beatEngineInstance = null;

/**
 * @class SoundManager
 * @description Manages all sound effects and music for the application.
 * Implements the Singleton pattern via a module-level variable.
 */
export class SoundManager {
    #beatEngine;

    constructor() {
        this.#beatEngine = null;
    }

    #getBeatEngine() {
        if (!_beatEngineInstance) _beatEngineInstance = new TechnoBeatEngine();
        return _beatEngineInstance;
    }

    #getCtx() {
        return new (window.AudioContext || window.webkitAudioContext)();
    }

    #playTone(freq, type, duration, gainVal = 0.1) {
        try {
            const audioCtx = this.#getCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { /* AudioContext may require user gesture first */ }
    }

    playClick() { this.#playTone(800, 'sine', 0.08); }

    playBoing() {
        try {
            const audioCtx = this.#getCtx();
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
        } catch (e) { }
    }

    playSuccess() {
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.#playTone(freq, 'sine', 0.15), i * 80);
        });
    }

    playScratch() {
        try {
            const audioCtx = this.#getCtx();
            const dur = 0.25;
            const bufferSize = Math.floor(audioCtx.sampleRate * dur);
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
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
        } catch (e) { }
    }

    playCamera() {
        try {
            const audioCtx = this.#getCtx();
            const bufferSize = Math.floor(audioCtx.sampleRate * 0.08);
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
        } catch (e) { }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 1.4;
            utterance.volume = 0.7;
            window.speechSynthesis.speak(utterance);
        }
    }

    startMusic() { this.#getBeatEngine().start(); }
    stopMusic() { this.#getBeatEngine().stop(); }
    get isMusicPlaying() { return this.#getBeatEngine().isPlaying; }
}
