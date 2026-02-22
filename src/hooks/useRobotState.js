import { useState, useCallback } from 'react';
import Heads from '../components/RobotParts/Heads';
import Bodies from '../components/RobotParts/Bodies';
import Legs from '../components/RobotParts/Legs';
import Arms from '../components/RobotParts/Arms';
import { generateRobotName } from '../utils/robotNames';

const HERO_PALETTES = [
    { name: 'Fire Hero', h: 350, b: 350, l: 40, a: 350 },
    { name: 'Ocean Hero', h: 200, b: 200, l: 200, a: 200 },
    { name: 'Jungle Hero', h: 120, b: 120, l: 120, a: 120 },
    { name: 'Golden Hero', h: 45, b: 45, l: 45, a: 45 },
    { name: 'Space Hero', h: 270, b: 270, l: 270, a: 270 },
    { name: 'Shadow Hero', h: 0, b: 0, l: 0, a: 0 },
    { name: 'Laser Hero', h: 170, b: 170, l: 170, a: 170 },
    { name: 'Candy Hero', h: 310, b: 310, l: 310, a: 310 },
];

const EMOTIONS = ['😊', '😎', '🤩', '🤪', '🤠', '🤖', '👑', '🔥'];

export const useRobotState = () => {
    const [headIndex, setHeadIndex] = useState(0);
    const [bodyIndex, setBodyIndex] = useState(0);
    const [legsIndex, setLegsIndex] = useState(0);
    const [armsIndex, setArmsIndex] = useState(0);
    const [emotionIndex, setEmotionIndex] = useState(0);
    const [robotName, setRobotName] = useState(generateRobotName());
    const [palette, setPalette] = useState(HERO_PALETTES[3]);
    const [scale, setScale] = useState(1); // Default scale

    const randomize = useCallback(() => {
        setHeadIndex(Math.floor(Math.random() * Heads.length));
        setBodyIndex(Math.floor(Math.random() * Bodies.length));
        setLegsIndex(Math.floor(Math.random() * Legs.length));
        setArmsIndex(Math.floor(Math.random() * Arms.length));
        setEmotionIndex(Math.floor(Math.random() * EMOTIONS.length));
        setPalette(HERO_PALETTES[Math.floor(Math.random() * HERO_PALETTES.length)]);
        setRobotName(generateRobotName());
    }, []);

    const nextHead = useCallback(() => setHeadIndex(p => (p + 1) % Heads.length), []);
    const nextBody = useCallback(() => setBodyIndex(p => (p + 1) % Bodies.length), []);
    const nextLegs = useCallback(() => setLegsIndex(p => (p + 1) % Legs.length), []);
    const nextArms = useCallback(() => setArmsIndex(p => (p + 1) % Arms.length), []);
    const nextEmotion = useCallback(() => setEmotionIndex(p => (p + 1) % EMOTIONS.length), []);
    const nextName = useCallback(() => setRobotName(generateRobotName()), []);

    const splashColor = useCallback(() => {
        setPalette(HERO_PALETTES[Math.floor(Math.random() * HERO_PALETTES.length)]);
    }, []);

    const changeSize = useCallback(() => {
        // Random scale between 0.5 and 2.2 in steps of 0.2
        const scales = [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.2];
        let newScale;
        do {
            newScale = scales[Math.floor(Math.random() * scales.length)];
        } while (newScale === scale);
        setScale(newScale);
        return newScale;
    }, [scale]);

    return {
        indices: { headIndex, bodyIndex, legsIndex, armsIndex, emotionIndex },
        robotName,
        palette,
        scale,
        EMOTIONS,
        actions: {
            randomize,
            nextHead,
            nextBody,
            nextLegs,
            nextArms,
            nextEmotion,
            nextName,
            splashColor,
            changeSize,
        }
    };
};
