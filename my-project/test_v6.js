const svg = `<svg>...<g transform="matrix(.99789 0 0 1 156 62)">
    <path fill="#d08b5b"/>
    <path fill="#000" id="hair"/>
    <g transform="translate(315 248)">
        <path fill="#000" id="eyes"/>
    </g>
    <path fill="#000" id="sideburns"/>
</g>...</svg>`;

const targetColor = "#ff00ff";

// V6 Logic
const headGroupRegex = /(<g transform="(?:matrix|translate)\(.{10,50}\)">)([\s\S]*?)(<\/g>\s*<\/g>)/;

const result = svg.replace(headGroupRegex, (match, prefix, content, suffix) => {
    // 1. Protect face
    const faceRegex = /<g transform="translate\(315 248\)">[\s\S]*?<\/g>/;
    let faceMatch = content.match(faceRegex);
    let protectedContent = content;
    if (faceMatch) {
         protectedContent = content.replace(faceMatch[0], "___FACE_HOLDER___");
    }
    
    // 2. Replace black fills in the rest
    let recolored = protectedContent
        .replace(/fill="#000"/g, `fill="${targetColor}"`)
        .replace(/fill="#000000"/g, `fill="${targetColor}"`);
        
    // 3. Restore face
    if (faceMatch) {
        recolored = recolored.replace("___FACE_HOLDER___", faceMatch[0]);
    }
    
    return prefix + recolored + suffix;
});

console.log(result);
if (result.includes('id="eyes" fill="#000"') && result.includes('id="hair" fill="#ff00ff"')) {
    console.log("V6 SUCCESS");
} else {
    console.log("V6 FAILURE");
}
