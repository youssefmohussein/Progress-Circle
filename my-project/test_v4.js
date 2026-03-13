import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const avatar = createAvatar(openPeeps, {
    head: ["afro"],
});

let svg = avatar.toString();
const targetColor = "#ff00ff";

// V4 logic
const headGroupRegex = /(<g transform="matrix\([^)]+\)">[\s\S]*?<g )(fill="#000")([\s\S]*?>)([\s\S]*?)(<\/g>[\s\S]*?<\/g>)/;
const match = svg.match(headGroupRegex);

if (match) {
    console.log("MATCH FOUND");
    svg = svg.replace(headGroupRegex, (m, headStart, groupFill, groupEnd, content, suffix) => {
        const newGroupFill = groupFill.replace('#000', targetColor);
        return headStart + newGroupFill + groupEnd + content + suffix;
    });
    if (svg.includes(targetColor)) {
        console.log("REPLACEMENT SUCCESSFUL");
    } else {
        console.log("REPLACEMENT FAILED");
    }
} else {
    console.log("NO MATCH");
}
