import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, CheckCircle, Upload } from 'lucide-react';
import { appendTransactions, listAccounts, getLastSelectedAccountId, setLastSelectedAccountId } from '../../services/accountsStore';
import { AddAccountModal } from './AddAccountModal';
import toast from 'react-hot-toast';
export function TransactionPreviewModal({ isOpen, onClose, transactions, onSuccess }) {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [updateBalance, setUpdateBalance] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (isOpen) {
            loadAccounts();
        }
    }, [isOpen]);
    const loadAccounts = () => {
        const allAccounts = listAccounts();
        setAccounts(allAccounts);
        // Set default to last selected account
        const lastSelected = getLastSelectedAccountId();
        if (lastSelected && allAccounts.find(a => a.id === lastSelected)) {
            setSelectedAccountId(lastSelected);
        }
        else if (allAccounts.length > 0) {
            setSelectedAccountId(allAccounts[0].id);
        }
    };
    const handleAccountCreated = (account) => {
        setAccounts(listAccounts());
        setSelectedAccountId(account.id);
        setShowAddAccount(false);
    };
    const handleConfirm = async () => {
        if (!selectedAccountId) {
            toast.error('Please select an account');
            return;
        }
        if (transactions.length === 0) {
            toast.error('No transactions to import');
            return;
        }
        setSubmitting(true);
        try {
            // Map parsed transactions to store format
            const mappedTransactions = transactions.map(tx => ({
                account_id: selectedAccountId,
                date: tx.date,
                description: tx.description,
                withdrawal: tx.withdrawal,
                deposit: tx.deposit,
                balance: tx.balance,
                amount: tx.amount,
                type: tx.type,
                merchant: tx.merchant,
                import_source: 'upload',
                raw_lines: tx.raw_lines
            }));
            const result = appendTransactions(mappedTransactions, {
                updateAccountBalance: updateBalance,
                deduplicate: true
            });
            // Remember selected account
            setLastSelectedAccountId(selectedAccountId);
            if (result.duplicates > 0) {
                toast.success(`Imported ${result.added} transactions. ${result.duplicates} duplicates skipped.`, { duration: 5000 });
            }
            else {
                toast.success(`Successfully imported ${result.added} transactions`);
            }
            if (result.errors.length > 0) {
                console.warn('Import errors:', result.errors);
            }
            onSuccess();
            onClose();
        }
        catch (error) {
            toast.error('Failed to import transactions');
            console.error('Error importing transactions:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    if (!isOpen)
        return null;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Import Transactions" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [transactions.length, " transactions ready to import"] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Select Account ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("select", { value: selectedAccountId, onChange: (e) => setSelectedAccountId(e.target.value), className: "flex-1 input", required: true, children: [_jsx("option", { value: "", children: "-- Select Account --" }), accounts.map(account => (_jsxs("option", { value: account.id, children: [account.name, " (", account.account_type, ") - ", formatCurrency(account.current_balance)] }, account.id)))] }), _jsxs("button", { onClick: () => setShowAddAccount(true), className: "btn btn-secondary whitespace-nowrap", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "New Account"] })] })] }), transactions.some(t => t.balance !== undefined && t.balance !== null) && (_jsx("div", { className: "mb-6", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: updateBalance, onChange: (e) => setUpdateBalance(e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Update account balance from statement (use last transaction balance)" })] }) })), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-3", children: "Transactions Preview" }), _jsxs("div", { className: "overflow-x-auto border border-gray-200 rounded-lg", children: [_jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Description" }), _jsx("th", { className: "px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase", children: "Amount" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase", children: "Type" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: transactions.slice(0, 10).map((tx, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 text-sm text-gray-900", children: new Date(tx.date).toLocaleDateString() }), _jsx("td", { className: "px-4 py-2 text-sm text-gray-900", children: tx.description }), _jsx("td", { className: "px-4 py-2 text-sm text-right font-medium", children: _jsx("span", { className: tx.amount >= 0 ? 'text-green-600' : 'text-red-600', children: formatCurrency(tx.amount) }) }), _jsx("td", { className: "px-4 py-2 text-sm text-gray-900 capitalize", children: tx.type })] }, index))) })] }), transactions.length > 10 && (_jsxs("div", { className: "px-4 py-2 bg-gray-50 text-sm text-gray-600 text-center", children: ["... and ", transactions.length - 10, " more transactions"] }))] })] })] }), _jsxs("div", { className: "flex items-center justify-between p-6 border-t bg-gray-50", children: [_jsx("button", { onClick: onClose, className: "btn btn-secondary", disabled: submitting, children: "Cancel" }), _jsx("button", { onClick: handleConfirm, disabled: !selectedAccountId || submitting, className: "btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" }), "Importing..."] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Import ", transactions.length, " Transactions"] })) })] })] }) }), showAddAccount && (_jsx(AddAccountModal, { isOpen: showAddAccount, onClose: () => setShowAddAccount(false), onSuccess: handleAccountCreated }))] }));
}
