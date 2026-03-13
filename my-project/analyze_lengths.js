import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const heads = [
    "afro", "hatBeanie", "pomp", "turban", "shaved1", "short1", "long", "bangs", "hijab", "bear"
];

let res = "";
heads.forEach(head => {
    res += `--- Head: ${head} ---\n`;
    const avatar = createAvatar(openPeeps, { head: [head] });
    const svg = avatar.toString();
    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);
    
    if (headMatch && faceMatch) {
        const headArea = svg.substring(headMatch.index, faceMatch.index);
        const paths = headArea.match(/<path[^>]+>/g) || [];
        paths.forEach(p => {
            const dMatch = p.match(/d="([^"]+)"/);
            const fillMatch = p.match(/fill="([^"]+)"/);
            const dLen = dMatch ? dMatch[1].length : 0;
            const fill = fillMatch ? fillMatch[1] : 'none';
            res += `  Path: fill=${fill}, length=${dLen}\n`;
        });
    }
});

fs.writeFileSync('lengths.txt', res);
console.log('Written to lengths.txt');
