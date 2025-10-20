import { Check, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationProps {
    title: string;
    message?: string;
    variant?: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
}

const variantStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-background font-semibold'
};

const iconMap = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info
};

export function Notification({
    title,
    message,
    variant = 'info',
    onClose
}: NotificationProps) {
    const Icon = iconMap[variant];

    return (
        <div className={cn(
            'fixed top-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg',
            variantStyles[variant]
        )}>
            <div className="flex items-start gap-3">
                {/* <div className="flex-shrink-0">
                    <Icon className="h-5 w-5" />
                </div> */}
                <div className="flex-1">
                    <h3 className="font-medium">{title}</h3>
                    {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
} 