const A = ["Mighty", "Tiny", "Super", "Mega", "Turbo", "Cosmic", "Atomic", "Thunder", "Shadow", "Crystal", "Golden", "Iron", "Neon", "Stealth", "Rocket", "Laser", "Phantom", "Vortex", "Blazing", "Frosty", "Sparky", "Rusty", "Clunky", "Zippy", "Blinky", "Wobbly", "Grumpy", "Jolly", "Sneaky", "Dizzy"];
const B = ["Bot", "Tron", "Zord", "Droid", "Walker", "Crusher", "Blaster", "Dasher", "Smasher", "Sparky", "Bolts", "Gears", "Chip", "Byte", "Pixel", "Tank", "Jet", "Rex", "Max", "Zoom", "Whiz", "Prime", "Stomper", "Clanker", "Beeper", "Zapper", "Bonker", "Boomer", "Wobbler", "Tinker"];
export const generateRobotName = () => {
    const a = A[Math.floor(Math.random() * A.length)];
    const b = B[Math.floor(Math.random() * B.length)];
    return `${a} ${b}`;
};
