import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Calendar, DollarSign, Tag, Bell, Repeat, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
export function ReminderForm({ onSuccess, onCancel, reminder }) {
    const [formData, setFormData] = useState({
        title: reminder?.title || '',
        amount: reminder?.amount || '',
        dueDate: reminder?.dueDate || '',
        category: reminder?.category || 'bills',
        priority: reminder?.priority || 'medium',
        isRecurring: reminder?.isRecurring || false,
        recurringPattern: reminder?.recurringPattern || 'monthly',
        notes: reminder?.notes || ''
    });
    const [loading, setLoading] = useState(false);
    const categories = [
        { value: 'bills', label: 'Bills', icon: '🏠' },
        { value: 'subscriptions', label: 'Subscriptions', icon: '📱' },
        { value: 'savings', label: 'Savings Goals', icon: '💰' },
        { value: 'investments', label: 'Investments', icon: '📈' },
        { value: 'insurance', label: 'Insurance', icon: '🛡️' },
        { value: 'utilities', label: 'Utilities', icon: '⚡' },
        { value: 'other', label: 'Other', icon: '📝' }
    ];
    const recurringPatterns = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' }
    ];
    const priorities = [
        { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
        { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' }
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Please enter a reminder title');
            return;
        }
        if (!formData.dueDate) {
            toast.error('Please select a due date');
            return;
        }
        setLoading(true);
        try {
            const reminderData = {
                title: formData.title.trim(),
                description: formData.notes || undefined,
                amount: formData.amount ? parseFloat(formData.amount.toString()) : undefined,
                dueDate: new Date(formData.dueDate).toISOString(),
                isRecurring: formData.isRecurring,
                recurringFrequency: formData.isRecurring ? formData.recurringPattern : undefined
            };
            if (reminder) {
                // Update existing reminder
                await api.put(`/reminders/${reminder.id}`, reminderData);
                toast.success('Reminder updated successfully');
            }
            else {
                // Create new reminder
                await api.post('/reminders', reminderData);
                toast.success('Reminder created successfully');
            }
            onSuccess();
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save reminder');
            console.error('Error saving reminder:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
                return _jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" });
            case 'medium':
                return _jsx(Bell, { className: "h-4 w-4 text-yellow-600" });
            case 'low':
                return _jsx(Bell, { className: "h-4 w-4 text-green-600" });
            default:
                return _jsx(Bell, { className: "h-4 w-4 text-gray-600" });
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reminder Title *" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "input", placeholder: "e.g., Rent Payment, Netflix Subscription", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(DollarSign, { className: "h-4 w-4 inline mr-1" }), "Amount (Optional)"] }), _jsx("input", { type: "number", step: "0.01", value: formData.amount, onChange: (e) => setFormData({ ...formData, amount: e.target.value }), className: "input", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Calendar, { className: "h-4 w-4 inline mr-1" }), "Due Date *"] }), _jsx("input", { type: "date", value: formData.dueDate, onChange: (e) => setFormData({ ...formData, dueDate: e.target.value }), className: "input", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Tag, { className: "h-4 w-4 inline mr-1" }), "Category"] }), _jsx("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "input", children: categories.map(category => (_jsxs("option", { value: category.value, children: [category.icon, " ", category.label] }, category.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Priority" }), _jsx("select", { value: formData.priority, onChange: (e) => setFormData({ ...formData, priority: e.target.value }), className: "input", children: priorities.map(priority => (_jsx("option", { value: priority.value, children: priority.label }, priority.value))) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "isRecurring", checked: formData.isRecurring, onChange: (e) => setFormData({ ...formData, isRecurring: e.target.checked }), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsxs("label", { htmlFor: "isRecurring", className: "ml-2 text-sm font-medium text-gray-700", children: [_jsx(Repeat, { className: "h-4 w-4 inline mr-1" }), "Recurring Reminder"] })] }), formData.isRecurring && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Recurring Pattern" }), _jsx("select", { value: formData.recurringPattern, onChange: (e) => setFormData({ ...formData, recurringPattern: e.target.value }), className: "input", children: recurringPatterns.map(pattern => (_jsx("option", { value: pattern.value, children: pattern.label }, pattern.value))) })] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes (Optional)" }), _jsx("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), className: "input", rows: 3, placeholder: "Additional notes about this reminder..." })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Preview" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getPriorityIcon(formData.priority), _jsx("span", { className: "font-medium text-gray-900", children: formData.title })] }), formData.amount && (_jsxs("span", { className: "text-sm text-gray-600", children: ["$", parseFloat(formData.amount.toString()).toFixed(2)] }))] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Due: ", formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'] }), formData.isRecurring && (_jsxs("div", { className: "text-xs text-blue-600", children: ["Repeats ", formData.recurringPattern] }))] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsx("button", { type: "button", onClick: onCancel, className: "btn btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading, className: "btn btn-primary", children: loading ? 'Saving...' : (reminder ? 'Update Reminder' : 'Create Reminder') })] })] }));
}
