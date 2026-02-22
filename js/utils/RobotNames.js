/**
 * @class RobotNames
 * @description Utility class for generating random robot names.
 * Follows the Single Responsibility Principle.
 */
export class RobotNames {
    static #ADJECTIVES = [
        'Mighty', 'Tiny', 'Super', 'Mega', 'Turbo', 'Cosmic', 'Atomic', 'Thunder',
        'Shadow', 'Crystal', 'Golden', 'Iron', 'Neon', 'Stealth', 'Rocket', 'Laser',
        'Phantom', 'Vortex', 'Blazing', 'Frosty', 'Sparky', 'Rusty', 'Clunky', 'Zippy',
        'Blinky', 'Wobbly', 'Grumpy', 'Jolly', 'Sneaky', 'Dizzy'
    ];

    static #NOUNS = [
        'Bot', 'Tron', 'Zord', 'Droid', 'Walker', 'Crusher', 'Blaster', 'Dasher',
        'Smasher', 'Sparky', 'Bolts', 'Gears', 'Chip', 'Byte', 'Pixel', 'Tank',
        'Jet', 'Rex', 'Max', 'Zoom', 'Whiz', 'Prime', 'Stomper', 'Clanker',
        'Beeper', 'Zapper', 'Bonker', 'Boomer', 'Wobbler', 'Tinker'
    ];

    /**
     * Generates a random robot name by combining an adjective and a noun.
     * @returns {string} A robot name like "Turbo Gears".
     */
    static generate() {
        const adj = RobotNames.#ADJECTIVES[Math.floor(Math.random() * RobotNames.#ADJECTIVES.length)];
        const noun = RobotNames.#NOUNS[Math.floor(Math.random() * RobotNames.#NOUNS.length)];
        return `${adj} ${noun}`;
    }
}
