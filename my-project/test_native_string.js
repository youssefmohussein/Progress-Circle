import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
    headContrastColor: "ff00ff" // String instead of Array
});

const svg = avatar.toString();
console.log("Includes #ff00ff:", svg.includes('fill="#ff00ff"'));
// If it works, check where it applied.
if (svg.includes('fill="#ff00ff"')) {
    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);
    if (headMatch && faceMatch) {
         const headArea = svg.substring(headMatch.index, faceMatch.index);
         console.log("Applied in head area:", headArea.includes('fill="#ff00ff"'));
         console.log("Black still in head area:", headArea.includes('fill="#000"'));
    }
}
