import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Trash2, Edit, Download, Tag, Building, MoreHorizontal } from 'lucide-react';
export function BulkOperations({ selectedCount, onBulkDelete, onBulkEdit, onBulkExport, onBulkCategorize, onBulkChangeAccount, onClearSelection }) {
    const [showMenu, setShowMenu] = useState(false);
    if (selectedCount === 0)
        return null;
    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedCount} transactions?`)) {
            onBulkDelete();
        }
    };
    return (_jsxs("div", { className: "bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0", children: [_jsxs("div", { className: "bg-primary-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm", children: [selectedCount, " ", selectedCount === 1 ? 'selected' : 'selected'] }), _jsx("span", { className: "text-xs sm:text-sm text-primary-800 font-medium", children: "Choose an action to apply" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: onClearSelection, className: "text-xs sm:text-sm text-primary-600 hover:text-primary-800 transition-colors touch-manipulation px-2 py-1", children: "Clear" }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1.5 sm:p-2 text-primary-600 hover:text-primary-800 transition-colors touch-manipulation", "aria-label": "More options", children: _jsx(MoreHorizontal, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }), showMenu && (_jsx("div", { className: "absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10", children: _jsxs("div", { className: "py-1", children: [_jsxs("button", { onClick: () => {
                                                        onBulkEdit();
                                                        setShowMenu(false);
                                                    }, className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation", children: [_jsx(Edit, { className: "h-4 w-4" }), "Edit Selected"] }), _jsxs("button", { onClick: () => {
                                                        onBulkCategorize();
                                                        setShowMenu(false);
                                                    }, className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation", children: [_jsx(Tag, { className: "h-4 w-4" }), "Change Category"] }), _jsxs("button", { onClick: () => {
                                                        onBulkChangeAccount();
                                                        setShowMenu(false);
                                                    }, className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation", children: [_jsx(Building, { className: "h-4 w-4" }), "Change Account"] }), _jsxs("button", { onClick: () => {
                                                        onBulkExport();
                                                        setShowMenu(false);
                                                    }, className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation", children: [_jsx(Download, { className: "h-4 w-4" }), "Export Selected"] }), _jsx("hr", { className: "my-1" }), _jsxs("button", { onClick: () => {
                                                        handleBulkDelete();
                                                        setShowMenu(false);
                                                    }, className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors touch-manipulation", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete Selected"] })] }) }))] })] })] }), _jsxs("div", { className: "flex items-center gap-2 mt-3 flex-wrap", children: [_jsxs("button", { onClick: onBulkEdit, className: "btn btn-sm btn-secondary flex items-center justify-center text-xs sm:text-sm px-3 py-2 touch-manipulation hover:shadow-sm transition-all duration-200", children: [_jsx(Edit, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" }), _jsx("span", { children: "Edit" })] }), _jsxs("button", { onClick: onBulkExport, className: "btn btn-sm btn-secondary flex items-center justify-center text-xs sm:text-sm px-3 py-2 touch-manipulation hover:shadow-sm transition-all duration-200", children: [_jsx(Download, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" }), _jsx("span", { children: "Export" })] }), _jsxs("button", { onClick: handleBulkDelete, className: "btn btn-sm btn-danger flex items-center justify-center text-xs sm:text-sm px-3 py-2 touch-manipulation hover:shadow-sm transition-all duration-200", children: [_jsx(Trash2, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" }), _jsx("span", { children: "Delete" })] })] })] }));
}
