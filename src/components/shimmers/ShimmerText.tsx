import React from 'react';

interface ShimmerTextProps {
    width?: string;
    height?: string;
    className?: string;
}

const ShimmerText: React.FC<ShimmerTextProps> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <div className={`animate-pulse bg-primary-50 rounded ${width} ${height} ${className}`}></div>
);

export default ShimmerText;
