import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function inspect(facialHair) {
    const options = {
        seed: 'test',
        facialHair: facialHair ? [facialHair] : [],
        facialHairProbability: facialHair ? 100 : 0
    };
    const avatar = createAvatar(openPeeps, options);
    const svg = avatar.toString();
    const groupMatches = [...svg.matchAll(/<g transform="([^"]+)"[^>]*>/g)];
    
    console.log(`\n--- ${facialHair} ---`);
    groupMatches.forEach((m, i) => {
        const startIdx = m.index;
        const nextMatch = groupMatches[i+1];
        const endIdx = nextMatch ? nextMatch.index : svg.length;
        const content = svg.substring(startIdx, endIdx);
        if (content.length > 50) {
           console.log(`${i}: ${m[1]}`);
        }
    });
}

inspect('chin');
