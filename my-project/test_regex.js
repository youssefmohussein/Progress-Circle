const svg = `<svg>...<g body><path fill="#000"/></g><g transform="matrix(1 0 0 1 156 62)"><g fill="#000"><path d="hair"/></g></g><g transform="translate(315 248)"><path fill="#000"/></g></svg>`;

const targetColor = "#ff00ff";

// Refined regex: Target only the g group that has a matrix/translate transform AND contains a g fill="#000"
// BUT specific to the head area.
// In Open Peeps, the head is usually the only one with matrix transform in that specific position.

const headRegex = /(<g transform="matrix\([^)]+\)">[\s\S]*?<g fill="#000">)([\s\S]*?)(<\/g>[\s\S]*?<\/g>)/;
const result = svg.replace(headRegex, (match, prefix, content, suffix) => {
    return prefix + content.replace(/fill="#000"/g, `fill="${targetColor}"`) + suffix;
});

console.log(result);
