import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
});

fs.writeFileSync('pomp_dump.txt', avatar.toString(), 'utf8');
console.log('SVG written to pomp_dump.txt');
