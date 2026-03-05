export function ProgressBar({ progress, className = '', showLabel = true }) {
    // Ensure the progress stays between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={className}>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-sm text-gray-600 mt-1 text-right">{clampedProgress}%</p>
            )}
        </div>
    );
}