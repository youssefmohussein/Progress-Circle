import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function testV17(style) {
    console.log(`--- Style: ${style} ---`);
    const avatar = createAvatar(openPeeps, { head: [style] });
    let svg = avatar.toString();
    const targetColor = "#ff00ff";

    const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
    const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

    if (headMatch && faceMatch) {
         let headArea = svg.substring(headMatch.index, faceMatch.index);
         
         // 1. Count black paths
         const blackPaths = headArea.match(/<path[^>]+(?:fill="#000(?:000)?"|(?![^>]*fill=)[^>]*>)/g) || [];
         console.log(`  Black paths found: ${blackPaths.length}`);
         
         // 2. Target specific colors (hats, colored hair)
         headArea = headArea.replace(/fill="#(?:9ddadb|c93305)"/g, `fill="${targetColor}"`);
         
         // 3. Smart Recolor Black
         if (blackPaths.length >= 2) {
             console.log("  RECOLORING first black path (separate)");
             // Replace only the first instance that looks like a black path
             let hairRep = false;
             headArea = headArea.replace(/<path[^>]+>/g, (p) => {
                 if (!hairRep && (p.includes('fill="#000"') || !p.includes('fill='))) {
                     hairRep = true;
                     if (p.includes('fill=')) {
                         return p.replace(/fill="#000(?:000)?"/, `fill="${targetColor}"`);
                     } else {
                         return p.replace('>', ` fill="${targetColor}">`);
                     }
                 }
                 return p;
             });
         } else {
             console.log("  SKIPPING black path (likely merged)");
         }
         
         // console.log(headArea);
    }
}

testV17("pomp");
testV17("bangs");
testV17("afro");
testV17("hatBeanie");
