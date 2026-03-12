import { useId } from 'react';

/**
 * AvatarDisplay — A layered SVG avatar composed from inline SVG art.
 * All layers are pure SVG, no image files needed.
 *
 * avatarConfig: { hair, shirt, pants, shoes, eyes, accessory, bg }
 *   each is an index (0–N) corresponding to a variant.
 */

// ─── Palettes ─────────────────────────────────────────────────────────────────
const BG_COLORS = [
    ['var(--primary)', 'var(--accent)'],  // 0 Dynamic Theme Colors
    ['#f59e0b', '#ef4444'],  // 1 Sunset
    ['#10b981', '#059669'],  // 2 Forest
    ['#1e1b4b', '#312e81'],  // 3 Galaxy
    ['#f59e0b', '#ca8a04'],  // 4 Gold
    ['#0f172a', '#ec4899'],  // 5 Cyberpunk
    ['#c026d3', '#2dd4bf'],  // 6 Neon
    ['#34d399', '#059669'],  // 7 Mint
    ['#991b1b', '#dc2626'],  // 8 Crimson
];

const SHIRT_COLORS = [
    '#ef4444', // 0 basic tee - red (changed from blue so it contrasts with default blue jeans)
    '#374151', // 1 hoodie
    '#0ea5e9', // 2 polo
    '#b45309', // 3 jacket
    '#1f2937', // 4 gym outfit
    '#7c3aed', // 5 legendary hoodie
    '#111827', // 6 suit
    '#be185d', // 7 dress
    '#14b8a6', // 8 sweater
    '#f59e0b', // 9 v-neck
    '#a855f7', // 10 crop top
    '#f43f5e', // 11 tank top
];

const SHIRT_DETAILS = [
    null, 'hoodie', 'collar', 'lapels', 'stripes', 'legendary',
    'suit', 'dress', 'sweater', 'vneck', 'croptop', 'tanktop',
];

const PANTS_COLORS = [
    '#1e40af', // 0 Jeans - dark blue
    '#d97706', // 1 Shorts - tan/khaki
    '#9ca3af', // 2 Sweatpants - grey
    '#ec4899', // 3 Skirt - pink
    '#111827', // 4 Suit Pants - black
    '#4d7c0f', // 5 Cargo Pants - olive
];

const SHOES_COLORS = [
    '#f3f4f6', // 0 Sneakers - white
    '#fde047', // 1 Running Shoes - yellow
    '#78350f', // 2 Boots - dark brown
    '#60a5fa', // 3 Slippers - light blue
    '#111827', // 4 Dress Shoes - black
    '#b45309', // 5 Sandals - brown
];

const HAIR_COLOR = '#3b2a1a'; // dark brown for all styles

const EYE_COLORS = [
    '#5c3317', // Dark Brown (0)
    '#8b6914', // Hazel (1)
    '#3b82f6', // Blue (2)
    '#22c55e', // Green (3)
    '#94a3b8', // Gray (4)
    '#f59e0b', // Amber (5)
    '#8b5cf6', // Violet (6)
    '#ef4444', // Red (7)
    '#eab308', // Gold (8)
];

// ─── Layer Renderers ──────────────────────────────────────────────────────────

function BgLayer({ index, gradId, userTheme }) {
    let [c1, c2] = BG_COLORS[index] ?? BG_COLORS[0];
    if (index === 0 && userTheme) {
        if (userTheme.primaryColor) c1 = userTheme.primaryColor;
        if (userTheme.accentColor) c2 = userTheme.accentColor;
    }
    return (
        <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
            </radialGradient>
        </defs>
    );
}

function BodyLayer() {
    return (
        <g>
            {/* Neck — slimmer */}
            <rect x="45" y="65" width="10" height="14" rx="3" fill="#f5c5a3" />
            {/* Hands — closer to body, slightly smaller */}
            <circle cx="20" cy="118" r="5" fill="#f5c5a3" />
            <circle cx="80" cy="118" r="5" fill="#f5c5a3" />
        </g>
    );
}

function ShirtLayer({ index }) {
    const color = SHIRT_COLORS[index] ?? SHIRT_COLORS[0];
    const detail = SHIRT_DETAILS[index];

    // Slimmer torso: waist extends to 121 so it overlaps pants and no skin strip shows
    let bodyPath = "M32 76 L68 76 L66 121 L34 121 Z";

    // Slimmer arms to hands
    let leftSleeve = "M32 76 L18 115 L24 117 L36 88 Z";
    let rightSleeve = "M68 76 L82 115 L76 117 L64 88 Z";

    if (detail === 'tanktop') {
        bodyPath = "M35 76 L65 76 L66 121 L34 121 Z";
        leftSleeve = null;
        rightSleeve = null;
    } else if (detail === 'croptop') {
        bodyPath = "M32 76 L68 76 L66 98 L34 98 Z";
        leftSleeve = "M32 76 L20 92 L28 94 L36 86 Z";
        rightSleeve = "M68 76 L80 92 L72 94 L64 86 Z";
    } else if (detail === 'dress') {
        bodyPath = "M32 76 L68 76 L78 178 L22 178 Z";
    }

    return (
        <g>
            {/* Base Body skin under crop top */}
            {detail === 'croptop' && (
                <rect x="36" y="98" width="28" height="22" fill="#f5c5a3" />
            )}

            {/* Main Details */}
            <path d={bodyPath} fill={color} />
            {leftSleeve && <path d={leftSleeve} fill={color} />}
            {rightSleeve && <path d={rightSleeve} fill={color} />}

            {/* Detail overlays */}
            {detail === 'hoodie' && (
                <>
                    <path d="M38 76 Q50 88 62 76" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    <ellipse cx="50" cy="80" rx="6" ry="3.5" fill="rgba(0,0,0,0.2)" />
                </>
            )}
            {detail === 'collar' && (
                <path d="M42 76 L50 81 L58 76" fill="none" stroke="#fff" strokeWidth="2" opacity="0.6" />
            )}
            {detail === 'lapels' && (
                <>
                    <path d="M38 76 L43 88 L50 80" fill="rgba(0,0,0,0.25)" />
                    <path d="M62 76 L57 88 L50 80" fill="rgba(0,0,0,0.25)" />
                </>
            )}
            {detail === 'stripes' && (
                <>
                    <line x1="33" y1="76" x2="31" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                    <line x1="67" y1="76" x2="69" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                </>
            )}
            {detail === 'legendary' && (
                <>
                    <path d="M38 76 Q50 88 62 76" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                    <polygon points="50,82 52,87 57,87 53,91 55,96 50,93 45,96 47,91 43,87 48,87" fill="#fbbf24" />
                </>
            )}
            {detail === 'suit' && (
                <>
                    <polygon points="42,76 50,94 58,76 50,80" fill="#fff" />
                    <polygon points="48,80 50,84 52,80 50,81" fill="#ef4444" />
                    <path d="M38 76 L44 94 L50 80" fill="#1f2937" />
                    <path d="M62 76 L56 94 L50 80" fill="#1f2937" />
                </>
            )}
            {detail === 'dress' && (
                <>
                    <path d="M38 76 Q50 86 62 76" fill="none" stroke="#fbcfe8" strokeWidth="3" />
                    <circle cx="50" cy="84" r="2.5" fill="#fbcfe8" opacity="0.8" />
                </>
            )}
            {detail === 'sweater' && (
                <>
                    <path d="M32 120 L68 120 L70 128 L30 128 Z" fill="rgba(0,0,0,0.2)" />
                    <path d="M36 76 Q50 82 64 76 L62 74 Q50 78 38 74 Z" fill="rgba(0,0,0,0.2)" />
                </>
            )}
            {detail === 'vneck' && (
                <polygon points="41,76 50,88 59,76 50,79" fill="#f5c5a3" />
            )}
            {detail === 'croptop' && (
                <path d="M34 96 L66 96" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 2" />
            )}
        </g>
    );
}

const SKIN = '#f5c5a3';

function PantsLayer({ index, isDress }) {
    // Legs shape starts at 121 so it sits under the shirt overlap; one shape so no gap between legs
    const legsShape = (
        <path d="M34 121 L66 121 L68 182 L56 182 L54 140 L46 140 L44 182 L32 182 Z" fill={SKIN} />
    );

    if (isDress) return <g>{legsShape}</g>;

    const color = PANTS_COLORS[index] ?? PANTS_COLORS[0];

    // Strong overlap at center (54/46) so no seam gap lets skin show through
    const leftLeg = (d) => <path d={d} fill={color} />;
    const rightLeg = (d) => <path d={d} fill={color} />;
    const jeansLeft = "M34 121 L32 182 L44 182 L46 138 L54 138 L54 121 Z";
    const jeansRight = "M66 121 L46 121 L46 138 L54 138 L56 182 L68 182 Z";

    const variants = [
        // 0 Jeans (Long)
        <g>
            {legsShape}
            {leftLeg(jeansLeft)}
            {rightLeg(jeansRight)}
            <line x1="42" y1="121" x2="42" y2="182" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="58" y1="121" x2="58" y2="182" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </g>,
        // 1 Shorts
        <g>
            {legsShape}
            <path d="M34 121 L32 152 L44 154 L46 138 L54 138 L54 121 Z" fill={color} />
            <path d="M66 121 L46 121 L46 138 L54 138 L56 152 L68 152 Z" fill={color} />
        </g>,
        // 2 Sweatpants (Baggy)
        <g>
            {legsShape}
            <path d="M32 121 L28 180 L42 182 L46 138 L54 138 L54 121 Z" fill={color} />
            <path d="M68 121 L46 121 L46 138 L54 138 L58 182 L72 180 Z" fill={color} />
            <path d="M48 120 Q46 128 44 132" fill="none" stroke="#fff" strokeWidth="1.5" />
            <path d="M52 120 Q54 128 56 132" fill="none" stroke="#fff" strokeWidth="1.5" />
        </g>,
        // 3 Skirt
        <g>
            {legsShape}
            <path d="M34 120 L66 120 L74 152 L26 152 Z" fill={color} />
            <path d="M38 120 L32 152 M50 120 L50 152 M62 120 L68 152" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        </g>,
        // 4 Suit Pants
        <g>
            {legsShape}
            {leftLeg(jeansLeft)}
            {rightLeg(jeansRight)}
            <line x1="42" y1="121" x2="42" y2="182" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
            <line x1="58" y1="121" x2="58" y2="182" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        </g>,
        // 5 Cargo Pants
        <g>
            {legsShape}
            {leftLeg(jeansLeft)}
            {rightLeg(jeansRight)}
            <rect x="28" y="148" width="8" height="12" rx="1" fill="rgba(0,0,0,0.15)" />
            <rect x="64" y="148" width="8" height="12" rx="1" fill="rgba(0,0,0,0.15)" />
        </g>,
    ];

    return variants[index] ?? variants[0];
}

function ShoesLayer({ index }) {
    const color = SHOES_COLORS[index] ?? SHOES_COLORS[0];
    // Slimmer shoes, positioned at taller figure feet (y 178–185)
    const variants = [
        // 0 Sneakers
        <g>
            <path d="M30 173 L42 173 Q46 180 46 185 L26 185 Q26 178 30 173 Z" fill={color} />
            <path d="M70 173 L58 173 Q54 180 54 185 L74 185 Q74 178 70 173 Z" fill={color} />
            <rect x="26" y="182" width="22" height="2.5" fill="#e5e7eb" />
            <rect x="52" y="182" width="22" height="2.5" fill="#e5e7eb" />
        </g>,
        // 1 Running Shoes (Chunky)
        <g>
            <path d="M28 175 L44 175 L48 187 L24 187 L24 183 Z" fill={color} />
            <path d="M72 175 L56 175 L52 187 L76 187 L76 183 Z" fill={color} />
            <rect x="24" y="183" width="24" height="4" fill="#fff" />
            <rect x="52" y="183" width="24" height="4" fill="#fff" />
        </g>,
        // 2 Boots
        <g>
            <path d="M30 168 L44 168 L46 185 L28 185 Z" fill={color} />
            <path d="M70 168 L56 168 L54 185 L72 185 Z" fill={color} />
            <rect x="28" y="182" width="18" height="3" fill="#451a03" />
            <rect x="54" y="182" width="18" height="3" fill="#451a03" />
        </g>,
        // 3 Slippers
        <g>
            <path d="M30 173 L38 173 Q40 180 40 185 L28 185 Z" fill="#f5c5a3" />
            <path d="M70 173 L62 173 Q60 180 60 185 L72 185 Z" fill="#f5c5a3" />
            <path d="M28 175 Q36 173 40 180 L40 185 L28 185 Z" fill={color} />
            <path d="M72 175 Q64 173 60 180 L60 185 L72 185 Z" fill={color} />
        </g>,
        // 4 Dress Shoes
        <g>
            <path d="M32 173 L44 173 L48 185 L26 185 Z" fill={color} />
            <path d="M68 173 L56 173 L52 185 L74 185 Z" fill={color} />
            <rect x="26" y="183" width="22" height="1.5" fill="#000" />
            <rect x="52" y="183" width="22" height="1.5" fill="#000" />
        </g>,
        // 5 Sandals
        <g>
            <path d="M30 173 L38 173 Q40 180 40 185 L28 185 Z" fill="#f5c5a3" />
            <path d="M70 173 L62 173 Q60 180 60 185 L72 185 Z" fill="#f5c5a3" />
            <rect x="28" y="183" width="14" height="1.5" fill="#78350f" />
            <rect x="58" y="183" width="14" height="1.5" fill="#78350f" />
            <line x1="30" y1="183" x2="35" y2="176" stroke={color} strokeWidth="2.5" />
            <line x1="70" y1="183" x2="65" y2="176" stroke={color} strokeWidth="2.5" />
        </g>,
    ];
    return variants[index] ?? variants[0];
}

function FaceLayer({ isAngry }) {
    return (
        <>
            {/* Head — slightly slimmer to match body */}
            <ellipse cx="50" cy="48" rx="20" ry="24" fill="#f5c5a3" />
            {/* Ears */}
            <ellipse cx="29" cy="50" rx="3.5" ry="5" fill="#f5c5a3" />
            <ellipse cx="71" cy="50" rx="3.5" ry="5" fill="#f5c5a3" />
            {/* Cheeks */}
            <ellipse cx="37" cy="56" rx="6" ry="4" fill="#f9a8a8" opacity="0.5" />
            <ellipse cx="63" cy="56" rx="6" ry="4" fill="#f9a8a8" opacity="0.5" />
            {/* Nose */}
            <ellipse cx="50" cy="54" rx="2.5" ry="2" fill="#e8a882" />
            {/* Smile / Mouth */}
            {isAngry ? (
                <path d="M44 65 Q50 61 56 65" fill="none" stroke="#c47a5a" strokeWidth="2" strokeLinecap="round" />
            ) : (
                <path d="M43 61 Q50 67 57 61" fill="none" stroke="#c47a5a" strokeWidth="2" strokeLinecap="round" />
            )}
        </>
    );
}

function EyesLayer({ index, color }) {
    const c = color || '#3b2a1a';
    const variants = [
        // 0 default
        <>
            <ellipse cx="41" cy="47" rx="5" ry="5.5" fill="white" />
            <ellipse cx="59" cy="47" rx="5" ry="5.5" fill="white" />
            <ellipse cx="42" cy="47.5" rx="3" ry="3.5" fill={c} />
            <ellipse cx="60" cy="47.5" rx="3" ry="3.5" fill={c} />
            <circle cx="43.5" cy="46" r="1" fill="white" />
            <circle cx="61.5" cy="46" r="1" fill="white" />
        </>,
        // 1 happy
        <>
            <path d="M36 49 Q41 43 46 49" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M54 49 Q59 43 64 49" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </>,
        // 2 cool
        <>
            <ellipse cx="41" cy="47" rx="5" ry="5.5" fill="white" />
            <ellipse cx="59" cy="47" rx="5" ry="5.5" fill="white" />
            <ellipse cx="42" cy="48" rx="3" ry="3.5" fill={c} />
            <ellipse cx="60" cy="48" rx="3" ry="3.5" fill={c} />
            <rect x="36" y="42" width="10" height="5" rx="1" fill="#f5c5a3" />
            <rect x="54" y="42" width="10" height="5" rx="1" fill="#f5c5a3" />
        </>,
        // 3 sleepy
        <>
            <ellipse cx="41" cy="49" rx="5" ry="4" fill="white" />
            <ellipse cx="59" cy="49" rx="5" ry="4" fill="white" />
            <ellipse cx="41" cy="50" rx="3" ry="2.5" fill={c} />
            <ellipse cx="59" cy="50" rx="3" ry="2.5" fill={c} />
            <path d="M36 46 Q41 50 46 46" fill="#f5c5a3" />
            <path d="M54 46 Q59 50 64 46" fill="#f5c5a3" />
        </>,
        // 4 winking
        <>
            <ellipse cx="41" cy="47" rx="5" ry="5.5" fill="white" />
            <ellipse cx="42" cy="47.5" rx="3" ry="3.5" fill={c} />
            <circle cx="43.5" cy="46" r="1" fill="white" />
            <path d="M54 47 Q59 44 64 47 Q59 50 54 47" fill={c} />
        </>,
        // 5 surprised
        <>
            <ellipse cx="41" cy="47" rx="6" ry="6.5" fill="white" />
            <ellipse cx="59" cy="47" rx="6" ry="6.5" fill="white" />
            <circle cx="41" cy="47" r="2.5" fill={c} />
            <circle cx="59" cy="47" r="2.5" fill={c} />
        </>,
        // 6 starry
        <>
            <ellipse cx="41" cy="47" rx="6" ry="6.5" fill="white" />
            <ellipse cx="59" cy="47" rx="6" ry="6.5" fill="white" />
            <polygon points="41,43 42.5,45.5 45,46 43,47.5 44,50 41,48.5 38,50 39,47.5 37,46 39.5,45.5" fill="#fde047" />
            <polygon points="59,43 60.5,45.5 63,46 61,47.5 62,50 59,48.5 56,50 57,47.5 55,46 57.5,45.5" fill="#fde047" />
        </>,
        // 7 cute
        <>
            <ellipse cx="41" cy="47" rx="6" ry="7" fill={c} />
            <ellipse cx="59" cy="47" rx="6" ry="7" fill={c} />
            <circle cx="42" cy="44" r="2.5" fill="white" />
            <circle cx="60" cy="44" r="2.5" fill="white" />
            <circle cx="39" cy="49" r="1.5" fill="white" />
            <circle cx="57" cy="49" r="1.5" fill="white" />
        </>,
        // 8 angry
        <>
            <ellipse cx="41" cy="47" rx="5" ry="5" fill="white" />
            <ellipse cx="59" cy="47" rx="5" ry="5" fill="white" />
            <circle cx="42" cy="47.5" r="2.5" fill={c} />
            <circle cx="60" cy="47.5" r="2.5" fill={c} />
            <line x1="33" y1="41" x2="47" y2="45" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="67" y1="41" x2="53" y2="45" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </>,
    ];
    return <>{variants[index] ?? variants[0]}</>;
}

function HairLayer({ index }) {
    const c = HAIR_COLOR;
    const variants = [
        // 0 default short — matches slimmer head
        <path d="M29 42 Q30 24 50 22 Q70 24 71 42 Q64 30 50 28 Q36 30 29 42 Z" fill={c} />,
        // 1 curly afro
        <>
            <ellipse cx="50" cy="28" rx="26" ry="20" fill={c} />
            <circle cx="31" cy="37" r="9" fill={c} />
            <circle cx="69" cy="37" r="9" fill={c} />
            <circle cx="42" cy="22" r="8" fill={c} />
            <circle cx="58" cy="22" r="8" fill={c} />
        </>,
        // 2 wavy medium
        <>
            <path d="M27 44 Q28 20 50 18 Q72 20 73 44 Q65 26 50 24 Q35 26 27 44 Z" fill={c} />
            <path d="M27 50 Q22 48 22 55 Q26 60 30 56 Q28 52 27 50 Z" fill={c} />
            <path d="M73 50 Q78 48 78 55 Q74 60 70 56 Q72 52 73 50 Z" fill={c} />
        </>,
        // 3 spiky
        <>
            <path d="M30 38 Q32 24 50 20 Q68 24 70 38" fill={c} />
            <polygon points="35,22 32,8 42,20" fill={c} />
            <polygon points="50,19 50,4 57,20" fill={c} />
            <polygon points="64,22 68,8 58,20" fill={c} />
        </>,
        // 4 long (flowing down sides)
        <>
            <path d="M27 44 Q28 20 50 18 Q72 20 73 44 Q65 26 50 24 Q35 26 27 44 Z" fill={c} />
            <path d="M27 44 Q20 55 22 80 Q26 82 30 70 Q28 56 27 44 Z" fill={c} />
            <path d="M73 44 Q80 55 78 80 Q74 82 70 70 Q72 56 73 44 Z" fill={c} />
        </>,
        // 5 mohawk
        <>
            <rect x="45" y="6" width="10" height="36" rx="5" fill={c} />
            <path d="M27 44 Q33 36 40 34 L45 42 Q35 38 27 44 Z" fill={c} />
            <path d="M73 44 Q67 36 60 34 L55 42 Q65 38 73 44 Z" fill={c} />
        </>,
        // 6 bob cut
        <>
            <ellipse cx="50" cy="30" rx="26" ry="18" fill={c} />
            <path d="M24 30 L24 55 Q30 60 35 55 L35 30 Z" fill={c} />
            <path d="M76 30 L76 55 Q70 60 65 55 L65 30 Z" fill={c} />
            <path d="M24 40 Q50 25 76 40 L50 20 Z" fill={c} />
        </>,
        // 7 ponytail
        <>
            <path d="M27 42 Q28 15 50 15 Q72 15 73 42 Q65 25 50 25 Q35 25 27 42 Z" fill={c} />
            <ellipse cx="50" cy="18" rx="8" ry="6" fill={c} opacity="0.8" />
            <path d="M68 25 Q85 30 80 55 Q75 40 65 35" fill={c} />
        </>,
        // 8 braids
        <>
            <path d="M27 42 Q28 22 50 20 Q72 22 73 42 Q65 28 50 26 Q35 28 27 42 Z" fill={c} />
            <path d="M24 40 Q20 50 25 60 Q20 70 25 80 Q30 85 28 85" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M76 40 Q80 50 75 60 Q80 70 75 80 Q70 85 72 85" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </>,
        // 9 updo bun
        <>
            <path d="M27 42 Q28 15 50 15 Q72 15 73 42 Q65 25 50 25 Q35 25 27 42 Z" fill={c} />
            <circle cx="50" cy="10" r="12" fill={c} />
        </>,
        // 10 fade cut
        <>
            <path d="M30 35 Q30 18 50 16 Q70 18 70 35 Q65 25 50 23 Q35 25 30 35 Z" fill={c} />
            <path d="M26 35 L26 48 Q28 48 29 35 Z" fill={c} opacity="0.6" />
            <path d="M74 35 L74 48 Q72 48 71 35 Z" fill={c} opacity="0.6" />
        </>,
        // 11 buzz cut
        <>
            <path d="M27 44 Q28 24 50 22 Q72 24 73 44 Q65 30 50 28 Q35 30 27 44 Z" fill={c} opacity="0.85" />
        </>
    ];
    return <>{variants[index] ?? variants[0]}</>;
}

function AccessoryLayer({ index }) {
    const variants = [
        null, // 0 none
        // 1 glasses
        <>
            <rect x="33" y="43" width="12" height="9" rx="4" fill="none" stroke="#374151" strokeWidth="2" />
            <rect x="55" y="43" width="12" height="9" rx="4" fill="none" stroke="#374151" strokeWidth="2" />
            <line x1="45" y1="47" x2="55" y2="47" stroke="#374151" strokeWidth="2" />
            <line x1="22" y1="47" x2="33" y2="47" stroke="#374151" strokeWidth="2" />
            <line x1="67" y1="47" x2="78" y2="47" stroke="#374151" strokeWidth="2" />
        </>,
        // 2 sunglasses
        <>
            <rect x="32" y="43" width="14" height="9" rx="4" fill="#1f2937" />
            <rect x="54" y="43" width="14" height="9" rx="4" fill="#1f2937" />
            <line x1="46" y1="47" x2="54" y2="47" stroke="#1f2937" strokeWidth="2.5" />
            <line x1="22" y1="47" x2="32" y2="47" stroke="#374151" strokeWidth="2" />
            <line x1="68" y1="47" x2="78" y2="47" stroke="#374151" strokeWidth="2" />
            <rect x="32" y="43" width="14" height="9" rx="4" fill="rgba(99,102,241,0.3)" />
            <rect x="54" y="43" width="14" height="9" rx="4" fill="rgba(99,102,241,0.3)" />
        </>,
        // 3 headband
        <rect x="27" y="36" width="46" height="8" rx="4" fill="#6366f1" opacity="0.85" />,
        // 4 rare glasses (golden)
        <>
            <rect x="33" y="43" width="12" height="9" rx="4" fill="rgba(251,191,36,0.2)" stroke="#f59e0b" strokeWidth="2" />
            <rect x="55" y="43" width="12" height="9" rx="4" fill="rgba(251,191,36,0.2)" stroke="#f59e0b" strokeWidth="2" />
            <line x1="45" y1="47" x2="55" y2="47" stroke="#f59e0b" strokeWidth="2" />
            <line x1="22" y1="47" x2="33" y2="47" stroke="#f59e0b" strokeWidth="2" />
            <line x1="67" y1="47" x2="78" y2="47" stroke="#f59e0b" strokeWidth="2" />
        </>,
        // 5 crown
        <>
            <polygon points="28,30 34,18 41,28 50,15 59,28 66,18 72,30" fill="#f59e0b" />
            <rect x="28" y="28" width="44" height="10" rx="3" fill="#f59e0b" />
            <circle cx="50" cy="28" r="4" fill="#ef4444" />
            <circle cx="36" cy="30" r="3" fill="#60a5fa" />
            <circle cx="64" cy="30" r="3" fill="#34d399" />
        </>,
        // 6 headphones
        <>
            <path d="M21 44 Q50 8 79 44" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
            <rect x="18" y="38" width="8" height="20" rx="3" fill="#ef4444" />
            <rect x="74" y="38" width="8" height="20" rx="3" fill="#ef4444" />
        </>,
        // 7 beanie
        <>
            <path d="M24 38 Q50 5 76 38" fill="#ec4899" />
            <rect x="23" y="34" width="54" height="8" rx="2" fill="#be185d" />
            <circle cx="50" cy="15" r="5" fill="#fbcfe8" />
        </>,
        // 8 face mask
        <>
            <path d="M30 54 Q50 48 70 54 L68 65 Q50 72 32 65 Z" fill="#f3f4f6" />
            <line x1="26" y1="50" x2="30" y2="54" stroke="#d1d5db" strokeWidth="2" />
            <line x1="74" y1="50" x2="70" y2="54" stroke="#d1d5db" strokeWidth="2" />
        </>,
        // 9 hoop earrings
        <>
            <circle cx="25" cy="58" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="75" cy="58" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
        </>,
        // 10 necklace
        <>
            <path d="M35 76 Q50 90 65 76" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="50" cy="84" r="3" fill="#ef4444" />
        </>,
        // 11 scarf
        <>
            <path d="M32 72 Q50 82 68 72 L65 80 Q50 88 35 80 Z" fill="#3b82f6" />
            <path d="M35 80 L35 100 L42 96 L42 78 Z" fill="#2563eb" />
        </>,
    ];
    return <>{variants[index] ?? null}</>;
}


// ─── Main Component ───────────────────────────────────────────────────────────

export function AvatarDisplay({ avatarConfig = {}, size = 'md', className = '', showBg = true, userTheme = null }) {
    const { hair = 0, shirt = 0, pants = 0, shoes = 0, eyes = 0, eyeColor = 0, accessory = 0, bg = 0 } = avatarConfig;

    const reactId = useId();
    const gradId = `bgGrad-${reactId.replace(/:/g, '')}`;

    const sizeMap = { xs: 40, sm: 56, md: 80, lg: 100, xl: 130 };
    const px = sizeMap[size] ?? sizeMap.md;

    // Check if the current shirt is a dress (which hides pants)
    const isDress = shirt === 7;

    return (
        <svg
            width={px}
            height={px}
            viewBox="0 0 100 110"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }}
        >
            {/* Background Layer (Static Full Size) */}
            <BgLayer index={bg} gradId={gradId} userTheme={userTheme} />
            {showBg && <circle cx="50" cy="55" r="55" fill={`url(#${gradId})`} />}

            {/* Slimmer, taller figure — scale to fit circle */}
            <g transform="scale(0.52) translate(46, 12)">
                <PantsLayer index={pants} isDress={isDress} />
                <ShoesLayer index={shoes} />
                <BodyLayer />
                <ShirtLayer index={shirt} />
                <FaceLayer isAngry={eyes === 8} />
                <HairLayer index={hair} />
                <EyesLayer index={eyes} color={EYE_COLORS[eyeColor]} />
                <AccessoryLayer index={accessory} />
            </g>
        </svg>
    );
}
