import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
    className?: string;
}

const EmptyState = ({
    message = "No data available",
    icon = <Inbox className="w-16 h-16 text-primary-400" />,
    className = ""
}: EmptyStateProps) => {
    return (
        <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
            <div className="text-gray-400 mb-4">
                {icon}
            </div>
            <p className="text-gray-500 text-lg font-medium">{message}</p>
        </div>
    );
};

export default EmptyState; 