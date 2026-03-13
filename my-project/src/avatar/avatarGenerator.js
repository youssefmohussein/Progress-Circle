import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

export function generateAvatarSvg(config) {
    const options = {
        seed: config.seed ? String(config.seed) : 'default',
        radius: 50,
    };

    if (config.backgroundColor && typeof config.backgroundColor === 'string' && config.backgroundColor !== 'transparent') {
        options.backgroundColor = [config.backgroundColor.replace('#', '')];
    }

    if (config.head && typeof config.head === 'string') options.head = [config.head];
    if (config.face && typeof config.face === 'string') options.face = [config.face];
    
    if (config.facialHair && typeof config.facialHair === 'string' && config.facialHair !== '') {
        options.facialHair = [config.facialHair];
        options.facialHairProbability = 100;
    } else {
        options.facialHairProbability = 0;
    }
    
    if (config.accessories && typeof config.accessories === 'string' && config.accessories !== '') {
        options.accessories = [config.accessories];
        options.accessoriesProbability = 100;
    } else {
        options.accessoriesProbability = 0;
    }
    
    if (config.clothingColor && typeof config.clothingColor === 'string') options.clothingColor = [config.clothingColor.replace('#', '')];
    if (config.skinColor && typeof config.skinColor === 'string') options.skinColor = [config.skinColor.replace('#', '')];
    if (config.headContrastColor && typeof config.headContrastColor === 'string') options.headContrastColor = [config.headContrastColor.replace('#', '')];

    const avatar = createAvatar(openPeeps, options);
    let svg = avatar.toString();

    // FORCE COLOR HACK (Surgical V21):
    // Conservative approach: only recolor non-black hair and hat shapes.
    // This protects facial outlines and features which are often merged with black hair.
    if (config.headContrastColor && typeof config.headContrastColor === 'string') {
        const targetColor = config.headContrastColor.startsWith('#') ? config.headContrastColor : `#${config.headContrastColor}`;
        
        const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
        const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

        if (headMatch && faceMatch && faceMatch.index > headMatch.index) {
            const headIdx = headMatch.index;
            const faceIdx = faceMatch.index;

            let before = svg.substring(0, headIdx);
            let headArea = svg.substring(headIdx, faceIdx);
            const after = svg.substring(faceIdx);

            // ONLY target designated 'fabric' and 'decorative' colors in the head group.
            // This leaves the black (#000) ink untouched to preserve outlines.
            const targets = ['#9ddadb', '#c93305'];
            targets.forEach(t => {
                const re = new RegExp(`fill="${t}"`, 'g');
                headArea = headArea.replace(re, `fill="${targetColor}"`);
            });

            svg = before + headArea + after;
        }
    }

    return svg;
}
