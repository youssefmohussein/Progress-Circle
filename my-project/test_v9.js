import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV9(style) {
    console.log(`--- Style: ${style} ---`);
    const avatar = createAvatar(openPeeps, { head: [style] });
    let svg = avatar.toString();
    const targetColor = "#ff00ff";

    const headStart = svg.indexOf('<g transform="matrix');
    const faceStart = svg.indexOf('<g transform="translate(315 248)"');

    if (headStart !== -1 && faceStart !== -1) {
        let before = svg.substring(0, headStart);
        let headArea = svg.substring(headStart, faceStart);
        let after = svg.substring(faceStart);

        // 1. Recolor Hair Groups
        headArea = headArea.replace(/<g fill="#000">/g, `<g fill="${targetColor}">`)
                           .replace(/<g fill="#000000">/g, `<g fill="${targetColor}">`);
        
        // 2. Recolor Hats (Blue)
        headArea = headArea.replace(/fill="#9ddadb"/g, `fill="${targetColor}"`);

        // 3. Recolor Other possible ink colors if they are inside a group?
        // Let's stick to these for now.

        const result = before + headArea + after;
        const featuresPreserved = result.includes('<g transform="translate(315 248)"') && result.includes('fill="#000"') ;
        const isRecolored = result.includes(targetColor);

        console.log(`Success: ${isRecolored && featuresPreserved}`);
        if (!isRecolored) console.log("  Target color not found!");
        if (!featuresPreserved) console.log("  Features LOST!");
    }
}

testV9("afro");
testV9("hatBeanie");
testV9("turban");
testV9("hijab");
