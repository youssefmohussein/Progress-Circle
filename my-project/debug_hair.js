import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
});

let svg = avatar.toString();
const headGroupRegex = /(<g transform="(?:matrix|translate)\([^)]+\)">[\s\S]*?<g fill="#000">)([\s\S]*?)(<\/g>[\s\S]*?<\/g>)/;
const match = svg.match(headGroupRegex);

if (match) {
    console.log("Prefix found, length:", match[1].length);
    console.log("Content found, length:", match[2].length);
    console.log("First 200 chars of content:", JSON.stringify(match[2].slice(0, 200)));
} else {
    console.log("Match NOT found!");
}
