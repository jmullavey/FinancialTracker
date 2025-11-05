import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import toast from 'react-hot-toast';
export function ExportTransactions({ transactions, selectedTransactions, onClose }) {
    const [exportFormat, setExportFormat] = useState('csv');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });
    const [includeHeaders, setIncludeHeaders] = useState(true);
    const getTransactionsToExport = () => {
        let transactionsToExport = transactions;
        // Filter by selected transactions if provided
        if (selectedTransactions && selectedTransactions.size > 0) {
            transactionsToExport = transactions.filter(t => selectedTransactions.has(t.id));
        }
        // Filter by date range if specified
        if (dateRange.start || dateRange.end) {
            transactionsToExport = transactionsToExport.filter(t => {
                const transactionDate = new Date(t.date);
                const startDate = dateRange.start ? new Date(dateRange.start) : null;
                const endDate = dateRange.end ? new Date(dateRange.end) : null;
                if (startDate && transactionDate < startDate)
                    return false;
                if (endDate && transactionDate > endDate)
                    return false;
                return true;
            });
        }
        return transactionsToExport;
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const exportToCSV = () => {
        const transactionsToExport = getTransactionsToExport();
        if (transactionsToExport.length === 0) {
            toast.error('No transactions to export');
            return;
        }
        const headers = [
            'Date',
            'Description',
            'Merchant',
            'Account',
            'Category',
            'Type',
            'Amount',
            'Status',
            'Created At'
        ];
        const csvContent = [
            includeHeaders ? headers.join(',') : '',
            ...transactionsToExport.map(t => [
                t.date,
                `"${t.description}"`,
                `"${t.merchant || ''}"`,
                `"${t.accountName}"`,
                `"${t.categoryName || 'Uncategorized'}"`,
                t.type,
                t.amount,
                t.status,
                t.createdAt
            ].join(','))
        ].filter(row => row).join('\n');
        downloadFile(csvContent, 'transactions.csv', 'text/csv');
    };
    const exportToJSON = () => {
        const transactionsToExport = getTransactionsToExport();
        if (transactionsToExport.length === 0) {
            toast.error('No transactions to export');
            return;
        }
        const jsonContent = JSON.stringify(transactionsToExport, null, 2);
        downloadFile(jsonContent, 'transactions.json', 'application/json');
    };
    const exportToXLSX = () => {
        // For XLSX export, we'd need a library like xlsx
        // For now, we'll show a message that this feature requires additional setup
        toast.error('XLSX export requires additional setup. Please use CSV or JSON export.');
    };
    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${getTransactionsToExport().length} transactions`);
        onClose();
    };
    const handleExport = () => {
        switch (exportFormat) {
            case 'csv':
                exportToCSV();
                break;
            case 'json':
                exportToJSON();
                break;
            case 'xlsx':
                exportToXLSX();
                break;
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Download, { className: "h-5 w-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Export Transactions" })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Export Format" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("button", { onClick: () => setExportFormat('csv'), className: `p-4 border rounded-lg text-center transition-colors ${exportFormat === 'csv'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'}`, children: [_jsx(FileText, { className: "h-6 w-6 mx-auto mb-2" }), _jsx("div", { className: "text-sm font-medium", children: "CSV" }), _jsx("div", { className: "text-xs text-gray-500", children: "Spreadsheet" })] }), _jsxs("button", { onClick: () => setExportFormat('json'), className: `p-4 border rounded-lg text-center transition-colors ${exportFormat === 'json'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'}`, children: [_jsx(File, { className: "h-6 w-6 mx-auto mb-2" }), _jsx("div", { className: "text-sm font-medium", children: "JSON" }), _jsx("div", { className: "text-xs text-gray-500", children: "Data format" })] }), _jsxs("button", { onClick: () => setExportFormat('xlsx'), className: `p-4 border rounded-lg text-center transition-colors ${exportFormat === 'xlsx'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'}`, children: [_jsx(FileSpreadsheet, { className: "h-6 w-6 mx-auto mb-2" }), _jsx("div", { className: "text-sm font-medium", children: "Excel" }), _jsx("div", { className: "text-xs text-gray-500", children: "Advanced" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date Range (Optional)" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Start Date" }), _jsx("input", { type: "date", value: dateRange.start, onChange: (e) => setDateRange({ ...dateRange, start: e.target.value }), className: "input text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "End Date" }), _jsx("input", { type: "date", value: dateRange.end, onChange: (e) => setDateRange({ ...dateRange, end: e.target.value }), className: "input text-sm" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Export Options" }), _jsx("div", { className: "space-y-2", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: includeHeaders, onChange: (e) => setIncludeHeaders(e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Include column headers" })] }) })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("div", { className: "text-sm text-gray-600", children: _jsx("strong", { children: "Export Summary:" }) }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: ["\u2022 Format: ", exportFormat.toUpperCase()] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["\u2022 Transactions: ", getTransactionsToExport().length] }), dateRange.start || dateRange.end ? (_jsxs("div", { className: "text-sm text-gray-600", children: ["\u2022 Date range: ", dateRange.start || 'All', " to ", dateRange.end || 'All'] })) : null] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: handleExport, className: "btn btn-primary flex-1 flex items-center", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), _jsxs("span", { children: ["Export ", getTransactionsToExport().length, " Transactions"] })] }), _jsx("button", { onClick: onClose, className: "btn btn-secondary", children: "Cancel" })] })] })] }));
}
