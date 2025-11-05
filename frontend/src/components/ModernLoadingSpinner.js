import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
export function ModernLoadingSpinner({ size = 'md', text = 'Loading...', className = '' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };
    return (_jsxs("div", { className: `flex flex-col items-center justify-center space-y-3 ${className}`, children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600" }), _jsx(Loader2, { className: `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 ${sizeClasses[size]} animate-pulse` })] }), text && (_jsx("p", { className: "text-sm text-gray-600 animate-pulse", children: text }))] }));
}
