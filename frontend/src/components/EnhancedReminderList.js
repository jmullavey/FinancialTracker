import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Bell, Calendar, DollarSign, Edit3, Trash2, CheckCircle, Clock, Repeat, Search } from 'lucide-react';
export function EnhancedReminderList({ reminders, onEdit, onDelete, onMarkAsPaid, onSnooze }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortDirection, setSortDirection] = useState('asc');
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };
    const getStatusForReminder = (reminder) => {
        if (reminder.isCompleted || reminder.status === 'paid')
            return 'paid';
        const daysUntilDue = getDaysUntilDue(reminder.dueDate);
        if (daysUntilDue < 0)
            return 'overdue';
        return 'upcoming';
    };
    const getStatusColor = (reminder) => {
        const status = getStatusForReminder(reminder);
        const daysUntilDue = getDaysUntilDue(reminder.dueDate);
        if (status === 'paid')
            return 'text-green-600 bg-green-100';
        if (status === 'overdue' || daysUntilDue < 0)
            return 'text-red-600 bg-red-100';
        if (daysUntilDue <= 3)
            return 'text-orange-600 bg-orange-100';
        return 'text-blue-600 bg-blue-100';
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'bills':
                return '🏠';
            case 'subscriptions':
                return '📱';
            case 'savings':
                return '💰';
            case 'investments':
                return '📈';
            case 'insurance':
                return '🛡️';
            case 'utilities':
                return '⚡';
            default:
                return '📝';
        }
    };
    const filteredAndSortedReminders = reminders
        .filter(reminder => {
        const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reminder.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const reminderStatus = getStatusForReminder(reminder);
        const matchesStatus = filterStatus === 'all' || reminderStatus === filterStatus;
        const matchesPriority = filterPriority === 'all' || reminder.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    })
        .sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
            case 'dueDate':
                aValue = new Date(a.dueDate).getTime();
                bValue = new Date(b.dueDate).getTime();
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
                break;
            case 'amount':
                aValue = a.amount || 0;
                bValue = b.amount || 0;
                break;
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            default:
                return 0;
        }
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };
    return (_jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search reminders...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "input pl-10 text-sm sm:text-base" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "input text-sm sm:text-base", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "upcoming", children: "Upcoming" }), _jsx("option", { value: "overdue", children: "Overdue" }), _jsx("option", { value: "paid", children: "Paid" })] }), _jsxs("select", { value: filterPriority, onChange: (e) => setFilterPriority(e.target.value), className: "input text-sm sm:text-base", children: [_jsx("option", { value: "all", children: "All Priorities" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] }) }), _jsx("div", { className: "space-y-2 sm:space-y-3", children: filteredAndSortedReminders.map((reminder) => {
                    const daysUntilDue = getDaysUntilDue(reminder.dueDate);
                    const isOverdue = daysUntilDue < 0 && !reminder.isCompleted && reminder.status !== 'paid';
                    return (_jsxs("div", { className: `bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`, children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [_jsxs("div", { className: "flex items-start sm:items-center gap-3 flex-1 min-w-0", children: [_jsx("div", { className: "text-xl sm:text-2xl flex-shrink-0", children: getCategoryIcon(reminder.category) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mb-1 sm:mb-1", children: [_jsx("h4", { className: "font-medium text-gray-900 text-sm sm:text-base truncate", children: reminder.title }), reminder.isRecurring && (_jsx(Repeat, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0", title: "Recurring" }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" }), _jsx("span", { children: formatDate(reminder.dueDate) }), daysUntilDue >= 0 && (_jsxs("span", { className: "text-gray-500", children: ["(", daysUntilDue, " days)"] }))] }), reminder.amount && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" }), _jsx("span", { className: "font-medium", children: formatCurrency(reminder.amount) })] }))] })] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-shrink-0", children: [_jsx("span", { className: `px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${getPriorityColor(reminder.priority)}`, children: reminder.priority }), _jsx("span", { className: `px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${getStatusColor(reminder)}`, children: getStatusForReminder(reminder) })] })] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2 sm:ml-4 border-t border-gray-200 sm:border-0 pt-3 sm:pt-0", children: [!reminder.isCompleted && getStatusForReminder(reminder) !== 'paid' && (_jsxs("button", { onClick: () => onMarkAsPaid(reminder.id), className: "flex-1 sm:flex-none flex items-center justify-center gap-1 text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors py-2 sm:py-1 px-2 sm:px-1 rounded touch-manipulation", title: "Mark as paid", "aria-label": "Mark as paid", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs sm:hidden", children: "Mark Paid" })] })), _jsxs("button", { onClick: () => onEdit(reminder), className: "flex-1 sm:flex-none flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors py-2 sm:py-1 px-2 sm:px-1 rounded touch-manipulation", title: "Edit reminder", "aria-label": "Edit reminder", children: [_jsx(Edit3, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs sm:hidden", children: "Edit" })] }), _jsxs("button", { onClick: () => onSnooze(reminder.id), className: "flex-1 sm:flex-none flex items-center justify-center gap-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 transition-colors py-2 sm:py-1 px-2 sm:px-1 rounded touch-manipulation", title: "Snooze reminder", "aria-label": "Snooze reminder", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs sm:hidden", children: "Snooze" })] }), _jsxs("button", { onClick: () => onDelete(reminder.id), className: "flex-1 sm:flex-none flex items-center justify-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors py-2 sm:py-1 px-2 sm:px-1 rounded touch-manipulation", title: "Delete reminder", "aria-label": "Delete reminder", children: [_jsx(Trash2, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs sm:hidden", children: "Delete" })] })] })] }), reminder.notes && (_jsx("div", { className: "mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200", children: _jsx("p", { className: "text-xs sm:text-sm text-gray-600 break-words", children: reminder.notes }) }))] }, reminder.id));
                }) }), filteredAndSortedReminders.length === 0 && (_jsxs("div", { className: "text-center py-8 sm:py-12 px-4", children: [_jsx(Bell, { className: "mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-base sm:text-lg font-medium text-gray-900", children: "No reminders found" }), _jsx("p", { className: "mt-1 text-sm sm:text-base text-gray-600 px-2", children: searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                            ? 'Try adjusting your filters or search terms.'
                            : 'Create your first reminder to get started.' })] }))] }));
}
