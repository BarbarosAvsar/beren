export const UI_EVENTS = Object.freeze({
  ACTION: "ui:action",
  PART_CYCLE: "ui:part-cycle",
  NAME_CYCLE: "ui:name-cycle",
  EMOTION_CYCLE: "ui:emotion-cycle",
  HIDE_SEEK_FOUND: "ui:hide-seek-found",
});

export const ROBOT_EVENTS = Object.freeze({
  CHANGED: "robot:changed",
});

export const GAME_EVENTS = Object.freeze({
  THEME: "game:theme",
  MOVE: "game:move",
  DANCE: "game:dance",
  HIDE_SEEK_START: "game:hide-seek:start",
  HIDE_SEEK_TICK: "game:hide-seek:tick",
  HIDE_SEEK_FOUND: "game:hide-seek:found",
  HIDE_SEEK_TIMEOUT: "game:hide-seek:timeout",
  HIDE_SEEK_END: "game:hide-seek:end",
});

export const AUDIO_EVENTS = Object.freeze({
  MUSIC_START: "audio:music:start",
  MUSIC_STOP: "audio:music:stop",
  SPEAK: "audio:speak",
});

export const ALL_EVENT_TYPES = Object.freeze([
  ...Object.values(UI_EVENTS),
  ...Object.values(ROBOT_EVENTS),
  ...Object.values(GAME_EVENTS),
  ...Object.values(AUDIO_EVENTS),
]);

export const EVENT_TYPE_SET = new Set(ALL_EVENT_TYPES);
