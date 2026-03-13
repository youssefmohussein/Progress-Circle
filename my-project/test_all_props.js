import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const testProps = [
    { hairColor: ["ff00ff"] },
    { headColor: ["ff00ff"] },
    { inkColor: ["ff00ff"] },
    { contrastColor: ["ff00ff"] },
    { facialHairColor: ["ff00ff"] },
    { clothesColor: ["ff00ff"] }
];

testProps.forEach(props => {
    const avatar = createAvatar(openPeeps, {
        head: ["pomp"],
        ...props
    });
    const svg = avatar.toString();
    const propName = Object.keys(props)[0];
    if (svg.includes('fill="#ff00ff"')) {
        console.log(`Open Peeps NATIVELY supports: ${propName}`);
    } else {
        console.log(`Open Peeps DOES NOT support: ${propName}`);
    }
});
