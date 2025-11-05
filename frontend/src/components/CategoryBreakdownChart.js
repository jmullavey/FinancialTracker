import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];
export function CategoryBreakdownChart({ data, totalSpent }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (_jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [_jsx("p", { className: "font-medium text-gray-900", children: data.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [formatCurrency(data.value), " (", data.percentage, "%)"] })] }));
        }
        return null;
    };
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05)
            return null; // Don't show labels for slices < 5%
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (_jsx("text", { x: x, y: y, fill: "white", textAnchor: x > cx ? 'start' : 'end', dominantBaseline: "central", fontSize: 12, fontWeight: "bold", children: `${(percent * 100).toFixed(0)}%` }));
    };
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Spending by Category" }), _jsxs("p", { className: "text-xs sm:text-sm text-gray-500 mt-0.5", children: ["Total spent: ", _jsx("span", { className: "font-medium text-gray-700", children: formatCurrency(totalSpent) })] })] }), _jsx("div", { className: "flex-shrink-0 p-2 bg-gray-50 rounded-lg", children: _jsx(PieChartIcon, { className: "h-4 w-4 sm:h-5 sm:w-5 text-gray-400" }) })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", labelLine: false, label: renderCustomizedLabel, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: data.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) })] }) }) }), _jsxs("div", { className: "mt-4 space-y-2", children: [data.slice(0, 5).map((category, index) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: category.color } }), _jsx("span", { className: "text-gray-700", children: category.name })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "font-medium text-gray-900", children: formatCurrency(category.value) }), _jsxs("span", { className: "text-gray-500 ml-1", children: ["(", category.percentage, "%)"] })] })] }, category.name))), data.length > 5 && (_jsxs("div", { className: "text-sm text-gray-500 text-center pt-2", children: ["+", data.length - 5, " more categories"] }))] })] }));
}
