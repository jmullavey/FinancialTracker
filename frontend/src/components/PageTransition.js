import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export function PageTransition({ children, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);
    return (_jsx("div", { className: `transition-all duration-500 ease-in-out ${isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'} ${className}`, children: children }));
}
