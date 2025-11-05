import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Building, CreditCard, DollarSign } from 'lucide-react';
import { createAccount, updateAccount } from '../../services/accountsStore';
export function AddAccountModal({ isOpen, onClose, onSuccess, editingAccount }) {
    const [formData, setFormData] = useState({
        name: '',
        institution_name: '',
        account_type: 'checking',
        masked_number: '',
        opening_balance: ''
    });
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (editingAccount && isOpen) {
            setFormData({
                name: editingAccount.name,
                institution_name: editingAccount.institution_name || '',
                account_type: editingAccount.account_type,
                masked_number: editingAccount.masked_number || '',
                opening_balance: editingAccount.opening_balance?.toString() || ''
            });
        }
        else if (isOpen) {
            setFormData({
                name: '',
                institution_name: '',
                account_type: 'checking',
                masked_number: '',
                opening_balance: ''
            });
        }
    }, [editingAccount, isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            return;
        }
        setSubmitting(true);
        try {
            let account;
            if (editingAccount) {
                // Update existing account
                const updated = updateAccount(editingAccount.id, {
                    name: formData.name.trim(),
                    institution_name: formData.institution_name.trim() || undefined,
                    account_type: formData.account_type,
                    masked_number: formData.masked_number.trim() || undefined
                });
                if (!updated) {
                    throw new Error('Failed to update account');
                }
                account = updated;
            }
            else {
                // Create new account
                account = createAccount({
                    name: formData.name.trim(),
                    institution_name: formData.institution_name.trim() || undefined,
                    account_type: formData.account_type,
                    masked_number: formData.masked_number.trim() || undefined,
                    opening_balance: formData.opening_balance ? parseFloat(formData.opening_balance) : undefined
                });
            }
            onSuccess(account);
            setFormData({
                name: '',
                institution_name: '',
                account_type: 'checking',
                masked_number: '',
                opening_balance: ''
            });
            onClose();
        }
        catch (error) {
            console.error('Error saving account:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: editingAccount ? 'Edit Account' : 'Add Account' }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Account Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Building, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), placeholder: "e.g., Main Checking, Savings Account", className: "input pl-10", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Institution Name" }), _jsx("input", { type: "text", value: formData.institution_name, onChange: (e) => setFormData(prev => ({ ...prev, institution_name: e.target.value })), placeholder: "e.g., Chase, Bank of America", className: "input" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Account Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: formData.account_type, onChange: (e) => setFormData(prev => ({ ...prev, account_type: e.target.value })), className: "input", required: true, children: [_jsx("option", { value: "checking", children: "Checking" }), _jsx("option", { value: "savings", children: "Savings" }), _jsx("option", { value: "credit", children: "Credit Card" }), _jsx("option", { value: "investment", children: "Investment" }), _jsx("option", { value: "loan", children: "Loan" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Account Number (Last 4 digits)" }), _jsxs("div", { className: "relative", children: [_jsx(CreditCard, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: formData.masked_number, onChange: (e) => setFormData(prev => ({ ...prev, masked_number: e.target.value.replace(/\D/g, '').slice(-4) })), placeholder: "1234", maxLength: 4, className: "input pl-10" })] })] }), !editingAccount && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Opening Balance" }), _jsxs("div", { className: "relative", children: [_jsx(DollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "number", step: "0.01", value: formData.opening_balance, onChange: (e) => setFormData(prev => ({ ...prev, opening_balance: e.target.value })), placeholder: "0.00", className: "input pl-10" })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave empty to start at $0.00" })] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 btn btn-secondary", disabled: submitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 btn btn-primary", disabled: submitting, children: submitting
                                        ? (editingAccount ? 'Updating...' : 'Adding...')
                                        : (editingAccount ? 'Update Account' : 'Add Account') })] })] })] }) }));
}
