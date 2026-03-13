import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV12(style) {
    console.log(`--- Style: ${style} ---`);
    const avatar = createAvatar(openPeeps, { head: [style] });
    let svg = avatar.toString();
    const targetColor = "#ff00ff";

    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

    if (headMatch && faceMatch && faceMatch.index > headMatch.index) {
        const headIdx = headMatch.index;
        const faceIdx = faceMatch.index;

        let before = svg.substring(0, headIdx);
        let headArea = svg.substring(headIdx, faceIdx);
        const after = svg.substring(faceIdx);

        // 1. Hat colors
        headArea = headArea.replace(/fill="#9ddadb"/g, `fill="${targetColor}"`)
                           .replace(/fill="#c93305"/g, `fill="${targetColor}"`);

        // 2. Find longest black path
        const blackPaths = []; // { full, dLen }
        const pathRegex = /<path[^>]+fill="#000(?:000)?"[^>]*>/g;
        let p;
        while ((p = pathRegex.exec(headArea)) !== null) {
            const dMatch = p[0].match(/d="([^"]+)"/);
            const dLen = dMatch ? dMatch[1].length : 0;
            blackPaths.push({ full: p[0], dLen: dLen, index: p.index });
        }

        if (blackPaths.length > 0) {
            // Sort by length descending
            blackPaths.sort((a,b) => b.dLen - a.dLen);
            const longest = blackPaths[0];
            console.log(`  Targeting longest black path: len=${longest.dLen}`);
            
            // We must be careful replacing by string to only hit the right one
            // We use a placeholder
            headArea = headArea.substring(0, longest.index) + 
                       longest.full.replace(/fill="#000(?:000)?"/, `fill="${targetColor}"`) + 
                       headArea.substring(longest.index + longest.full.length);
        }

        const result = before + headArea + after;
        console.log(`  Success: ${result.includes(targetColor)}`);
    }
}

testV12("afro");
testV12("pomp");
testV12("hatBeanie");
