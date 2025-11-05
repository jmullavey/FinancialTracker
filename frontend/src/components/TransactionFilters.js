import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Calendar, DollarSign, Tag, Building, Filter, X } from 'lucide-react';
export function TransactionFilters({ onFiltersChange, categories, accounts, isOpen, onClose }) {
    const [filters, setFilters] = useState({
        dateRange: { start: '', end: '' },
        amountRange: { min: '', max: '' },
        categories: [],
        accounts: [],
        types: [],
        searchTerm: ''
    });
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };
    const handleCategoryToggle = (categoryId) => {
        const newCategories = filters.categories.includes(categoryId)
            ? filters.categories.filter(id => id !== categoryId)
            : [...filters.categories, categoryId];
        handleFilterChange('categories', newCategories);
    };
    const handleAccountToggle = (accountId) => {
        const newAccounts = filters.accounts.includes(accountId)
            ? filters.accounts.filter(id => id !== accountId)
            : [...filters.accounts, accountId];
        handleFilterChange('accounts', newAccounts);
    };
    const handleTypeToggle = (type) => {
        const newTypes = filters.types.includes(type)
            ? filters.types.filter(t => t !== type)
            : [...filters.types, type];
        handleFilterChange('types', newTypes);
    };
    const clearAllFilters = () => {
        const clearedFilters = {
            dateRange: { start: '', end: '' },
            amountRange: { min: '', max: '' },
            categories: [],
            accounts: [],
            types: [],
            searchTerm: ''
        };
        setFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.dateRange.start || filters.dateRange.end)
            count++;
        if (filters.amountRange.min || filters.amountRange.max)
            count++;
        if (filters.categories.length > 0)
            count++;
        if (filters.accounts.length > 0)
            count++;
        if (filters.types.length > 0)
            count++;
        if (filters.searchTerm)
            count++;
        return count;
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "bg-white rounded-lg border-2 border-primary-200 shadow-md p-4 sm:p-6 mb-4 sm:mb-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "p-1.5 bg-primary-100 rounded-lg", children: _jsx(Filter, { className: "h-4 w-4 sm:h-5 sm:w-5 text-primary-600" }) }), _jsx("h3", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Advanced Filters" }), getActiveFilterCount() > 0 && (_jsxs("span", { className: "bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm", children: [getActiveFilterCount(), " active"] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: clearAllFilters, className: "text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors touch-manipulation px-3 py-1.5 hover:bg-gray-100 rounded-lg", children: "Clear all" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation p-1.5 rounded-lg", "aria-label": "Close filters", children: _jsx(X, { className: "h-5 w-5" }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1" }), "Date Range"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "date", value: filters.dateRange.start, onChange: (e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value }), className: "input text-sm sm:text-base", placeholder: "Start date" }), _jsx("input", { type: "date", value: filters.dateRange.end, onChange: (e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value }), className: "input text-sm sm:text-base", placeholder: "End date" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1" }), "Amount Range"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "number", step: "0.01", value: filters.amountRange.min, onChange: (e) => handleFilterChange('amountRange', { ...filters.amountRange, min: e.target.value }), className: "input text-sm sm:text-base", placeholder: "Min amount" }), _jsx("input", { type: "number", step: "0.01", value: filters.amountRange.max, onChange: (e) => handleFilterChange('amountRange', { ...filters.amountRange, max: e.target.value }), className: "input text-sm sm:text-base", placeholder: "Max amount" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: "Transaction Types" }), _jsx("div", { className: "space-y-2", children: ['income', 'expense', 'transfer'].map((type) => (_jsxs("label", { className: "flex items-center touch-manipulation py-1", children: [_jsx("input", { type: "checkbox", checked: filters.types.includes(type), onChange: () => handleTypeToggle(type), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4" }), _jsx("span", { className: "ml-2 text-xs sm:text-sm text-gray-700 capitalize", children: type })] }, type))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: [_jsx(Tag, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1" }), "Categories"] }), _jsx("div", { className: "max-h-32 sm:max-h-40 overflow-y-auto space-y-2", children: categories.map((category) => (_jsxs("label", { className: "flex items-center touch-manipulation py-1", children: [_jsx("input", { type: "checkbox", checked: filters.categories.includes(category.id), onChange: () => handleCategoryToggle(category.id), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4" }), _jsx("span", { className: "ml-2 text-xs sm:text-sm text-gray-700 truncate", children: category.name })] }, category.id))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: [_jsx(Building, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1" }), "Accounts"] }), _jsx("div", { className: "max-h-32 sm:max-h-40 overflow-y-auto space-y-2", children: accounts.map((account) => (_jsxs("label", { className: "flex items-center touch-manipulation py-1", children: [_jsx("input", { type: "checkbox", checked: filters.accounts.includes(account.id), onChange: () => handleAccountToggle(account.id), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4" }), _jsx("span", { className: "ml-2 text-xs sm:text-sm text-gray-700 truncate", children: account.name })] }, account.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 mb-2", children: "Search" }), _jsx("input", { type: "text", value: filters.searchTerm, onChange: (e) => handleFilterChange('searchTerm', e.target.value), className: "input text-sm sm:text-base", placeholder: "Search transactions..." })] })] })] }));
}
