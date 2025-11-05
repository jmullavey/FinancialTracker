import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
export function SpendingTrendsChart({ data, period }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (period === 'week') {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
        else if (period === 'month') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        else {
            return date.toLocaleDateString('en-US', { month: 'short' });
        }
    };
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const netWorth = totalIncome - totalExpenses;
    const isPositive = netWorth >= 0;
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Spending Trends" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500 mt-0.5", children: period === 'week'
                                    ? `${data.length} day${data.length !== 1 ? 's' : ''} with transactions`
                                    : period === 'month'
                                        ? 'Last 30 days'
                                        : 'Last 3 months' })] }), _jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 sm:h-5 sm:w-5 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 sm:h-5 sm:w-5 text-red-600" })), _jsxs("span", { className: `text-xs sm:text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`, children: [formatCurrency(Math.abs(netWorth)), " ", isPositive ? 'surplus' : 'deficit'] })] })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: data, margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "date", tickFormatter: formatDate, stroke: "#6b7280", fontSize: 12 }), _jsx(YAxis, { tickFormatter: formatCurrency, stroke: "#6b7280", fontSize: 12 }), _jsx(Tooltip, { formatter: (value, name) => [
                                    formatCurrency(value),
                                    name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                                ], labelFormatter: (date) => `Date: ${formatDate(date)}`, contentStyle: {
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                } }), _jsx(Line, { type: "monotone", dataKey: "income", stroke: "#10b981", strokeWidth: 2, dot: { fill: '#10b981', strokeWidth: 2, r: 4 }, activeDot: { r: 6, stroke: '#10b981', strokeWidth: 2 } }), _jsx(Line, { type: "monotone", dataKey: "expenses", stroke: "#ef4444", strokeWidth: 2, dot: { fill: '#ef4444', strokeWidth: 2, r: 4 }, activeDot: { r: 6, stroke: '#ef4444', strokeWidth: 2 } })] }) }) }), _jsxs("div", { className: "flex items-center justify-center gap-6 mt-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), _jsx("span", { className: "text-gray-600", children: "Income" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded-full" }), _jsx("span", { className: "text-gray-600", children: "Expenses" })] })] })] }));
}
