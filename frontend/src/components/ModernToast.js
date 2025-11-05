import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
export function ModernToast({ message, type, onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    const getIcon = () => {
        switch (type) {
            case 'success':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'error':
                return _jsx(AlertCircle, { className: "h-5 w-5 text-red-600" });
            case 'info':
                return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
            default:
                return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
        }
    };
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };
    return (_jsx("div", { className: `fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`, children: _jsx("div", { className: `${getBackgroundColor()} border rounded-xl shadow-lg p-4 backdrop-blur-sm`, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: getIcon() }), _jsx("div", { className: "ml-3 flex-1", children: _jsx("p", { className: "text-sm font-medium text-gray-900", children: message }) }), _jsx("div", { className: "ml-4 flex-shrink-0", children: _jsx("button", { onClick: () => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }, className: "inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) }) })] }) }) }));
}
