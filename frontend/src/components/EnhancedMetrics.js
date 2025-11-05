import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertCircle } from 'lucide-react';
export function EnhancedMetrics({ metrics, period }) {
    const formatValue = (value, format) => {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(value);
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'number':
                return value.toLocaleString();
            default:
                return value.toString();
        }
    };
    const calculateChange = (current, previous) => {
        if (previous === 0)
            return { percentage: 0, isPositive: current >= 0 };
        const percentage = ((current - previous) / Math.abs(previous)) * 100;
        return { percentage: Math.abs(percentage), isPositive: current >= previous };
    };
    const getPeriodLabel = () => {
        switch (period) {
            case 'week': return 'vs Last Week';
            case 'month': return 'vs Last Month';
            case 'quarter': return 'vs Last Quarter';
            default: return 'vs Previous Period';
        }
    };
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6", children: metrics.map((metric, index) => {
            const change = calculateChange(metric.current, metric.previous);
            const Icon = metric.icon;
            return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("div", { className: `p-1.5 sm:p-2 rounded-lg ${metric.color}`, children: _jsx(Icon, { className: "h-5 w-5 sm:h-6 sm:w-6 text-white" }) }), _jsxs("div", { className: "text-right flex-shrink-0 ml-2", children: [_jsxs("div", { className: "flex items-center gap-1 justify-end", children: [change.isPositive ? (_jsx(TrendingUp, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" })), _jsxs("span", { className: `text-xs sm:text-sm font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'}`, children: [change.percentage.toFixed(1), "%"] })] }), _jsx("p", { className: "text-[10px] sm:text-xs text-gray-500 mt-0.5", children: getPeriodLabel() })] })] }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate", children: metric.label }), _jsx("p", { className: "text-xl sm:text-2xl font-bold text-gray-900 break-words", children: formatValue(metric.current, metric.format) }), metric.previous !== 0 && (_jsxs("p", { className: "text-xs sm:text-sm text-gray-500 mt-1", children: ["Previous: ", formatValue(metric.previous, metric.format)] }))] })] }, index));
        }) }));
}
// Helper function to generate metrics from transaction data
export function generateMetrics(currentPeriodData, previousPeriodData, period) {
    return [
        {
            current: currentPeriodData.income,
            previous: previousPeriodData.income,
            label: 'Total Income',
            icon: DollarSign,
            color: 'bg-green-500',
            format: 'currency'
        },
        {
            current: currentPeriodData.expenses,
            previous: previousPeriodData.expenses,
            label: 'Total Expenses',
            icon: AlertCircle,
            color: 'bg-red-500',
            format: 'currency'
        },
        {
            current: currentPeriodData.income - currentPeriodData.expenses,
            previous: previousPeriodData.income - previousPeriodData.expenses,
            label: 'Net Worth',
            icon: Target,
            color: 'bg-blue-500',
            format: 'currency'
        },
        {
            current: currentPeriodData.transactions,
            previous: previousPeriodData.transactions,
            label: 'Transactions',
            icon: Calendar,
            color: 'bg-purple-500',
            format: 'number'
        }
    ];
}
