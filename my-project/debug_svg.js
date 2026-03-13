import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const avatar = createAvatar(openPeeps, {
    head: ["afro"],
});

const svg = avatar.toString();
fs.writeFileSync('svg_dump.txt', svg, 'utf8');
console.log('SVG written to svg_dump.txt');
