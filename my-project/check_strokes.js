import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
});

let svg = avatar.toString();
const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

if (headMatch && faceMatch) {
    const headArea = svg.substring(headMatch.index, faceMatch.index);
    console.log("--- Head Area Snippet ---");
    console.log(headArea.substring(0, 1000));
    
    const strokes = headArea.match(/stroke="#([a-fA-F0-9]{3,6})"/g) || [];
    console.log("Strokes found:", strokes);
    
    const fills = headArea.match(/fill="#([a-fA-F0-9]{3,6})"/g) || [];
    console.log("Fills found:", fills);
}
