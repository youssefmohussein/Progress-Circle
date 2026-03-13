import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["pomp"],
    headContrastColor: ["ff00ff"]
});

const svg = avatar.toString();
if (svg.includes('fill="#ff00ff"')) {
    console.log("DiceBear NATIVELY supports headContrastColor and applied it.");
    if (svg.includes('fill="#d08b5b"')) {
        console.log("Skin tone #d08b5b is still present.");
    } else {
        console.log("Skin tone #d08b5b has been REPLACED by DiceBear.");
    }
} else {
    console.log("DiceBear does NOT natively support headContrastColor for Open Peeps.");
}
