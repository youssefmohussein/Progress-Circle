import { generateAvatarSvg } from './src/avatar/avatarGenerator.js';

const config = {
    seed: 'test',
    head: 'short1',
    face: 'smile',
    facialHair: 'full',
    headContrastColor: 'f59797' // Pink
};

const svg = generateAvatarSvg(config);

const groupMatches = [...svg.matchAll(/<g transform="([^"]+)"[^>]*>/g)];

function getGroupContent(i) {
    const startIdx = groupMatches[i].index;
    const nextMatch = groupMatches[i+1];
    const endIdx = nextMatch ? nextMatch.index : svg.length;
    return svg.substring(startIdx, endIdx);
}

console.log('--- Pink Hair + Beard Verification ---');

const headArea = getGroupContent(0);
console.log(`Head Area Pink Check: ${headArea.includes('fill="#f59797"')}`);

const faceArea = getGroupContent(1);
console.log(`Face Area Pink Check (Should be FALSE): ${faceArea.includes('fill="#f59797"')}`);
console.log(`Face Area Black Check (Should be TRUE): ${faceArea.includes('fill="#000"')}`);

const chinArea = getGroupContent(2);
console.log(`Chin Area Pink Check: ${chinArea.includes('fill="#f59797"')}`);

const mustacheArea = getGroupContent(3);
console.log(`Mustache Area Pink Check: ${mustacheArea.includes('fill="#f59797"')}`);
