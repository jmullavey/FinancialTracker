import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Edit3, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
export function AccountsTable({ accounts, onSelectAccount, onEditAccount, onArchiveAccount }) {
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const sortedAccounts = [...accounts].sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'type':
                comparison = a.account_type.localeCompare(b.account_type);
                break;
            case 'balance':
                comparison = a.current_balance - b.current_balance;
                break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
    const SortIcon = ({ field }) => {
        if (sortField !== field)
            return null;
        return sortDirection === 'asc' ? (_jsx(ArrowUp, { className: "h-3 w-3 inline ml-1" })) : (_jsx(ArrowDown, { className: "h-3 w-3 inline ml-1" }));
    };
    return (_jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsxs("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('name'), children: ["Name ", _jsx(SortIcon, { field: "name" })] }), _jsxs("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('type'), children: ["Type ", _jsx(SortIcon, { field: "type" })] }), _jsxs("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('balance'), children: ["Balance ", _jsx(SortIcon, { field: "balance" })] }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Institution" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: sortedAccounts.map((account) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: account.name }), account.masked_number && (_jsxs("div", { className: "text-sm text-gray-500", children: ["****", account.masked_number] }))] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-900 capitalize", children: account.account_type }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `text-sm font-semibold ${account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(account.current_balance) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-500", children: account.institution_name || '-' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => onSelectAccount(account), className: "text-primary-600 hover:text-primary-900", title: "View Details", children: _jsx(Eye, { className: "h-4 w-4" }) }), onEditAccount && (_jsx("button", { onClick: () => onEditAccount(account), className: "text-gray-600 hover:text-gray-900", title: "Edit", children: _jsx(Edit3, { className: "h-4 w-4" }) })), onArchiveAccount && (_jsx("button", { onClick: () => {
                                                    if (window.confirm(`Are you sure you want to archive "${account.name}"?`)) {
                                                        console.warn(`Archiving account: ${account.name}`);
                                                        onArchiveAccount(account.id);
                                                    }
                                                }, className: "text-red-600 hover:text-red-900", title: "Archive", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] }) })] }, account.id))) })] }), sortedAccounts.length === 0 && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No accounts found" }) }))] }));
}
