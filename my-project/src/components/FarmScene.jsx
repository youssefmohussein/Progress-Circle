import { useMemo } from 'react';
import { motion } from 'framer-motion';

export const TREES_PER_FARM = 36; // strictly 6x6 grid

const TILE_W = 96;
const TILE_H = 48;
const DIRT_DEPTH = 26;

// Dynamically assign fill order to start from the center (2.5, 2.5) and spiral outward organically
// This leaves the outermost corners (top, bottom, left, right edges) empty until the very end.
const FILL_ORDER = [];
for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
        FILL_ORDER.push([r, c]);
    }
}
FILL_ORDER.sort((a, b) => {
    // Distance squared from true center
    const distA = Math.pow(a[0] - 2.5, 2) + Math.pow(a[1] - 2.5, 2);
    const distB = Math.pow(b[0] - 2.5, 2) + Math.pow(b[1] - 2.5, 2);
    return distA - distB;
});

const TreeShapes = {
    sapling: (
        <g transform="translate(0, -2)">
            {/* Shadow */}
            <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(0,0,0,0.15)" />
            {/* Trunk */}
            <rect x="-2" y="-14" width="4" height="14" fill="#78350f" rx="1.5" />
            <path d="M-2,-7 L-6,-12" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M2,-9 L6,-10" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            {/* Leaves */}
            <circle cx="0" cy="-16" r="10" fill="#4ade80" />
            <circle cx="-6" cy="-12" r="6" fill="#22c55e" />
            <circle cx="6" cy="-12" r="6" fill="#22c55e" />
        </g>
    ),
    pine: (
        <g transform="translate(0, -2)">
            <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.2)" />
            <rect x="-4" y="-12" width="8" height="12" fill="#5c4033" rx="2" />
            {/* 3 stacked cones */}
            <path d="M0,-36 L-24,-10 L24,-10 Z" fill="#15803d" />
            <path d="M0,-36 L0,-10 L24,-10 Z" fill="#166534" />

            <path d="M0,-52 L-20,-24 L20,-24 Z" fill="#16a34a" />
            <path d="M0,-52 L0,-24 L20,-24 Z" fill="#15803d" />

            <path d="M0,-68 L-14,-38 L14,-38 Z" fill="#22c55e" />
            <path d="M0,-68 L0,-38 L14,-38 Z" fill="#16a34a" />
        </g>
    ),
    oak: (
        <g transform="translate(0, -2)">
            <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(0,0,0,0.2)" />
            <path d="M-6,0 Q-4,-20 -2,-30 L2,-30 Q4,-20 6,0 Z" fill="#5c4033" />
            <rect x="0" y="-30" width="2" height="30" fill="#451a03" opacity="0.3" />
            {/* Big fluffy rounds */}
            <circle cx="-16" cy="-28" r="18" fill="#15803d" />
            <circle cx="16" cy="-26" r="20" fill="#16a34a" />
            <circle cx="0" cy="-48" r="24" fill="#22c55e" />
            <circle cx="-10" cy="-60" r="16" fill="#4ade80" />
            <circle cx="14" cy="-56" r="18" fill="#4ade80" />
            <circle cx="6" cy="-65" r="12" fill="#86efac" />
        </g>
    ),
    pine_rare: (
        <g transform="translate(0, -2)">
            <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.2)" />
            <rect x="-4" y="-12" width="8" height="12" fill="#1e1b4b" rx="2" />

            <path d="M0,-36 L-24,-10 L24,-10 Z" fill="#312e81" />
            <path d="M0,-36 L0,-10 L24,-10 Z" fill="#3730a3" />

            <path d="M0,-52 L-20,-24 L20,-24 Z" fill="#3730a3" />
            <path d="M0,-52 L0,-24 L20,-24 Z" fill="#4f46e5" />

            <path d="M0,-68 L-14,-38 L14,-38 Z" fill="#4f46e5" />
            <path d="M0,-68 L0,-38 L14,-38 Z" fill="#6366f1" />
            {/* Stars */}
            <circle cx="-12" cy="-20" r="2.5" fill="#fff" opacity="0.9" />
            <circle cx="10" cy="-30" r="2" fill="#fff" opacity="0.8" />
            <circle cx="-6" cy="-42" r="2" fill="#fff" opacity="0.9" />
            <circle cx="5" cy="-52" r="1.5" fill="#fff" opacity="0.8" />
            <path d="M0,-72 L3,-65 L0,-62 L-3,-65 Z" fill="#fbbf24" />
        </g>
    ),
    golden: (
        <g transform="translate(0, -2)">
            <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(0,0,0,0.25)" />
            <path d="M-6,0 Q-4,-22 -2,-32 L2,-32 Q4,-22 6,0 Z" fill="#78350f" />
            <rect x="0" y="-32" width="2" height="32" fill="#451a03" opacity="0.4" />

            <circle cx="-18" cy="-28" r="20" fill="#b45309" />
            <circle cx="18" cy="-26" r="22" fill="#d97706" />
            <circle cx="0" cy="-48" r="26" fill="#fbbf24" />
            <circle cx="-12" cy="-62" r="18" fill="#fcd34d" />
            <circle cx="14" cy="-58" r="20" fill="#fef08a" />
            <circle cx="6" cy="-68" r="14" fill="#fff" opacity="0.8" />

            <path d="M-22,-36 L-18,-30 L-26,-30 Z" fill="#fff" opacity="0.9" />
            <path d="M16,-46 L20,-40 L12,-40 Z" fill="#fff" opacity="0.9" />
        </g>
    ),
};

export function FarmScene({ trees }) {
    const GRID_SIZE = 6;

    const tiles = useMemo(() => {
        const arr = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                // Find where this (row, col) tile is in the fill order
                const fillIndex = FILL_ORDER.findIndex(p => p[0] === row && p[1] === col);
                const tree = trees[fillIndex];

                // standard isometric coords
                const x = (col - row) * (TILE_W / 2);
                const y = (col + row) * (TILE_H / 2);
                const isLight = (row + col) % 2 === 0;

                arr.push({ row, col, x, y, tree, isLight, fillIndex });
            }
        }

        // Depth-sort for svg painting!
        arr.sort((a, b) => (a.row + a.col) - (b.row + b.col));
        return arr;
    }, [trees]);

    // Viewbox
    const minX = -GRID_SIZE * (TILE_W / 2) - TILE_W + 20;
    const maxX = GRID_SIZE * (TILE_W / 2) + TILE_W - 20;
    const width = maxX - minX;

    // Add extra space above for tall trees
    const minY = -120;
    const maxY = (GRID_SIZE * 2) * (TILE_H / 2) + DIRT_DEPTH + TILE_H + 30;
    const height = maxY - minY;

    return (
        <div className="w-full relative rounded-2xl overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0e2a 100%)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

            <svg
                viewBox={`${minX} ${minY} ${width} ${height}`}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', margin: '0 auto', position: 'relative', zIndex: 1 }}
            >
                {/* Paint exactly back to front */}
                {tiles.map(tile => {
                    // Vibrant colors matching the user's reference
                    const topColor = tile.isLight ? '#a3e635' : '#84cc16';
                    return (
                        <g key={`tile-${tile.row}-${tile.col}`} transform={`translate(${tile.x}, ${tile.y})`}>
                            {/* Left Dirt */}
                            <polygon
                                points={`0,${TILE_H / 2} ${TILE_W / 2},${TILE_H} ${TILE_W / 2},${TILE_H + DIRT_DEPTH} 0,${TILE_H / 2 + DIRT_DEPTH}`}
                                fill="#854d0e"
                            />
                            {/* Right Dirt */}
                            <polygon
                                points={`${TILE_W / 2},${TILE_H} ${TILE_W},${TILE_H / 2} ${TILE_W},${TILE_H / 2 + DIRT_DEPTH} ${TILE_W / 2},${TILE_H + DIRT_DEPTH}`}
                                fill="#713f12"
                            />
                            {/* Grass Top Polygon */}
                            <polygon
                                points={`${TILE_W / 2},0 ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
                                fill={topColor}
                                stroke="#4d7c0f"
                                strokeWidth="0.75"
                            />

                            {/* Center and Draw tree if present */}
                            {tile.tree && (
                                <g transform={`translate(${TILE_W / 2}, ${TILE_H / 2})`}>
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', damping: 10, mass: 0.8, delay: Math.min(tile.fillIndex * 0.05, 1.2) }}
                                    >
                                        {TreeShapes[tile.tree.type] || TreeShapes.sapling}
                                    </motion.g>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
