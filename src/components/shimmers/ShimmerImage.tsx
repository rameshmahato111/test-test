import React from 'react';

interface ShimmerImageProps {
    width?: string;
    height?: string;
    className?: string;
}

const ShimmerImage: React.FC<ShimmerImageProps> = ({ width = 'w-full', height = 'h-48', className = '' }) => (
    <div className={`animate-pulse bg-primary-50 rounded ${width} ${height} ${className}`}></div>
);

export default ShimmerImage;
