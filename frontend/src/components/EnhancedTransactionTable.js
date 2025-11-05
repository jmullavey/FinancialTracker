import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, Copy, Check, X, Calendar, DollarSign, Tag, Building } from 'lucide-react';
import toast from 'react-hot-toast';
function Tooltip({ text, children }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef(null);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);
    const handleMouseEnter = (e) => {
        timeoutRef.current = setTimeout(() => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY + 8,
                    left: rect.left + window.scrollX + rect.width / 2
                });
                setIsVisible(true);
            }
        }, 1000); // 1 second delay
    };
    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    useEffect(() => {
        if (isVisible && tooltipRef.current && containerRef.current) {
            const tooltip = tooltipRef.current;
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const containerRect = containerRef.current.getBoundingClientRect();
            // Calculate center position
            let left = containerRect.left + containerRect.width / 2;
            // Adjust if tooltip would go off screen
            const tooltipHalfWidth = tooltipRect.width / 2;
            if (left - tooltipHalfWidth < 8) {
                left = tooltipHalfWidth + 8;
            }
            else if (left + tooltipHalfWidth > viewportWidth - 8) {
                left = viewportWidth - tooltipHalfWidth - 8;
            }
            setPosition(prev => ({
                ...prev,
                left: left + window.scrollX
            }));
        }
    }, [isVisible]);
    return (_jsxs("div", { ref: containerRef, className: "relative inline-block", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [children, isVisible && (_jsxs("div", { ref: tooltipRef, className: "px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg pointer-events-none whitespace-nowrap", style: {
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    transform: 'translateX(-50%)',
                    position: 'absolute',
                    zIndex: 9999,
                }, children: [text, _jsx("div", { className: "absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45", style: { top: '-4px' } })] }))] }));
}
export function EnhancedTransactionTable({ transactions, selectedTransactions, onSelectionChange, onEdit, onDelete, onDuplicate, categories, accounts }) {
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const handleSelectAll = () => {
        if (selectedTransactions.size === transactions.length) {
            onSelectionChange(new Set());
        }
        else {
            onSelectionChange(new Set(transactions.map(t => t.id)));
        }
    };
    const handleSelectTransaction = (transactionId) => {
        const newSelected = new Set(selectedTransactions);
        if (newSelected.has(transactionId)) {
            newSelected.delete(transactionId);
        }
        else {
            newSelected.add(transactionId);
        }
        onSelectionChange(newSelected);
    };
    const handleEdit = (transaction) => {
        setEditingId(transaction.id);
        setEditingData({
            description: transaction.description,
            merchant: transaction.merchant,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
            categoryId: transaction.categoryId,
            accountId: transaction.accountId
        });
    };
    const handleSaveEdit = async () => {
        if (!editingId)
            return;
        try {
            // In a real app, you'd make an API call here
            toast.success('Transaction updated successfully');
            setEditingId(null);
            setEditingData({});
        }
        catch (error) {
            toast.error('Failed to update transaction');
        }
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingData({});
    };
    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }, []);
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString();
    }, []);
    const getTypeColor = useCallback((type) => {
        switch (type) {
            case 'income':
                return 'text-green-600 bg-green-100';
            case 'expense':
                return 'text-red-600 bg-red-100';
            case 'transfer':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    }, []);
    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            let aValue, bValue;
            switch (sortField) {
                case 'date':
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    break;
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'description':
                    aValue = a.description.toLowerCase();
                    bValue = b.description.toLowerCase();
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                default:
                    return 0;
            }
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [transactions, sortField, sortDirection]);
    const SortButton = ({ field, children }) => (_jsxs("button", { onClick: () => handleSort(field), className: "flex items-center gap-1.5 text-left font-semibold text-gray-700 hover:text-gray-900 transition-colors touch-manipulation group w-full", children: [children, sortField === field && (_jsx("span", { className: "flex items-center ml-auto", children: sortDirection === 'asc' ? (_jsx(ChevronUp, { className: "h-4 w-4 text-primary-600" })) : (_jsx(ChevronDown, { className: "h-4 w-4 text-primary-600" })) })), sortField !== field && (_jsx("span", { className: "opacity-0 group-hover:opacity-30 transition-opacity ml-auto", children: _jsx(ChevronUp, { className: "h-3 w-3" }) }))] }));
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "block md:hidden", children: [_jsx("div", { className: "p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: selectedTransactions.size === transactions.length && transactions.length > 0, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer" }), _jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Select All" })] }), _jsxs("span", { className: "px-2.5 py-1 bg-white text-xs font-medium text-gray-600 rounded-full border border-gray-200", children: [sortedTransactions.length, " ", sortedTransactions.length === 1 ? 'transaction' : 'transactions'] })] }) }), _jsx("div", { className: "divide-y divide-gray-200", children: sortedTransactions.map((transaction) => (_jsxs("div", { className: `p-4 sm:p-5 transition-colors ${selectedTransactions.has(transaction.id)
                                ? 'bg-primary-50 border-l-4 border-primary-500'
                                : 'bg-white hover:bg-gray-50'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [_jsx("input", { type: "checkbox", checked: selectedTransactions.has(transaction.id), onChange: () => handleSelectTransaction(transaction.id), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 mt-0.5 flex-shrink-0 cursor-pointer" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "flex items-center gap-2 mb-1.5", children: _jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: transaction.description }) }), transaction.merchant && (_jsxs("p", { className: "text-xs text-gray-500 mb-2 flex items-center gap-1", children: [_jsx(Building, { className: "h-3 w-3" }), transaction.merchant] })), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsxs("span", { className: "text-xs text-gray-600 flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), formatDate(transaction.date)] }), _jsx("span", { className: "text-xs text-gray-400", children: "\u2022" }), _jsx("span", { className: "text-xs text-gray-600", children: transaction.accountName })] })] })] }), _jsxs("div", { className: "text-right flex-shrink-0 ml-2", children: [_jsx("p", { className: `text-base sm:text-lg font-bold mb-1.5 ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(transaction.amount) }), _jsx("span", { className: `inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${getTypeColor(transaction.type)}`, children: transaction.type })] })] }), transaction.categoryName && (_jsx("div", { className: "mt-2 mb-3", children: _jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", style: {
                                            backgroundColor: transaction.categoryColor + '20',
                                            color: transaction.categoryColor
                                        }, children: [_jsx(Tag, { className: "h-3 w-3 mr-1" }), transaction.categoryName] }) })), _jsxs("div", { className: "flex items-center gap-2 mt-3 pt-3 border-t border-gray-100", children: [_jsxs("button", { onClick: () => handleEdit(transaction), className: "flex-1 flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 py-2 px-2 rounded-lg transition-all touch-manipulation", children: [_jsx(Edit, { className: "h-3.5 w-3.5" }), "Edit"] }), _jsxs("button", { onClick: () => onDuplicate(transaction), className: "flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100 py-2 px-2 rounded-lg transition-all touch-manipulation", children: [_jsx(Copy, { className: "h-3.5 w-3.5" }), "Duplicate"] }), _jsxs("button", { onClick: () => onDelete(transaction.id), className: "flex-1 flex items-center justify-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 py-2 px-2 rounded-lg transition-all touch-manipulation", children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), "Delete"] })] })] }, transaction.id))) })] }), _jsx("div", { className: "hidden md:block overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0", children: _jsx("div", { className: "inline-block min-w-full align-middle", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", style: { minWidth: '900px' }, children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-3 text-left w-12", children: _jsx("label", { className: "cursor-pointer flex items-center justify-center", children: _jsx("input", { type: "checkbox", checked: selectedTransactions.size === transactions.length && transactions.length > 0, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer w-4 h-4" }) }) }), _jsx("th", { className: "px-4 py-3 text-left whitespace-nowrap w-[120px]", children: _jsxs(SortButton, { field: "date", children: [_jsx(Calendar, { className: "h-4 w-4 inline mr-1.5 text-gray-500" }), _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Date" })] }) }), _jsx("th", { className: "px-4 py-3 text-right whitespace-nowrap w-[140px]", children: _jsxs(SortButton, { field: "amount", children: [_jsx(DollarSign, { className: "h-4 w-4 inline mr-1.5 text-gray-500" }), _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Amount" })] }) }), _jsx("th", { className: "px-4 py-3 text-left w-[280px]", children: _jsx(SortButton, { field: "description", children: _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Description" }) }) }), _jsx("th", { className: "px-4 py-3 text-left w-[160px]", children: _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Category" }) }), _jsx("th", { className: "px-4 py-3 text-left whitespace-nowrap w-[120px]", children: _jsx(SortButton, { field: "type", children: _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Type" }) }) }), _jsx("th", { className: "px-4 py-3 text-left hidden lg:table-cell w-[180px]", children: _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Account" }) }), _jsx("th", { className: "px-4 py-3 text-center whitespace-nowrap w-[140px] sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100 z-20 shadow-[2px_0_4px_rgba(0,0,0,0.05)]", children: _jsx("span", { className: "font-semibold text-gray-700 text-sm", children: "Actions" }) })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: sortedTransactions.map((transaction) => (_jsxs("tr", { className: `transition-colors ${selectedTransactions.has(transaction.id)
                                        ? 'bg-primary-50 border-l-4 border-primary-500'
                                        : 'hover:bg-gray-50'} ${editingId === transaction.id ? 'relative' : ''}`, style: editingId === transaction.id ? { zIndex: 30, position: 'relative' } : {}, children: [_jsx("td", { className: "px-3 py-3 whitespace-nowrap align-middle", children: _jsx("label", { className: "cursor-pointer flex items-center justify-center", children: _jsx("input", { type: "checkbox", checked: selectedTransactions.has(transaction.id), onChange: () => handleSelectTransaction(transaction.id), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer w-4 h-4" }) }) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap align-middle", children: editingId === transaction.id ? (_jsx("div", { style: { position: 'relative', zIndex: 35, paddingRight: '8px' }, children: _jsx("input", { type: "date", value: editingData.date || '', onChange: (e) => setEditingData({ ...editingData, date: e.target.value }), className: "input text-sm w-full" }) })) : (_jsx("span", { className: "text-gray-700 text-sm", children: formatDate(transaction.date) })) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-right align-middle", children: editingId === transaction.id ? (_jsx("div", { style: { position: 'relative', zIndex: 35, paddingRight: '8px' }, children: _jsx("input", { type: "number", step: "0.01", value: editingData.amount || '', onChange: (e) => setEditingData({ ...editingData, amount: parseFloat(e.target.value) }), className: "input text-sm w-full text-right font-semibold" }) })) : (_jsx("div", { className: "flex items-center justify-end", children: _jsx("span", { className: `font-semibold text-base ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(transaction.amount) }) })) }), _jsx("td", { className: "px-4 py-3 align-middle", style: { maxWidth: '280px', overflow: 'hidden' }, children: editingId === transaction.id ? (_jsx("div", { style: {
                                                    position: 'relative',
                                                    zIndex: 35,
                                                    paddingRight: '8px',
                                                    maxWidth: '100%',
                                                    overflow: 'hidden'
                                                }, children: _jsx("input", { type: "text", value: editingData.description || '', onChange: (e) => setEditingData({ ...editingData, description: e.target.value }), className: "input text-sm", style: {
                                                        width: '100%',
                                                        maxWidth: '100%',
                                                        boxSizing: 'border-box'
                                                    } }) })) : (_jsx("div", { className: "font-medium text-gray-900 text-sm truncate pr-2", children: transaction.description })) }), _jsx("td", { className: "px-4 py-3 align-middle", children: editingId === transaction.id ? (_jsx("div", { style: { position: 'relative', zIndex: 35, paddingRight: '8px' }, children: _jsxs("select", { value: editingData.categoryId || '', onChange: (e) => setEditingData({ ...editingData, categoryId: e.target.value }), className: "input text-sm w-full", style: {
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        whiteSpace: 'nowrap'
                                                    }, children: [_jsx("option", { value: "", children: "Select category" }), categories.map(category => (_jsx("option", { value: category.id, children: category.name }, category.id)))] }) })) : (transaction.categoryName ? (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", style: {
                                                    backgroundColor: transaction.categoryColor + '20',
                                                    color: transaction.categoryColor
                                                }, children: transaction.categoryName })) : (_jsx("span", { className: "text-gray-400 text-xs italic", children: "Uncategorized" }))) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap align-middle", children: editingId === transaction.id ? (_jsx("div", { style: { position: 'relative', zIndex: 35, paddingRight: '8px' }, children: _jsxs("select", { value: editingData.type || '', onChange: (e) => setEditingData({ ...editingData, type: e.target.value }), className: "input text-sm w-full", style: {
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        whiteSpace: 'nowrap'
                                                    }, children: [_jsx("option", { value: "income", children: "Income" }), _jsx("option", { value: "expense", children: "Expense" }), _jsx("option", { value: "transfer", children: "Transfer" })] }) })) : (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(transaction.type)}`, children: transaction.type })) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600 hidden lg:table-cell align-middle", children: editingId === transaction.id ? (_jsx("div", { style: { position: 'relative', zIndex: 35, paddingRight: '8px' }, children: _jsx("select", { value: editingData.accountId || '', onChange: (e) => setEditingData({ ...editingData, accountId: e.target.value }), className: "input text-sm w-full", style: {
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        whiteSpace: 'nowrap'
                                                    }, children: accounts.map(account => (_jsx("option", { value: account.id, children: account.name }, account.id))) }) })) : (_jsx("span", { className: "text-gray-700 truncate block", children: transaction.accountName })) }), _jsxs("td", { className: `px-4 py-3 whitespace-nowrap text-center sticky right-0 align-middle ${selectedTransactions.has(transaction.id) ? 'bg-primary-50' : 'bg-white'} ${editingId === transaction.id ? 'z-25' : 'z-20'}`, style: {
                                                boxShadow: editingId === transaction.id
                                                    ? '2px 0 4px rgba(0,0,0,0.1)'
                                                    : '2px 0 4px rgba(0,0,0,0.05)',
                                                backgroundColor: editingId === transaction.id
                                                    ? (selectedTransactions.has(transaction.id) ? 'rgb(239, 246, 255)' : 'white')
                                                    : (selectedTransactions.has(transaction.id) ? 'rgb(239, 246, 255)' : 'white')
                                            }, children: [selectedTransactions.has(transaction.id) && (_jsx("div", { className: "absolute inset-y-0 left-0 w-1 bg-primary-500" })), editingId === transaction.id ? (_jsxs("div", { className: "flex items-center gap-2 justify-center", children: [_jsx(Tooltip, { text: "Save changes", children: _jsx("button", { onClick: handleSaveEdit, className: "text-green-600 hover:text-green-800 hover:bg-green-50 transition-all touch-manipulation p-2 rounded-md", "aria-label": "Save changes", children: _jsx(Check, { className: "h-4 w-4" }) }) }), _jsx(Tooltip, { text: "Cancel editing", children: _jsx("button", { onClick: handleCancelEdit, className: "text-red-600 hover:text-red-800 hover:bg-red-50 transition-all touch-manipulation p-2 rounded-md", "aria-label": "Cancel", children: _jsx(X, { className: "h-4 w-4" }) }) })] })) : (_jsxs("div", { className: "flex items-center gap-2 justify-center", children: [_jsx(Tooltip, { text: "Edit transaction", children: _jsx("button", { onClick: () => handleEdit(transaction), className: "text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all touch-manipulation p-2 rounded-md", "aria-label": "Edit transaction", children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsx(Tooltip, { text: "Duplicate transaction", children: _jsx("button", { onClick: () => onDuplicate(transaction), className: "text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all touch-manipulation p-2 rounded-md", "aria-label": "Duplicate transaction", children: _jsx(Copy, { className: "h-4 w-4" }) }) }), _jsx(Tooltip, { text: "Delete transaction", children: _jsx("button", { onClick: () => onDelete(transaction.id), className: "text-red-600 hover:text-red-800 hover:bg-red-50 transition-all touch-manipulation p-2 rounded-md", "aria-label": "Delete transaction", children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }))] })] }, transaction.id))) })] }) }) })] }));
}
