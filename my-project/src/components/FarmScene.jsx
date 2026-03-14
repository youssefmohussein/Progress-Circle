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

const THEME_CONFIG = {
    classic: {
        sky: 'linear-gradient(135deg, #1e1b4b 0%, #0f0e2a 100%)',
        glow: '#818cf8',
        dirtLeft: '#854d0e',
        dirtRight: '#713f12',
        grassLight: '#a3e635',
        grassDark: '#84cc16',
        stroke: '#4d7c0f'
    },
    winter: {
        sky: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
        glow: '#7dd3fc',
        dirtLeft: '#334155',
        dirtRight: '#1e293b',
        grassLight: '#f1f5f9',
        grassDark: '#e2e8f0',
        stroke: '#cbd5e1'
    },
    cyberpunk: {
        sky: 'linear-gradient(135deg, #2e1065 0%, #000000 100%)',
        glow: '#d946ef',
        dirtLeft: '#4a044e',
        dirtRight: '#2e1065',
        grassLight: '#1e1b4b',
        grassDark: '#0f172a',
        stroke: '#f0abfc'
    },
    desert: {
        sky: 'linear-gradient(135deg, #7c2d12 0%, #431407 100%)',
        glow: '#fb923c',
        dirtLeft: '#9a3412',
        dirtRight: '#7c2d12',
        grassLight: '#fde047',
        grassDark: '#eab308',
        stroke: '#854d0e'
    },
    volcanic: {
        sky: 'linear-gradient(135deg, #450a0a 0%, #000000 100%)',
        glow: '#ef4444',
        dirtLeft: '#1c1917',
        dirtRight: '#0c0a09',
        grassLight: '#7f1d1d',
        grassDark: '#450a0a',
        stroke: '#f87171'
    },
    oceanic: {
        sky: 'linear-gradient(135deg, #164e63 0%, #083344 100%)',
        glow: '#22d3ee',
        dirtLeft: '#155e75',
        dirtRight: '#164e63',
        grassLight: '#67e8f9',
        grassDark: '#22d3ee',
        stroke: '#083344'
    },
    galactic: {
        sky: 'linear-gradient(135deg, #020617 0%, #1e1b4b 100%)',
        glow: '#818cf8',
        dirtLeft: '#0f172a',
        dirtRight: '#020617',
        grassLight: '#1e1b4b',
        grassDark: '#0f172a',
        stroke: '#c7d2fe'
    }
};

const TreeShapes = {
    classic: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(0,0,0,0.15)" />
                <rect x="-2" y="-14" width="4" height="14" fill="#78350f" rx="1.5" />
                <path d="M-2,-7 L-6,-12" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M2,-9 L6,-10" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="0" cy="-16" r="10" fill="#4ade80" />
                <circle cx="-6" cy="-12" r="6" fill="#22c55e" />
                <circle cx="6" cy="-12" r="6" fill="#22c55e" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.2)" />
                <rect x="-4" y="-12" width="8" height="12" fill="#5c4033" rx="2" />
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
    },
    winter: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(0,0,0,0.1)" />
                <rect x="-2" y="-14" width="4" height="14" fill="#475569" rx="1.5" />
                <circle cx="0" cy="-16" r="10" fill="#f8fafc" />
                <circle cx="-6" cy="-12" r="6" fill="#f1f5f9" />
                <circle cx="6" cy="-12" r="6" fill="#f1f5f9" />
                <path d="M-4,-18 L-2,-16 M4,-18 L2,-16" stroke="#94a3b8" strokeWidth="1" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.1)" />
                <rect x="-4" y="-12" width="8" height="12" fill="#334155" rx="2" />
                <path d="M0,-36 L-24,-10 L24,-10 Z" fill="#f1f5f9" />
                <path d="M0,-52 L-20,-24 L20,-24 Z" fill="#e2e8f0" />
                <path d="M0,-68 L-14,-38 L14,-38 Z" fill="#fff" />
                <circle cx="-10" cy="-18" r="2" fill="#93c5fd" opacity="0.4" />
                <circle cx="8" cy="-40" r="1.5" fill="#93c5fd" opacity="0.3" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(0,0,0,0.1)" />
                <path d="M-6,0 Q-4,-20 -2,-30 L2,-30 Q4,-20 6,0 Z" fill="#334155" />
                <circle cx="-16" cy="-28" r="18" fill="#cbd5e1" />
                <circle cx="16" cy="-26" r="20" fill="#f1f5f9" />
                <circle cx="0" cy="-48" r="24" fill="#fff" />
                <path d="M-10,-45 Q5,-55 15,-40" stroke="#94a3b8" fill="none" opacity="0.2" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.15)" />
                <rect x="-4" y="-12" width="8" height="12" fill="#1e293b" rx="2" />
                <path d="M0,-36 L-24,-10 L24,-10 Z" fill="#93c5fd" />
                <path d="M0,-52 L-20,-24 L20,-24 Z" fill="#bfdbfe" />
                <path d="M0,-68 L-14,-38 L14,-38 Z" fill="#eff6ff" />
                <circle cx="0" cy="-75" r="4" fill="#fbbf24" filter="blur(1px)" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(0,0,0,0.1)" />
                <path d="M-6,0 Q-4,-22 -2,-32 L2,-32 Q4,-22 6,0 Z" fill="#1e293b" />
                <circle cx="-18" cy="-28" r="20" fill="#fff" />
                <circle cx="18" cy="-26" r="22" fill="#f8fafc" />
                <circle cx="0" cy="-48" r="26" fill="#e0f2fe" />
                <circle cx="-12" cy="-62" r="18" fill="#bae6fd" />
                <path d="M-5,-40 L5,-50 M-5,-50 L5,-40" stroke="#7dd3fc" strokeWidth="2" opacity="0.6" />
                <circle cx="15" cy="-60" r="3" fill="#fbbf24" />
            </g>
        )
    },
    cyberpunk: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(217,70,239,0.2)" />
                <rect x="-2" y="-14" width="4" height="14" fill="#d946ef" rx="0" />
                <rect x="-8" y="-20" width="16" height="16" fill="#2e1065" stroke="#d946ef" strokeWidth="1" />
                <circle cx="0" cy="-12" r="2" fill="#f0abfc" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(14,165,233,0.2)" />
                <rect x="-4" y="-12" width="8" height="12" fill="#0c4a6e" />
                <path d="M0,-50 L-20,-10 L20,-10 Z" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M0,-65 L-15,-25 L15,-25 Z" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <path d="M0,-80 L-10,-40 L10,-40 Z" fill="none" stroke="#7dd3fc" strokeWidth="2" />
                <rect x="-1" y="-80" width="2" height="70" fill="#0ea5e9" opacity="0.5" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(217,70,239,0.2)" />
                <rect x="-3" y="-30" width="6" height="30" fill="#4a044e" />
                <rect x="-20" y="-50" width="40" height="30" fill="rgba(217,70,239,0.1)" stroke="#d946ef" strokeWidth="1.5" rx="4" />
                <rect x="-15" y="-65" width="30" height="25" fill="rgba(217,70,239,0.1)" stroke="#f0abfc" strokeWidth="1.5" rx="4" />
                <circle cx="-10" cy="-40" r="3" fill="#d946ef" />
                <circle cx="10" cy="-55" r="3" fill="#f0abfc" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(251,191,36,0.2)" />
                <rect x="-3" y="-80" width="6" height="80" fill="#4338ca" />
                <rect x="-10" y="-85" width="20" height="10" fill="#fbbf24" rx="2" />
                <path d="M-20,-10 L20,-10" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M-15,-40 L15,-40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M-10,-70 L10,-70" stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(168,85,247,0.3)" />
                <rect x="-4" y="-40" width="8" height="40" fill="#581c87" />
                <rect x="-30" y="-80" width="60" height="50" fill="rgba(168,85,247,0.05)" stroke="#a855f7" strokeWidth="2" rx="10" />
                <rect x="-20" y="-95" width="40" height="40" fill="rgba(192,132,252,0.1)" stroke="#c084fc" strokeWidth="2" rx="10" />
                <circle cx="0" cy="-60" r="10" fill="#d8b4fe" opacity="0.6" />
                <path d="M-30,-30 L30,-30" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
            </g>
        )
    },
    desert: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(124,45,18,0.2)" />
                <path d="M0,0 Q5,-15 10,-20" fill="none" stroke="#166534" strokeWidth="3" rx="1" />
                <circle cx="10" cy="-22" r="3" fill="#f43f5e" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(124,45,18,0.2)" />
                <path d="M-5,0 L-5,-40 Q-5,-45 0,-45 L5,-45 L5,0 Z" fill="#15803d" />
                <circle cx="-5" cy="-20" r="1" fill="#fff" opacity="0.3" />
                <circle cx="5" cy="-10" r="1" fill="#fff" opacity="0.3" />
                <circle cx="0" cy="-35" r="1.2" fill="#fff" opacity="0.3" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(124,45,18,0.2)" />
                <path d="M-8,0 L-8,-50 Q-8,-60 0,-60 Q8,-60 8,-50 L8,0 Z" fill="#166534" />
                <path d="M-8,-30 L-20,-45 Q-20,-50 -15,-50 L-8,-40" fill="#166534" />
                <path d="M8,-25 L18,-35 Q18,-40 13,-40 L8,-30" fill="#166534" />
                <circle cx="-2" cy="-20" r="1" fill="#fff" opacity="0.2" />
                <circle cx="2" cy="-40" r="1" fill="#fff" opacity="0.2" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(124,45,18,0.2)" />
                <path d="M-6,0 L-6,-60 Q0,-70 6,-60 L6,0 Z" fill="#065f46" />
                <path d="M0,-65 L0,-75" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <path d="M-5,-68 L5,-68" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(124,45,18,0.25)" />
                <path d="M-10,0 L-10,-70 Q0,-85 10,-70 L10,0 Z" fill="#166534" />
                <path d="M-10,-40 L-25,-55 Q-30,-65 -20,-70 L-10,-55" fill="#15803d" />
                <path d="M10,-30 L25,-45 Q30,-55 20,-60 L10,-45" fill="#15803d" />
                <circle cx="-20" cy="-65" r="4" fill="#fbbf24" />
                <circle cx="20" cy="-55" r="4" fill="#fbbf24" />
                <circle cx="0" cy="-78" r="5" fill="#fbbf24" />
            </g>
        )
    },
    volcanic: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(239,68,68,0.2)" />
                <rect x="-2" y="-12" width="4" height="12" fill="#1c1917" rx="1" />
                <circle cx="0" cy="-14" r="8" fill="#ef4444" />
                <circle cx="0" cy="-14" r="4" fill="#f87171" opacity="0.6" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.3)" />
                <rect x="-3" y="-10" width="6" height="10" fill="#262626" />
                <path d="M0,-40 L-18,-10 L18,-10 Z" fill="#450a0a" />
                <path d="M0,-55 L-14,-25 L14,-25 Z" fill="#7f1d1d" />
                <path d="M0,-70 L-10,-40 L10,-40 Z" fill="#ef4444" />
                <circle cx="-5" cy="-45" r="1.5" fill="#facc15" />
                <circle cx="6" cy="-25" r="2" fill="#facc15" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(0,0,0,0.3)" />
                <path d="M-5,0 L-5,-30 L5,-30 L5,0 Z" fill="#1c1917" />
                <circle cx="-15" cy="-35" r="15" fill="#450a0a" />
                <circle cx="15" cy="-30" r="18" fill="#7f1d1d" />
                <circle cx="0" cy="-55" r="22" fill="#b91c1c" />
                <path d="M-10,-50 L10,-55" stroke="#f87171" strokeWidth="2" strokeDasharray="2 4" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(0,0,0,0.4)" />
                <path d="M0,-80 L-20,-10 L20,-10 Z" fill="#1c1917" stroke="#ef4444" strokeWidth="2" />
                <circle cx="0" cy="-85" r="6" fill="#facc15" filter="blur(2px)" />
                <path d="M-10,-30 L10,-50 M-10,-50 L10,-30" stroke="#f87171" strokeWidth="1" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(0,0,0,0.3)" />
                <path d="M-8,0 L-8,-40 Q0,-50 8,-40 L8,0 Z" fill="#262626" />
                <circle cx="-20" cy="-45" r="20" fill="#7f1d1d" opacity="0.8" />
                <circle cx="20" cy="-40" r="22" fill="#b91c1c" opacity="0.8" />
                <circle cx="0" cy="-65" r="25" fill="#ef4444" />
                <path d="M-15,-70 L-5,-80 L5,-70 L15,-80" fill="none" stroke="#fef08a" strokeWidth="2" />
            </g>
        )
    },
    oceanic: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(34,211,238,0.2)" />
                <path d="M0,0 Q-10,-10 0,-20 Q10,-30 0,-40" fill="none" stroke="#22d3ee" strokeWidth="4" />
                <circle cx="0" cy="-42" r="3" fill="#67e8f9" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(34,211,238,0.2)" />
                <path d="M-10,0 L0,-50 L10,0 Z" fill="#0891b2" />
                <path d="M-8,-10 L0,-60 L8,-10 Z" fill="#06b6d4" />
                <path d="M-6,-20 L0,-70 L6,-20 Z" fill="#22d3ee" />
                <circle cx="-5" cy="-30" r="2" fill="#fff" opacity="0.4" />
                <circle cx="4" cy="-50" r="1.5" fill="#fff" opacity="0.3" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(34,211,238,0.2)" />
                <rect x="-4" y="-30" width="8" height="30" fill="#155e75" />
                <circle cx="-15" cy="-35" r="15" fill="#0891b2" />
                <circle cx="15" cy="-30" r="18" fill="#06b6d4" />
                <circle cx="0" cy="-55" r="22" fill="#22d3ee" />
                <path d="M-12,-45 Q0,-55 12,-45" stroke="#fff" fill="none" opacity="0.3" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(34,211,238,0.3)" />
                <path d="M0,0 L-5,-60 L0,-80 L5,-60 Z" fill="#0e7490" />
                <path d="M-15,-20 L15,-20" stroke="#fff" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
                <path d="M-10,-50 L10,-50" stroke="#fff" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
                <circle cx="0" cy="-85" r="4" fill="#fff" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(255,255,255,0.2)" />
                <path d="M-8,0 Q0,-40 8,0 Z" fill="#155e75" />
                <circle cx="-20" cy="-30" r="12" fill="#22d3ee" />
                <circle cx="20" cy="-25" r="14" fill="#67e8f9" />
                <circle cx="0" cy="-50" r="18" fill="#fff" />
                <circle cx="-10" cy="-60" r="10" fill="#ec4899" opacity="0.6" />
                <circle cx="12" cy="-55" r="8" fill="#f43f5e" opacity="0.6" />
            </g>
        )
    },
    galactic: {
        sapling: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="16" ry="8" fill="rgba(129,140,248,0.2)" />
                <rect x="-1" y="-20" width="2" height="20" fill="#818cf8" />
                <circle cx="0" cy="-22" r="6" fill="#c7d2fe" />
                <circle cx="0" cy="-22" r="3" fill="#fff" />
            </g>
        ),
        pine: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(129,140,248,0.2)" />
                <path d="M0,-70 L-15,-10 L15,-10 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
                <circle cx="0" cy="-75" r="3" fill="#fff" />
                <path d="M-10,-25 L10,-25" stroke="#4f46e5" strokeWidth="1" />
                <path d="M-7,-40 L7,-40" stroke="#4f46e5" strokeWidth="1" />
                <circle cx="-8" cy="-15" r="1" fill="#fff" />
                <circle cx="8" cy="-20" r="1" fill="#fff" />
            </g>
        ),
        oak: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="28" ry="14" fill="rgba(129,140,248,0.2)" />
                <rect x="-2" y="-40" width="4" height="40" fill="#3730a3" />
                <circle cx="-15" cy="-40" r="15" fill="rgba(99,102,241,0.4)" stroke="#818cf8" strokeWidth="1" />
                <circle cx="15" cy="-45" r="18" fill="rgba(99,102,241,0.4)" stroke="#818cf8" strokeWidth="1" />
                <circle cx="0" cy="-65" r="22" fill="rgba(129,140,248,0.6)" stroke="#c7d2fe" strokeWidth="1.5" />
                <circle cx="-8" cy="-60" r="2" fill="#fff" />
                <circle cx="10" cy="-70" r="2" fill="#fff" />
            </g>
        ),
        pine_rare: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="20" ry="10" fill="rgba(129,140,248,0.3)" />
                <path d="M0,-85 L-12,-10 L12,-10 Z" fill="#1e1b4b" stroke="#818cf8" />
                <path d="M-12,-10 Q0,5 12,-10" fill="none" stroke="#818cf8" strokeWidth="1" />
                <circle cx="0" cy="-85" r="8" fill="#fff" opacity="0.2" />
                <circle cx="0" cy="-85" r="4" fill="#fff" />
                <circle cx="-5" cy="-40" r="1.5" fill="#c7d2fe" />
                <circle cx="5" cy="-60" r="1.5" fill="#c7d2fe" />
            </g>
        ),
        golden: (
            <g transform="translate(0, -2)">
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="rgba(129,140,248,0.3)" />
                <circle cx="0" cy="-50" r="40" fill="rgba(79,70,229,0.1)" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="5 5" />
                <rect x="-3" y="-30" width="6" height="30" fill="#312e81" />
                <circle cx="0" cy="-60" r="25" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                <circle cx="0" cy="-60" r="15" fill="#6366f1" opacity="0.6" />
                <path d="M-20,-60 L20,-60" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
                <circle cx="-15" cy="-60" r="3" fill="#fbbf24" mask="url(#ring)" />
            </g>
        )
    }
};

export function FarmScene({ trees, farmTheme = 'classic' }) {
    const GRID_SIZE = 6;
    const theme = THEME_CONFIG[farmTheme] || THEME_CONFIG.classic;

    const tiles = useMemo(() => {
        const arr = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const fillIndex = FILL_ORDER.findIndex(p => p[0] === row && p[1] === col);
                const tree = trees[fillIndex];
                const x = (col - row) * (TILE_W / 2);
                const y = (col + row) * (TILE_H / 2);
                const isLight = (row + col) % 2 === 0;
                arr.push({ row, col, x, y, tree, isLight, fillIndex });
            }
        }
        arr.sort((a, b) => (a.row + a.col) - (b.row + b.col));
        return arr;
    }, [trees]);

    const minX = -GRID_SIZE * (TILE_W / 2) - TILE_W + 20;
    const maxX = GRID_SIZE * (TILE_W / 2) + TILE_W - 20;
    const width = maxX - minX;
    const minY = -120;
    const maxY = (GRID_SIZE * 2) * (TILE_H / 2) + DIRT_DEPTH + TILE_H + 30;
    const height = maxY - minY;

    return (
        <div className="w-full relative rounded-2xl overflow-hidden shadow-xl" style={{ background: theme.sky }}>
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full opacity-30 blur-3xl pointer-events-none" 
                style={{ background: `radial-gradient(circle, ${theme.glow}, transparent)` }} 
            />

            <svg
                viewBox={`${minX} ${minY} ${width} ${height}`}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', margin: '0 auto', position: 'relative', zIndex: 1 }}
            >
                {tiles.map(tile => {
                    const topColor = tile.isLight ? theme.grassLight : theme.grassDark;
                    return (
                        <g key={`tile-${tile.row}-${tile.col}`} transform={`translate(${tile.x}, ${tile.y})`}>
                            <polygon
                                points={`0,${TILE_H / 2} ${TILE_W / 2},${TILE_H} ${TILE_W / 2},${TILE_H + DIRT_DEPTH} 0,${TILE_H / 2 + DIRT_DEPTH}`}
                                fill={theme.dirtLeft}
                            />
                            <polygon
                                points={`${TILE_W / 2},${TILE_H} ${TILE_W},${TILE_H / 2} ${TILE_W},${TILE_H / 2 + DIRT_DEPTH} ${TILE_W / 2},${TILE_H + DIRT_DEPTH}`}
                                fill={theme.dirtRight}
                            />
                            <polygon
                                points={`${TILE_W / 2},0 ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
                                fill={topColor}
                                stroke={theme.stroke}
                                strokeWidth="0.75"
                            />

                            {tile.tree && (
                                <g transform={`translate(${TILE_W / 2}, ${TILE_H / 2})`}>
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', damping: 10, mass: 0.8, delay: Math.min(tile.fillIndex * 0.05, 1.2) }}
                                    >
                                        {(TreeShapes[farmTheme] || TreeShapes.classic)[tile.tree.type] || TreeShapes.classic.sapling}
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
