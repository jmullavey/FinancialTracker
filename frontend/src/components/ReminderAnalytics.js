import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
export function ReminderAnalytics({ reminders }) {
    const [timeRange, setTimeRange] = useState('month');
    const calculateAnalytics = () => {
        const now = new Date();
        const upcoming = reminders.filter(r => new Date(r.dueDate) > now && r.status === 'upcoming');
        const overdue = reminders.filter(r => new Date(r.dueDate) < now && r.status === 'upcoming');
        const paid = reminders.filter(r => r.status === 'paid');
        const totalAmount = reminders.reduce((sum, r) => sum + (r.amount || 0), 0);
        const upcomingAmount = upcoming.reduce((sum, r) => sum + (r.amount || 0), 0);
        const overdueAmount = overdue.reduce((sum, r) => sum + (r.amount || 0), 0);
        const categoryBreakdown = reminders.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
        }, {});
        const priorityBreakdown = reminders.reduce((acc, r) => {
            acc[r.priority] = (acc[r.priority] || 0) + 1;
            return acc;
        }, {});
        return {
            upcoming,
            overdue,
            paid,
            totalAmount,
            upcomingAmount,
            overdueAmount,
            categoryBreakdown,
            priorityBreakdown
        };
    };
    const analytics = calculateAnalytics();
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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
    return (_jsxs("div", { className: "space-y-4 sm:space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-medium text-gray-900", children: "Reminder Analytics" }), _jsx("div", { className: "flex items-center gap-2", children: ['week', 'month', 'quarter'].map((range) => (_jsx("button", { onClick: () => setTimeRange(range), className: `px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-colors touch-manipulation ${timeRange === range
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-500 hover:text-gray-700 bg-gray-100 sm:bg-transparent'}`, children: range.charAt(0).toUpperCase() + range.slice(1) }, range))) })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 sm:mb-0", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500", children: "Upcoming" }), _jsx("p", { className: "text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1", children: analytics.upcoming.length })] }), _jsx(Clock, { className: "h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" })] }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600 mt-1", children: formatCurrency(analytics.upcomingAmount) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 sm:mb-0", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500", children: "Overdue" }), _jsx("p", { className: "text-xl sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1", children: analytics.overdue.length })] }), _jsx(AlertTriangle, { className: "h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0 ml-2" })] }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600 mt-1", children: formatCurrency(analytics.overdueAmount) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 sm:mb-0", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500", children: "Paid" }), _jsx("p", { className: "text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1", children: analytics.paid.length })] }), _jsx(CheckCircle, { className: "h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 ml-2" })] }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600 mt-1", children: formatCurrency(analytics.paid.reduce((sum, r) => sum + (r.amount || 0), 0)) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 sm:mb-0", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500", children: "Total Value" }), _jsx("p", { className: "text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1 break-words", children: formatCurrency(analytics.totalAmount) })] }), _jsx(DollarSign, { className: "h-6 w-6 sm:h-8 sm:w-8 text-gray-600 flex-shrink-0 ml-2" })] }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600 mt-1", children: "All reminders" })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6", children: [_jsx("h4", { className: "text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4", children: "Category Breakdown" }), _jsx("div", { className: "space-y-2 sm:space-y-3", children: Object.entries(analytics.categoryBreakdown).map(([category, count]) => (_jsxs("div", { className: "flex items-center justify-between gap-2 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0", children: [_jsx("span", { className: "text-xl sm:text-2xl", children: getCategoryIcon(category) }), _jsx("span", { className: "font-medium text-gray-900 capitalize text-sm sm:text-base truncate", children: category })] }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-4 flex-shrink-0", children: [_jsx("div", { className: "w-20 sm:w-32 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary-600 h-2 rounded-full", style: { width: `${(count / reminders.length) * 100}%` } }) }), _jsx("span", { className: "text-xs sm:text-sm font-medium text-gray-900 w-6 sm:w-8 text-right", children: count })] })] }, category))) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6", children: [_jsx("h4", { className: "text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4", children: "Priority Breakdown" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4", children: Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPriorityColor(priority)}`, children: priority.charAt(0).toUpperCase() + priority.slice(1) }), _jsx("p", { className: "text-xl sm:text-2xl font-bold text-gray-900 mt-2", children: count }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500", children: "reminders" })] }, priority))) })] }), _jsx("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 sm:p-6", children: _jsxs("div", { className: "flex items-start gap-2 sm:gap-3", children: [_jsx(Target, { className: "h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" }), _jsxs("div", { className: "min-w-0", children: [_jsx("h4", { className: "text-base sm:text-lg font-medium text-blue-900", children: "Smart Insights" }), _jsxs("div", { className: "mt-2 space-y-2 text-xs sm:text-sm text-blue-800", children: [analytics.overdue.length > 0 && (_jsxs("p", { className: "break-words", children: ["\u26A0\uFE0F You have ", analytics.overdue.length, " overdue reminders. Consider setting up auto-pay for recurring bills."] })), analytics.upcoming.length > 5 && (_jsxs("p", { className: "break-words", children: ["\uD83D\uDCC5 You have ", analytics.upcoming.length, " upcoming reminders this month. Consider scheduling payments in advance."] })), analytics.priorityBreakdown.high > 3 && (_jsxs("p", { className: "break-words", children: ["\uD83D\uDD25 You have ", analytics.priorityBreakdown.high, " high-priority reminders. Focus on these first."] })), analytics.paid.length > 0 && (_jsxs("p", { className: "break-words", children: ["\u2705 Great job! You've paid ", analytics.paid.length, " reminders on time."] }))] })] })] }) })] }));
}
