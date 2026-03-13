import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import fs from 'fs';

const avatar = createAvatar(openPeeps, {
    head: ["hatBeanie"],
});

fs.writeFileSync('beanie_dump.txt', avatar.toString(), 'utf8');
console.log('SVG written to beanie_dump.txt');
