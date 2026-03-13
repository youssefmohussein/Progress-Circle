import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV10(style) {
    console.log(`--- Style: ${style} ---`);
    const avatar = createAvatar(openPeeps, { head: [style] });
    let svg = avatar.toString();
    const targetColor = "#ff00ff";
    const skinColors = ["#ffdbb4", "#edb98a", "#d08b5b", "#ae5d29", "#694d3d"];

    // Use regex to find transforms instead of indexOf
    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

    if (headMatch && faceMatch) {
        const headIdx = headMatch.index;
        const faceIdx = faceMatch.index;

        if (faceIdx > headIdx) {
            let before = svg.substring(0, headIdx);
            let headArea = svg.substring(headIdx, faceIdx);
            let after = svg.substring(faceIdx);

            // Surgical replacement of known hair/ink colors
            const targets = ['#000', '#c93305', '#9ddadb', '#000000'];
            targets.forEach(t => {
                const re = new RegExp(`fill="${t}"`, 'g');
                headArea = headArea.replace(re, `fill="${targetColor}"`);
            });

            const result = before + headArea + after;
            console.log(`  Success: ${result.includes(targetColor)}`);
            if (!result.includes(targetColor)) console.log("  Target color NOT found!");
            if (!result.includes('fill="#000"') ) console.log("  Face features LOST!");
        }
    } else {
        console.log("  Transforms NOT found via Regex!");
    }
}

testV10("afro");
testV10("bangs");
testV10("hatBeanie");
