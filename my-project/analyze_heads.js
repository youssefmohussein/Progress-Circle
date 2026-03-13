import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const heads = [
    "afro", "bangs", "bangs2", "bantuKnots", "bear", "bun", "bun2", "buns", "cornrows", "cornrows2",
    "dreads1", "dreads2", "flatTop", "flatTopLong", "grayBun", "grayMedium", "grayShort", "hatBeanie",
    "hatHip", "hijab", "long", "longAfro", "longBangs", "longCurly", "medium1", "medium2", "medium3",
    "mediumBangs", "mediumBangs2", "mediumBangs3", "mediumStraight", "mohawk", "mohawk2", "noHair1",
    "noHair2", "noHair3", "pomp", "shaved1", "shaved2", "shaved3", "short1", "short2", "short3",
    "short4", "short5", "turban", "twists", "twists2"
];

let results = "";
heads.forEach(head => {
    const avatar = createAvatar(openPeeps, { head: [head] });
    const svg = avatar.toString();
    const headStart = svg.indexOf('<g transform="matrix');
    const faceStart = svg.indexOf('<g transform="translate(315 248)"');
    
    if (headStart !== -1 && faceStart !== -1) {
        const headArea = svg.substring(headStart, faceStart);
        const fills = [...new Set(headArea.match(/fill="#([a-fA-F0-9]{3,6})"/g) || [])];
        results += `${head}: ${fills.join(', ')}\n`;
    } else {
        results += `${head}: RANGE NOT FOUND\n`;
    }
});

fs.writeFileSync('head_colors.txt', results);
console.log('Results written to head_colors.txt');
