import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * AdBanner — Renders a Google AdSense ad unit for FREE users only.
 * Renders nothing for Premium users.
 * Replace `data-ad-client` and `data-ad-slot` with your actual AdSense values.
 */
export default function AdBanner({ slot = 'auto', style = {} }) {
    const { user } = useAuth();
    const adRef = useRef(null);
    const pushed = useRef(false);

    // Don't render for premium users
    if (user?.plan === 'premium') return null;

    return <AdBannerInner slot={slot} style={style} adRef={adRef} pushed={pushed} />;
}

function AdBannerInner({ slot, style, adRef, pushed }) {
    useEffect(() => {
        if (pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            // AdSense not loaded yet or blocked
        }
    }, []);

    return (
        <div
            className="ad-banner-wrapper"
            style={{
                textAlign: 'center',
                padding: '8px 0',
                ...style,
            }}
        >
            <span
                style={{
                    display: 'block',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                }}
            >
                Advertisement
            </span>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
