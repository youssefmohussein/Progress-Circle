import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const heads = [
    "afro", "bangs", "bangs2", "bantuKnots", "bear", "bun", "bun2", "buns", "cornrows", "cornrows2",
    "dreads1", "dreads2", "flatTop", "flatTopLong", "grayBun", "grayMedium", "grayShort", "hatBeanie",
    "hatHip", "hijab", "long", "longAfro", "longBangs", "longCurly", "medium1", "medium2", "medium3",
    "mediumBangs", "mediumBangs2", "mediumBangs3", "mediumStraight", "mohawk", "mohawk2", "noHair1",
    "noHair2", "noHair3", "pomp", "shaved1", "shaved2", "shaved3", "short1", "short2", "short3",
    "short4", "short5", "turban", "twists", "twists2"
];

heads.forEach(head => {
    const avatar = createAvatar(openPeeps, { head: [head] });
    const svg = avatar.toString();
    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);
    
    if (headMatch && faceMatch) {
        const headArea = svg.substring(headMatch.index, faceMatch.index);
        const paths = headArea.match(/<path[^>]+>/g) || [];
        if (paths.length > 0) {
            const firstFill = (paths[0].match(/fill="([^"]+)"/) || [null, 'none'])[1];
            if (firstFill !== '#d08b5b') {
                console.log(`!!! WARN: ${head} first path is NOT skin (${firstFill})`);
            }
        }
    }
});
