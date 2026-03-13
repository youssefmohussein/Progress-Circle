import { generateAvatarSvg } from './src/avatar/avatarGenerator.js';

const config = {
    seed: 'test',
    head: 'short1',
    face: 'smile',
    headContrastColor: 'f59797' // Pink
};

const svg = generateAvatarSvg(config);

const headMatch = svg.match(/<g transform="(?:matrix|translate)[^>]+>/);
const faceMatch = svg.match(/<g transform="translate\(315 248\)"[^>]*>/);

if (headMatch && faceMatch) {
    const headArea = svg.substring(headMatch.index, faceMatch.index);
    const faceArea = svg.substring(faceMatch.index);

    console.log('--- Head Area Colors (Expected: #f59797) ---');
    const headFills = headArea.match(/fill="#[0-9a-fA-F]{3,6}"/g) || [];
    console.log([...new Set(headFills)]);

    console.log('\n--- Face Area Colors (Expected: #000) ---');
    const faceFills = faceArea.match(/fill="#[0-9a-fA-F]{3,6}"/g) || [];
    console.log([...new Set(faceFills)]);
} else {
    console.log('Groups not found');
}
