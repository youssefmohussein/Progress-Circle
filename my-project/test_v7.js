const svg = `<svg>...<g fill-rule="evenodd"><path fill="#000" id="body-outline"/></g><g transform="matrix(.99789 0 0 1 156 62)">
    <path fill="#000" id="hair"/>
    <g transform="translate(315 248)">
        <path fill="#000" id="eyes"/>
    </g>
</g></svg>`;

const targetColor = "#ff00ff";

// V7 Logic
const parts = svg.split(/<g transform="/);
if (parts.length > 1) {
    console.log("Head group found by split");
    let headPart = parts[1];
    
    // Protect face inside headPart
    const faceRegex = /<g transform="translate\(315 248\)">[\s\S]*?<\/g>/;
    let faceMatch = headPart.match(faceRegex);
    if (faceMatch) {
        headPart = headPart.replace(faceMatch[0], "___FACE_HOLDER___");
    }
    
    // Recolor
    headPart = headPart.replace(/fill="#000"/g, `fill="${targetColor}"`)
                       .replace(/fill="#000000"/g, `fill="${targetColor}"`);
                       
    // Restore face
    if (faceMatch) {
         headPart = headPart.replace("___FACE_HOLDER___", faceMatch[0]);
    }
    
    const result = parts[0] + '<g transform="' + headPart;
    
    if (result.includes('id="body-outline" fill="#000"') && 
        result.includes('id="hair" fill="#ff00ff"') && 
        result.includes('id="eyes" fill="#000"')) {
        console.log("V7 SUCCESS");
    } else {
        console.log("V7 FAILURE");
    }
} else {
    console.log("Split failed");
}
