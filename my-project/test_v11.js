import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV11(style) {
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
        let after = svg.substring(faceIdx);

        // 1. Replace hat colors globally in head area (usually only one hat)
        headArea = headArea.replace(/fill="#9ddadb"/g, `fill="${targetColor}"`)
                           .replace(/fill="#c93305"/g, `fill="${targetColor}"`);

        // 2. Replace ONLY THE FIRST black hair group OR path
        let hairReplaced = false;
        
        // Try group first
        if (headArea.includes('fill="#000"') || headArea.includes('fill="#000000"')) {
            // Very surgical: replace first fill="#000"
            headArea = headArea.replace(/fill="#000(?:000)?"/, `fill="${targetColor}"`);
            hairReplaced = true;
        }

        const result = before + headArea + after;
        console.log(`  Recolored: ${isRecolored(result, targetColor)}`);
    }
}

function isRecolored(svg, color) {
    return svg.includes(`fill="${color}"`);
}

testV11("afro");
testV11("pomp");
testV11("hatBeanie");
