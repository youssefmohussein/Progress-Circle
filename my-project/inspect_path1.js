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
    const paths = headArea.match(/<path[^>]+>/g) || [];
    console.log(`Total paths in head area: ${paths.length}`);
    paths.forEach((p, i) => {
        const fill = (p.match(/fill="([^"]+)"/) || [null, 'none'])[1];
        const d = (p.match(/d="([^"]+)"/) || [null, ''])[1];
        console.log(`Path ${i}: fill=${fill}, d length=${d.length}`);
        if (i === 1) {
             console.log("Path 1 Data Snippet:", d.substring(0, 200));
        }
    });
}
