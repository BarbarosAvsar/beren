export class NameService {
  static #adjectives = [
    "Turbo",
    "Mighty",
    "Steady",
    "Nova",
    "Iron",
    "Neon",
    "Quantum",
    "Brisk",
    "Solar",
    "Echo",
    "Arctic",
    "Rapid",
  ];

  static #nouns = [
    "Bot",
    "Walker",
    "Unit",
    "Core",
    "Engine",
    "Spark",
    "Forge",
    "Scout",
    "Pilot",
    "Gear",
    "Ranger",
    "Frame",
  ];

  next() {
    const adjective = NameService.#adjectives[Math.floor(Math.random() * NameService.#adjectives.length)];
    const noun = NameService.#nouns[Math.floor(Math.random() * NameService.#nouns.length)];
    return `${adjective} ${noun}`;
  }
}
