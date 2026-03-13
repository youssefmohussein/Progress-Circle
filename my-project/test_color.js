import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

// Try with a bright color to see if it applies
const avatar = createAvatar(openPeeps, {
    head: ["afro"],
    headContrastColor: ["ff0000"] // Bright Red
});

const svg = avatar.toString();
console.log("Does SVG contain red (#ff0000)?", svg.includes("#ff0000"));
// Also check default ink color
console.log("Does SVG contain default ink (#2c1b18)?", svg.includes("#2c1b18"));
