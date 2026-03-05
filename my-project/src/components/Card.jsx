export function Card({ children, className = '', hover = false }) {
    return (
        <div
            className={`bg-white rounded-xl p-6 card-shadow ${hover ? 'transition-shadow duration-200 hover:card-shadow-hover' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}