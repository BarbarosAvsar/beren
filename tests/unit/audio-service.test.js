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

describe("AudioService", () => {
  it("reuses a single audio context", () => {
    const context = new MockContext();
    const factory = vi.fn(() => context);
    const speech = { cancel: vi.fn(), speak: vi.fn() };

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
    const speech = { cancel: vi.fn(), speak: vi.fn() };

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
    expect(utterance.rate).toBe(0.92);
    expect(utterance.pitch).toBe(1.05);
    expect(utterance.volume).toBe(0.55);

    audio.destroy();
    expect(speech.cancel).toHaveBeenCalledTimes(2);
  });
});
