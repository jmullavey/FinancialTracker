import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { TransactionPreviewModal } from '../components/accounts/TransactionPreviewModal';
export function ReviewPage() {
    const { parseJobId } = useParams();
    const navigate = useNavigate();
    const [parseJob, setParseJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState(new Set());
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editedTransactions, setEditedTransactions] = useState([]);
    const [showAccountSelection, setShowAccountSelection] = useState(false);
    useEffect(() => {
        if (parseJobId) {
            loadParseJob();
        }
    }, [parseJobId]);
    const loadParseJob = async () => {
        try {
            // Fetch parse job with ALL transactions
            const response = await api.get(`/uploads/parse-jobs/${parseJobId}?all=true`);
            setParseJob(response.data.parseJob);
            // Use allTransactions if available, otherwise fall back to preview
            const transactionsToLoad = response.data.parseJob.allTransactions ||
                response.data.parseJob.previewData?.transactions || [];
            if (transactionsToLoad.length > 0) {
                setEditedTransactions(transactionsToLoad);
            }
        }
        catch (error) {
            toast.error('Failed to load parse job');
            console.error('Error loading parse job:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSelectTransaction = (index) => {
        const newSelected = new Set(selectedTransactions);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        }
        else {
            newSelected.add(index);
        }
        setSelectedTransactions(newSelected);
    };
    const handleSelectAll = () => {
        if (selectedTransactions.size === editedTransactions.length) {
            setSelectedTransactions(new Set());
        }
        else {
            setSelectedTransactions(new Set(editedTransactions.map((_, index) => index)));
        }
    };
    const handleEditTransaction = (index) => {
        setEditingTransaction(index);
    };
    const handleSaveTransaction = (index, updatedTransaction) => {
        const newTransactions = [...editedTransactions];
        newTransactions[index] = updatedTransaction;
        setEditedTransactions(newTransactions);
        setEditingTransaction(null);
    };
    const handleDeleteTransaction = (index) => {
        const newTransactions = editedTransactions.filter((_, i) => i !== index);
        setEditedTransactions(newTransactions);
        setSelectedTransactions(new Set());
    };
    const handleConfirmTransactions = () => {
        if (selectedTransactions.size === 0) {
            toast.error('Please select at least one transaction to import');
            return;
        }
        // Show account selection modal instead of directly confirming
        setShowAccountSelection(true);
    };
    const handleImportComplete = () => {
        // After successful import, navigate to transactions page
        navigate('/transactions');
    };
    // Map transactions for the preview modal
    const getTransactionsForImport = () => {
        return Array.from(selectedTransactions).map(index => {
            const tx = editedTransactions[index];
            // Map to format expected by TransactionPreviewModal
            return {
                date: tx.date,
                description: tx.description,
                withdrawal: tx.amount < 0 ? Math.abs(tx.amount) : undefined,
                deposit: tx.amount > 0 ? tx.amount : undefined,
                balance: undefined, // Balance not available from parser output currently
                amount: tx.amount,
                type: tx.type,
                merchant: tx.merchant,
                raw_lines: undefined // Can be added if parser provides it
            };
        });
    };
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const getTypeColor = (type) => {
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
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary-600" }) }));
    }
    if (!parseJob) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "mx-auto h-12 w-12 text-red-600" }), _jsx("h3", { className: "mt-4 text-lg font-medium text-gray-900", children: "Parse job not found" }), _jsx("p", { className: "mt-2 text-gray-600", children: "The requested parse job could not be found." }), _jsx("button", { onClick: () => navigate('/transactions'), className: "mt-4 btn btn-primary", children: "Go to Transactions" })] }));
    }
    if (parseJob.status === 'failed' || parseJob.status === 'error') {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "mx-auto h-12 w-12 text-red-600" }), _jsx("h3", { className: "mt-4 text-lg font-medium text-gray-900", children: "Processing failed" }), _jsx("p", { className: "mt-2 text-gray-600", children: parseJob.errorMessage || 'An error occurred while processing the file.' }), parseJob.previewData.errors.length > 0 && (_jsxs("div", { className: "mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto text-left", children: [_jsx("h4", { className: "text-sm font-medium text-yellow-800 mb-2", children: "Details:" }), _jsx("ul", { className: "text-sm text-yellow-700 list-disc list-inside", children: parseJob.previewData.errors.map((error, index) => (_jsx("li", { children: error }, index))) })] })), _jsx("button", { onClick: () => navigate('/transactions'), className: "mt-4 btn btn-primary", children: "Go to Transactions" })] }));
    }
    if (parseJob.status !== 'completed') {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx(Loader2, { className: "mx-auto h-12 w-12 animate-spin text-primary-600" }), _jsx("h3", { className: "mt-4 text-lg font-medium text-gray-900", children: "Processing file..." }), _jsxs("p", { className: "mt-2 text-gray-600", children: [parseJob.progress, "% complete (", parseJob.parsedTransactions, " of ", parseJob.totalTransactions, " transactions)"] })] }));
    }
    return (_jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: () => navigate('/transactions'), className: "flex items-center text-gray-600 hover:text-gray-900 mb-4", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Transactions"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Review Transactions" }), _jsxs("p", { className: "mt-2 text-gray-600", children: ["Review and edit the parsed transactions from ", parseJob.upload.originalName] })] }), parseJob.previewData.errors.length > 0 && (_jsxs("div", { className: "mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800 mb-2", children: "Parsing Warnings" }), _jsx("ul", { className: "text-sm text-yellow-700 list-disc list-inside", children: parseJob.previewData.errors.map((error, index) => (_jsx("li", { children: error }, index))) })] })), editedTransactions.length === 0 && parseJob.status === 'completed' && (_jsxs("div", { className: "mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-blue-800 mb-2", children: "No Transactions Found" }), _jsx("p", { className: "text-sm text-blue-700", children: "No transactions could be extracted from the file. This may occur if:" }), _jsxs("ul", { className: "text-sm text-blue-700 list-disc list-inside mt-2", children: [_jsx("li", { children: "The PDF is a scanned image (requires OCR)" }), _jsx("li", { children: "The file format is not supported" }), _jsx("li", { children: "The statement uses an unusual layout" })] }), _jsx("p", { className: "text-sm text-blue-700 mt-2", children: "Try uploading a CSV or Excel file, or ensure your PDF contains selectable text." })] })), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-medium text-gray-900", children: ["Transactions (", editedTransactions.length, ")"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [editedTransactions.length, " transaction", editedTransactions.length !== 1 ? 's' : '', " ready to review"] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: handleSelectAll, className: "text-sm text-primary-600 hover:text-primary-700", children: selectedTransactions.size === editedTransactions.length ? 'Deselect All' : 'Select All' }), _jsxs("button", { onClick: handleConfirmTransactions, disabled: selectedTransactions.size === 0 || confirming, className: "btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center", children: [confirming ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" })) : (_jsx(CheckCircle, { className: "h-4 w-4 mr-2" })), _jsxs("span", { children: ["Import ", selectedTransactions.size, " Transactions"] })] })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: _jsx("input", { type: "checkbox", checked: selectedTransactions.size === editedTransactions.length && editedTransactions.length > 0, onChange: handleSelectAll, className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Description" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Merchant" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: editedTransactions.map((transaction, index) => (_jsxs("tr", { className: selectedTransactions.has(index) ? 'bg-primary-50' : '', children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("input", { type: "checkbox", checked: selectedTransactions.has(index), onChange: () => handleSelectTransaction(index), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: new Date(transaction.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: transaction.description }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: transaction.merchant || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsx("span", { className: transaction.amount >= 0 ? 'text-green-600' : 'text-red-600', children: formatAmount(transaction.amount) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: clsx('inline-flex px-2 py-1 text-xs font-semibold rounded-full', getTypeColor(transaction.type)), children: transaction.type }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleEditTransaction(index), className: "text-primary-600 hover:text-primary-900", children: _jsx(Edit3, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDeleteTransaction(index), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, index))) })] }) }), editedTransactions.length === 0 && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No transactions found in this file." }) }))] }), showAccountSelection && (_jsx(TransactionPreviewModal, { isOpen: showAccountSelection, onClose: () => setShowAccountSelection(false), transactions: getTransactionsForImport(), onSuccess: handleImportComplete }))] }));
}
