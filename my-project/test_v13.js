import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV13(style) {
    console.log(`--- Style: ${style} ---`);
    const avatar = createAvatar(openPeeps, { head: [style] });
    let svg = avatar.toString();
    const targetColor = "#ff00ff";

    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

    if (headMatch && faceMatch) {
        let before = svg.substring(0, headMatch.index);
        let headArea = svg.substring(headMatch.index, faceMatch.index);
        let after = svg.substring(faceMatch.index);

        // Find all paths in headArea
        let pathCount = 0;
        headArea = headArea.replace(/<path[^>]+>/g, (pathMatch) => {
            pathCount++;
            // SKIP the first path (it's the head skin!)
            if (pathCount === 1) return pathMatch;

            // Recolor hair/hats in all subsequent paths
            return pathMatch.replace(/fill="#(?:000(?:000)?|9ddadb|c93305)"/g, `fill="${targetColor}"`);
        });

        const result = before + headArea + after;
        const colorChanged = result.includes(targetColor);
        const skinSafe = !result.match(/<path[^>]+fill="#ff00ff"[^>]+d="[^"]{10,950}"/); // Skin is usually < 1000

        console.log(`  Success: ${colorChanged}`);
    }
}

testV13("afro");
testV13("pomp");
testV13("hatBeanie");
testV13("turban");
testV13("hijab");
