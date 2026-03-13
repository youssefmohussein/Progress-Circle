const skinColors = ["ffdbb4", "edb98a", "d08b5b", "ae5d29", "694d3d"];

const svg = `<svg>...<g transform="matrix(.99789 0 0 1 156 62)">
    <path fill="#d08b5b" id="skin"/>
    <path fill="#9ddadb" id="beanie"/>
    <path fill="#000" id="hair"/>
    <g transform="translate(315 248)">
        <path fill="#000" id="eyes"/>
    </g>
</g></svg>`;

const targetColor = "#ff00ff";

// V8 Logic
const parts = svg.split(/<g transform="/);
if (parts.length > 1) {
    let headPart = parts[1];
    
    // Protect face
    const faceRegex = /<g transform="translate\(315 248\)">[\s\S]*?<\/g>/;
    let faceMatch = headPart.match(faceRegex);
    if (faceMatch) {
        headPart = headPart.replace(faceMatch[0], "___FACE_HOLDER___");
    }
    
    // Broad replace: any fill that isn't skin
    // First, convert all fills to our target color, then restore skin
    // OR use a regex that negative-matches skin.
    
    // Let's use a replacer function
    headPart = headPart.replace(/fill="#([a-fA-F0-9]{3,6})"/g, (match, color) => {
        const c = color.toLowerCase();
        if (skinColors.includes(c)) return match;
        return `fill="${targetColor}"`;
    });
                       
    // Restore face
    if (faceMatch) {
         headPart = headPart.replace("___FACE_HOLDER___", faceMatch[0]);
    }
    
    const result = parts[0] + '<g transform="' + headPart;
    
    if (result.includes('id="skin" fill="#d08b5b"') && 
        result.includes('id="beanie" fill="#ff00ff"') && 
        result.includes('id="hair" fill="#ff00ff"') && 
        result.includes('id="eyes" fill="#000"')) {
        console.log("V8 SUCCESS");
    } else {
        console.log("V8 FAILURE");
    }
} else {
    console.log("Split failed");
}
