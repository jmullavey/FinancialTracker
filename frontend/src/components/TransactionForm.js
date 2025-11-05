import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, Building, FileText } from 'lucide-react';
import { appendTransactions } from '../services/accountsStore';
import toast from 'react-hot-toast';
export function TransactionForm({ isOpen, onClose, onSuccess, initialData }) {
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        categoryId: '',
        amount: '',
        description: '',
        merchant: '',
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        type: 'expense'
    });
    useEffect(() => {
        if (isOpen) {
            loadAccountsAndCategories();
            if (initialData) {
                setFormData(prev => ({
                    ...prev,
                    amount: initialData.amount?.toString() || '',
                    description: initialData.description || '',
                    type: initialData.type || 'expense',
                    date: initialData.date || new Date().toISOString().split('T')[0]
                }));
            }
        }
    }, [isOpen, initialData]);
    // Reload categories when transaction type changes
    useEffect(() => {
        if (isOpen) {
            const loadCategoriesForType = async () => {
                try {
                    const { listCategories } = await import('../services/accountsStore');
                    const storeCategories = listCategories();
                    const filteredCategories = storeCategories.filter(cat => {
                        if (formData.type === 'income')
                            return cat.type === 'income';
                        if (formData.type === 'expense')
                            return cat.type === 'expense';
                        return cat.type === 'transfer';
                    });
                    setCategories(filteredCategories.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        color: cat.color
                    })));
                    // Clear category selection if it doesn't match the new type
                    if (formData.categoryId) {
                        const currentCategory = storeCategories.find(c => c.id === formData.categoryId);
                        if (currentCategory && currentCategory.type !== formData.type) {
                            setFormData(prev => ({ ...prev, categoryId: '' }));
                        }
                    }
                }
                catch (error) {
                    console.error('Error loading categories:', error);
                }
            };
            loadCategoriesForType();
        }
    }, [formData.type, isOpen]);
    const loadAccountsAndCategories = async () => {
        try {
            // Load accounts from localStorage store
            const { listAccounts, listCategories, ensureDefaultCategories } = await import('../services/accountsStore');
            ensureDefaultCategories(); // Ensure defaults exist
            const storeAccounts = listAccounts();
            setAccounts(storeAccounts.map(a => ({
                id: a.id,
                name: a.name,
                type: a.account_type
            })));
            // Load categories from localStorage store
            const storeCategories = listCategories();
            // Filter categories by transaction type
            const filteredCategories = storeCategories.filter(cat => {
                if (formData.type === 'income')
                    return cat.type === 'income';
                if (formData.type === 'expense')
                    return cat.type === 'expense';
                return cat.type === 'transfer';
            });
            setCategories(filteredCategories.map(cat => ({
                id: cat.id,
                name: cat.name,
                color: cat.color
            })));
            // Set default account if available
            if (storeAccounts.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: storeAccounts[0].id }));
            }
        }
        catch (error) {
            console.error('Error loading accounts and categories:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.accountId) {
            toast.error('Please select an account');
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) === 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter a description');
            return;
        }
        setLoading(true);
        try {
            const amount = parseFloat(formData.amount);
            const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
            // Save to localStorage store
            const result = appendTransactions([{
                    account_id: formData.accountId,
                    date: formData.date,
                    description: formData.description.trim(),
                    withdrawal: formData.type === 'expense' ? Math.abs(amount) : undefined,
                    deposit: formData.type === 'income' ? amount : undefined,
                    amount: finalAmount,
                    type: formData.type,
                    merchant: formData.merchant.trim() || undefined,
                    category_id: formData.categoryId || undefined,
                    import_source: 'manual'
                }]);
            if (result.errors.length > 0) {
                console.warn('Transaction import warnings:', result.errors);
            }
            toast.success('Transaction added successfully!');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                accountId: '',
                categoryId: '',
                amount: '',
                description: '',
                merchant: '',
                date: new Date().toISOString().split('T')[0],
                type: 'expense'
            });
        }
        catch (error) {
            toast.error('Failed to add transaction');
            console.error('Error adding transaction:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const quickAmounts = [10, 25, 50, 100, 200, 500];
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Add Transaction" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Transaction Type" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['expense', 'income', 'transfer'].map((type) => (_jsx("button", { type: "button", onClick: () => handleInputChange('type', type), className: `px-3 py-2 text-sm font-medium rounded-md border transition-colors ${formData.type === type
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: type.charAt(0).toUpperCase() + type.slice(1) }, type))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Amount ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(DollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => handleInputChange('amount', e.target.value), placeholder: "0.00", className: "input pl-10", required: true })] }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: quickAmounts.map((amount) => (_jsxs("button", { type: "button", onClick: () => handleInputChange('amount', amount.toString()), className: "px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors", children: ["$", amount] }, amount))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Description ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(FileText, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "What was this transaction for?", className: "input pl-10", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Merchant/Store" }), _jsxs("div", { className: "relative", children: [_jsx(Building, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: formData.merchant, onChange: (e) => handleInputChange('merchant', e.target.value), placeholder: "e.g., Starbucks, Amazon, etc.", className: "input pl-10" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Account ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: formData.accountId, onChange: (e) => handleInputChange('accountId', e.target.value), className: "input", required: true, children: [_jsx("option", { value: "", children: "Select an account" }), accounts.map((account) => (_jsxs("option", { value: account.id, children: [account.name, " (", account.type, ")"] }, account.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsxs("div", { className: "relative", children: [_jsx(Tag, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsxs("select", { value: formData.categoryId, onChange: (e) => handleInputChange('categoryId', e.target.value), className: "input pl-10", children: [_jsx("option", { value: "", children: "Select a category" }), categories.map((category) => (_jsx("option", { value: category.id, children: category.name }, category.id)))] })] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Showing ", formData.type, " categories. Create more on the Categories page."] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => handleInputChange('date', e.target.value), className: "input pl-10", required: true })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 btn btn-secondary", disabled: loading, children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 btn btn-primary", disabled: loading, children: loading ? 'Adding...' : 'Add Transaction' })] })] })] }) }));
}
