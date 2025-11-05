import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { listTransactions, listAccounts } from '../../services/accountsStore';
import toast from 'react-hot-toast';
export function MigrationHelper({ onComplete }) {
    const [showHelper, setShowHelper] = useState(false);
    const [orphanTransactions, setOrphanTransactions] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    useEffect(() => {
        // Check for transactions without account_id or with invalid account_id
        const allTransactions = listTransactions();
        const accounts = listAccounts();
        const accountIds = new Set(accounts.map(a => a.id));
        const orphans = allTransactions.filter(tx => !tx.account_id || !accountIds.has(tx.account_id));
        if (orphans.length > 0) {
            setOrphanTransactions(orphans);
            setShowHelper(true);
        }
    }, []);
    const handleMigrate = () => {
        if (!selectedAccountId) {
            toast.error('Please select an account');
            return;
        }
        try {
            const { loadStore, saveStore } = require('../../services/accountsStore');
            const store = loadStore();
            // Update orphan transactions with selected account
            store.transactions = store.transactions.map(tx => {
                if (!tx.account_id || !listAccounts().find(a => a.id === tx.account_id)) {
                    return { ...tx, account_id: selectedAccountId };
                }
                return tx;
            });
            saveStore(store);
            toast.success(`Migrated ${orphanTransactions.length} transactions to selected account`);
            setShowHelper(false);
            onComplete();
        }
        catch (error) {
            toast.error('Failed to migrate transactions');
            console.error('Migration error:', error);
        }
    };
    if (!showHelper || orphanTransactions.length === 0) {
        return null;
    }
    const accounts = listAccounts();
    return (_jsx("div", { className: "card bg-yellow-50 border-yellow-200", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "Migration Helper" }), _jsx("button", { onClick: () => setShowHelper(false), className: "text-yellow-600 hover:text-yellow-800", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("p", { className: "text-sm text-yellow-700 mb-3", children: ["Found ", orphanTransactions.length, " transaction(s) without a valid account. Select an account to assign them to:"] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("select", { value: selectedAccountId, onChange: (e) => setSelectedAccountId(e.target.value), className: "flex-1 input", children: [_jsx("option", { value: "", children: "-- Select Account --" }), accounts.map(account => (_jsxs("option", { value: account.id, children: [account.name, " (", account.account_type, ")"] }, account.id)))] }), _jsx("button", { onClick: handleMigrate, disabled: !selectedAccountId, className: "btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed", children: "Migrate" })] })] })] }) }));
}
