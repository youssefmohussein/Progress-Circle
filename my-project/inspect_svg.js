import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const heads = [
    "afro", "bangs", "pomp", "bear", "hatBeanie", "hatHip", "hijab", "turban", "mohawk"
];

heads.forEach(head => {
    const avatar = createAvatar(openPeeps, {
        head: [head],
    });
    const svg = avatar.toString();
    console.log(`--- ${head} ---`);
    const fills = svg.match(/fill="#[a-fA-F0-9]{6}"/g) || [];
    const strokes = svg.match(/stroke="#[a-fA-F0-9]{6}"/g) || [];
    const uniqueFills = [...new Set(fills)];
    const uniqueStrokes = [...new Set(strokes)];
    console.log("Fills:", uniqueFills);
    console.log("Strokes:", uniqueStrokes);
});
