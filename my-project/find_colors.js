import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

const styles = ["afro", "hatBeanie", "hatHip", "turban", "hijab", "bear", "mohawk"];

styles.forEach(style => {
    const avatar = createAvatar(openPeeps, { head: [style] });
    const svg = avatar.toString();
    const colors = [...new Set(svg.match(/fill="#([a-fA-F0-9]{3,6})"/g) || [])];
    console.log(`${style}: ${colors.join(', ')}`);
});
