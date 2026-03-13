import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const styles = ["twists", "twists2", "dreads1", "dreads2", "cornrows", "longAfro"];

styles.forEach(style => {
    const avatar = createAvatar(openPeeps, { head: [style] });
    const svg = avatar.toString();
    const hasGroup = svg.includes('<g fill="#000">');
    console.log(`${style}: Grouped=${hasGroup}`);
});
