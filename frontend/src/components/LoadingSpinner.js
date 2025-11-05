import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export function LoadingSpinner({ size = 'md', className }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    return (_jsx("div", { className: clsx('animate-spin rounded-full border-2 border-gray-300 border-t-primary-600', sizeClasses[size], className) }));
}
