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
    const paths = headArea.match(/<path[^>]+>/g) || [];
    paths.forEach((p, idx) => {
        const dLen = (p.match(/d="([^"]+)"/) || [null, ''])[1].length;
        console.log(`Path ${idx}: len=${dLen}, content=${p.slice(0, 50)}`);
    });
}
