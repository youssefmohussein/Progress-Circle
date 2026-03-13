import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
});

let svg = avatar.toString();
let counter = 0;
svg = svg.replace(/<path/g, () => `<path data-idx="${counter++}"`);

fs.writeFileSync('pomp_annotated.txt', svg);
console.log('Annotated SVG written to pomp_annotated.txt');
