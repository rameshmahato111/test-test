import React from 'react';

const ShimmerCard: React.FC<{ width?: string, height?: string, className?: string }> = ({ width = 'w-full', height = 'h-48', className = '' }) => (
    <div className={`animate-pulse bg-primary-100 rounded-lg overflow-hidden ${className}`}>
        <div className={`${width} ${height} bg-primary-50`}></div>
        <div className="p-4">
            <div className="h-4 bg-primary-50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-primary-50 rounded w-1/2"></div>
        </div>
    </div>
);

export default ShimmerCard;
