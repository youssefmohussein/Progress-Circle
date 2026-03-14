import { useMemo } from 'react';
import { generateAvatarSvg } from './avatarGenerator';
import { avatarDefaults } from './avatarDefaults';

export function AvatarDisplay({ avatarConfig, size = 'md', className = '', showBg = true, userTheme = null, previewMode = false }) {
    // Merge provided config with defaults to ensure all keys exist
    const configToRender = { ...avatarDefaults, ...(avatarConfig || {}) };

    // If userTheme is provided and we want to showBg, we could override the background here.
    // However, Open Peeps uses a simple hex code list for background colors.
    
    // Generate SVG string synchronously via DiceBear
    const svgString = useMemo(() => {
        return generateAvatarSvg(configToRender);
    }, [configToRender]);

    const sizeMap = { xs: 36, sm: 48, md: 72, lg: 90, xl: 120 };
    const px = sizeMap[size] ?? sizeMap.md;

    const getBackgroundStyle = () => {
        if (!showBg || !configToRender.backgroundColor || configToRender.backgroundColor === 'transparent') {
            return 'transparent';
        }
        const bg = configToRender.backgroundColor;
        // If it's a CSS gradient or already has a #, use it as is
        if (bg.includes('gradient') || bg.startsWith('#') || bg.startsWith('url')) {
            return bg;
        }
        // Otherwise assume it's a raw hex
        return `#${bg}`;
    };

    return (
        <div 
            className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${className}`}
            style={{ 
                width: px, 
                height: px,
                background: getBackgroundStyle()
            }}
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
}
