import React from 'react';
import { CircleAlert } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    icon?: React.ReactNode;
    className?: string;
    onRetry?: () => void;
}

const ErrorState = ({
    message = "Something went wrong",
    icon = <CircleAlert className="w-12 h-12" />,
    className = "",
    onRetry
}: ErrorStateProps) => {
    return (
        <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
            <div className="text-red-500 mb-4">
                {icon}
            </div>
            <p className="text-gray-700 text-lg font-medium mb-4">{message}</p>
            {onRetry && (
                <button
                    aria-label="Try again"
                    aria-describedby="try-again-description"
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState; 