import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CreditCard } from 'lucide-react';
export function AccountCard({ account, isSelected, onClick }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    return (_jsx("div", { onClick: onClick, className: `
        card cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-md'}
      `, children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center", children: _jsx("span", { className: "text-primary-700 font-semibold text-sm", children: getInitials(account.name) }) }) }), _jsxs("div", { className: "ml-4 flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: account.name }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatCurrency(account.current_balance) }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("p", { className: "text-xs text-gray-500 capitalize", children: account.account_type }), account.masked_number && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsxs("p", { className: "text-xs text-gray-500", children: ["****", account.masked_number.slice(-4)] })] }))] })] }), _jsx("div", { className: "flex-shrink-0 ml-2", children: _jsx(CreditCard, { className: "h-5 w-5 text-gray-400" }) })] }) }));
}
