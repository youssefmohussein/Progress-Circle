import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["afro"],
});

let svg = avatar.toString();
const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

if (headMatch && faceMatch) {
    const headArea = svg.substring(headMatch.index, faceMatch.index);
    console.log("--- AFRO HEAD AREA XML ---");
    console.log(headArea);
}
