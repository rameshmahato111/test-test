import React from 'react';
import ShimmerCard from './ShimmerCard';

interface ShimmerCardGridProps {
    count: number;
    className?: string;
}

const ShimmerCardGrid: React.FC<ShimmerCardGridProps> = ({ count, className = '' }) => (
    <div
        style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(295px, 1fr))",
        }}
        className={`grid gap-4 pb-12 ${className}`}
    >
        {Array(count).fill(null).map((_, index) => (
            <ShimmerCard key={index} />
        ))}
    </div>
);

export default ShimmerCardGrid;
