import React from 'react';

const ShimmerButton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className="animate-pulse bg-primary-0 rounded h-10 w-24"></div>
);

export default ShimmerButton;
