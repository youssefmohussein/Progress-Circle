import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
    accessories: ["glasses"]
});

let svg = avatar.toString();
const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

if (headMatch && faceMatch) {
    const headArea = svg.substring(headMatch.index, faceMatch.index);
    if (headArea.includes('fill="#000"')) {
        console.log("Glasses are in the HEAD group.");
    } else {
        const rest = svg.substring(faceMatch.index);
        if (rest.includes('fill="#000"')) {
            console.log("Glasses are AFTER the head group (likely in face or body).");
        }
    }
}
