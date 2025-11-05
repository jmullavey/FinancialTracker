import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, DollarSign, Download, Upload as UploadIcon } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { listAccounts, archiveAccount, exportJSON, importJSON } from '../services/accountsStore';
import { AccountCard } from '../components/accounts/AccountCard';
import { AccountsTable } from '../components/accounts/AccountsTable';
import { AccountDetailPanel } from '../components/accounts/AccountDetailPanel';
import { AddAccountModal } from '../components/accounts/AddAccountModal';
import { MigrationHelper } from '../components/accounts/MigrationHelper';
export function AccountsPage() {
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    useEffect(() => {
        loadAccounts();
    }, []);
    const loadAccounts = () => {
        try {
            setLoading(true);
            const allAccounts = listAccounts();
            setAccounts(allAccounts);
            // If an account was selected, re-select it after reload
            if (selectedAccount) {
                const updated = allAccounts.find(a => a.id === selectedAccount.id);
                if (updated) {
                    setSelectedAccount(updated);
                }
                else {
                    setSelectedAccount(null);
                }
            }
        }
        catch (error) {
            console.error('Error loading accounts:', error);
            toast.error('Failed to load accounts');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAccountCreated = (account) => {
        loadAccounts();
        setSelectedAccount(account);
        toast.success('Account created successfully!');
    };
    const handleEditAccount = (account) => {
        setEditingAccount(account);
        setShowAccountForm(true);
    };
    const handleArchiveAccount = (accountId) => {
        if (archiveAccount(accountId)) {
            toast.success('Account archived successfully');
            loadAccounts();
            if (selectedAccount?.id === accountId) {
                setSelectedAccount(null);
            }
        }
        else {
            toast.error('Failed to archive account');
        }
    };
    const handleExport = () => {
        try {
            const json = exportJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-app-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Data exported successfully');
        }
        catch (error) {
            toast.error('Failed to export data');
            console.error('Export error:', error);
        }
    };
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = event.target?.result;
                    // Ask user if they want to replace or merge
                    const shouldReplace = window.confirm('Import Options:\n\n' +
                        'OK = Replace all data (WARNING: This will overwrite existing data)\n' +
                        'Cancel = Merge with existing data\n\n' +
                        'Do you want to REPLACE all data?');
                    console.warn(shouldReplace ? 'Replacing all data' : 'Merging data');
                    const result = importJSON(json, { replace: shouldReplace });
                    if (result.success) {
                        toast.success(`Import successful: ${result.accounts} accounts, ${result.transactions} transactions`);
                        loadAccounts();
                    }
                    else {
                        toast.error(`Import failed: ${result.errors.join(', ')}`);
                    }
                }
                catch (error) {
                    toast.error('Failed to parse JSON file');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Accounts" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Manage your financial accounts" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: handleExport, className: "btn btn-secondary flex items-center", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Export" })] }), _jsxs("button", { onClick: handleImport, className: "btn btn-secondary flex items-center", children: [_jsx(UploadIcon, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Import" })] }), _jsxs("button", { onClick: () => {
                                    setEditingAccount(null);
                                    setShowAccountForm(true);
                                }, className: "btn btn-primary flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Add Account" })] })] })] }), accounts.length > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: accounts.map((account) => (_jsx(AccountCard, { account: account, isSelected: selectedAccount?.id === account.id, onClick: () => setSelectedAccount(account) }, account.id))) })), _jsx(MigrationHelper, { onComplete: loadAccounts }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "All Accounts" }), _jsx(AccountsTable, { accounts: accounts, onSelectAccount: setSelectedAccount, onEditAccount: handleEditAccount, onArchiveAccount: handleArchiveAccount })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(AccountDetailPanel, { account: selectedAccount, onEdit: handleEditAccount, onUpload: () => { } }) })] }), accounts.length === 0 && (_jsx("div", { className: "card", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-400 mb-4", children: _jsx(DollarSign, { className: "h-12 w-12 mx-auto" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No accounts yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Add your first account to start tracking" }), _jsxs("button", { onClick: () => {
                                setEditingAccount(null);
                                setShowAccountForm(true);
                            }, className: "btn btn-primary flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Add Account" })] })] }) })), showAccountForm && (_jsx(AddAccountModal, { isOpen: showAccountForm, editingAccount: editingAccount, onClose: () => {
                    setShowAccountForm(false);
                    setEditingAccount(null);
                }, onSuccess: (account) => {
                    handleAccountCreated(account);
                    setShowAccountForm(false);
                    setEditingAccount(null);
                } }))] }));
}
