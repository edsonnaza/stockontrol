import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import React from 'react';
import type { Toast } from '@/contexts/toast-context';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    const getStyles = (type: Toast['type']) => {
        const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg mb-3 animate-in fade-in slide-in-from-top';
        
        switch (type) {
            case 'success':
                return `${baseClasses} bg-green-50 text-green-800 border border-green-200`;
            case 'error':
                return `${baseClasses} bg-red-50 text-red-800 border border-red-200`;
            case 'warning':
                return `${baseClasses} bg-yellow-50 text-yellow-800 border border-yellow-200`;
            case 'info':
            default:
                return `${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`;
        }
    };

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'info':
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            {toasts.map((toast) => (
                <div key={toast.id} className={getStyles(toast.type)}>
                    {getIcon(toast.type)}
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="ml-2 inline-flex text-current hover:opacity-60"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
