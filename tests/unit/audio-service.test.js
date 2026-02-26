import { describe, it, expect, vi } from "vitest";

import { AudioService } from "../../js/services/AudioService.js";

class MockNode {
  connect() {}
}

class MockOscillator extends MockNode {
  constructor() {
    super();
    this.frequency = {
      setValueAtTime() {},
      exponentialRampToValueAtTime() {},
      linearRampToValueAtTime() {},
    };
    this.type = "sine";
  }

  start() {}
  stop() {}
}

class MockGain extends MockNode {
  constructor() {
    super();
    this.gain = {
      value: 0,
      setValueAtTime() {},
      exponentialRampToValueAtTime() {},
      linearRampToValueAtTime() {},
    };
  }
}

class MockBuffer {
  constructor(size) {
    this.size = size;
  }

  getChannelData() {
    return new Float32Array(this.size);
  }
}

class MockSource extends MockNode {
  start() {}
}

class MockFilter extends MockNode {
  constructor() {
    super();
    this.type = "lowpass";
    this.frequency = {
      value: 0,
      setValueAtTime() {},
      linearRampToValueAtTime() {},
    };
  }
}

class MockContext {
  constructor() {
    this.state = "running";
    this.currentTime = 0;
    this.sampleRate = 48000;
    this.destination = new MockNode();
    this.createdGains = [];
  }

  createOscillator() {
    return new MockOscillator();
  }

  createGain() {
    const gain = new MockGain();
    this.createdGains.push(gain);
    return gain;
  }

  createBuffer(channels, size) {
    return new MockBuffer(size);
  }

  createBufferSource() {
    return new MockSource();
  }

  createBiquadFilter() {
    return new MockFilter();
  }

  resume() {}

  close() {
    this.state = "closed";
  }
}

function createSpeech(voices = []) {
  return {
    cancel: vi.fn(),
    speak: vi.fn(),
    getVoices: vi.fn(() => voices),
  };
}

describe("AudioService", () => {
  it("reuses a single audio context", () => {
    const context = new MockContext();
    const factory = vi.fn(() => context);
    const speech = createSpeech();

    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const audio = new AudioService({ audioContextFactory: factory, speech });

    audio.playClick();
    audio.playBoing();
    audio.playSuccess();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(context.createdGains[0].gain.value).toBe(0.18);
  });

  it("uses toddler-friendly speech defaults and teardown", () => {
    const factory = vi.fn(() => new MockContext());
    const speech = createSpeech();

    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const audio = new AudioService({ audioContextFactory: factory, speech });

    audio.speak("hello");
    expect(speech.cancel).toHaveBeenCalledTimes(1);
    expect(speech.speak).toHaveBeenCalledTimes(1);

    const utterance = speech.speak.mock.calls[0][0];
    expect(utterance.lang).toBe("en-US");
    expect(utterance.rate).toBe(0.92);
    expect(utterance.pitch).toBe(1.05);
    expect(utterance.volume).toBe(0.55);

    audio.destroy();
    expect(speech.cancel).toHaveBeenCalledTimes(2);
  });

  it("prefers en-US voice over non-English and other English voices", () => {
    const speech = createSpeech([
      { name: "Deutsch", lang: "de-DE", localService: true },
      { name: "English UK", lang: "en-GB", localService: true },
      { name: "English US", lang: "en-US", localService: false },
    ]);

    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const audio = new AudioService({ speech });
    audio.speak("hello");

    const utterance = speech.speak.mock.calls[0][0];
    expect(utterance.lang).toBe("en-US");
    expect(utterance.voice.name).toBe("English US");
  });

  it("falls back to available English voice when en-US is not present", () => {
    const speech = createSpeech([
      { name: "Deutsch", lang: "de-DE", localService: true },
      { name: "English AU", lang: "en-AU", localService: true },
    ]);

    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const audio = new AudioService({ speech });
    audio.speak("hello");

    const utterance = speech.speak.mock.calls[0][0];
    expect(utterance.lang).toBe("en-US");
    expect(utterance.voice.name).toBe("English AU");
  });

  it("still speaks with en-US lang when no English voice is available", () => {
    const speech = createSpeech([{ name: "Deutsch", lang: "de-DE", localService: true }]);

    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };

    const audio = new AudioService({ speech });
    audio.speak("hello");

    expect(speech.speak).toHaveBeenCalledTimes(1);
    const utterance = speech.speak.mock.calls[0][0];
    expect(utterance.lang).toBe("en-US");
    expect(utterance.voice).toBeUndefined();
  });
});
