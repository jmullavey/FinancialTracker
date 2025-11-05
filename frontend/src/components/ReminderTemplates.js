import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Home, Smartphone, PiggyBank, TrendingUp, Shield, Zap, FileText, Plus, Check } from 'lucide-react';
export function ReminderTemplates({ onSelectTemplate, onClose }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const templates = [
        {
            id: 'rent',
            title: 'Rent Payment',
            category: 'bills',
            icon: Home,
            color: 'bg-blue-500',
            amount: 1200,
            recurringPattern: 'monthly',
            priority: 'high',
            description: 'Monthly rent payment reminder'
        },
        {
            id: 'netflix',
            title: 'Netflix Subscription',
            category: 'subscriptions',
            icon: Smartphone,
            color: 'bg-red-500',
            amount: 15.99,
            recurringPattern: 'monthly',
            priority: 'low',
            description: 'Monthly Netflix subscription'
        },
        {
            id: 'savings',
            title: 'Emergency Fund',
            category: 'savings',
            icon: PiggyBank,
            color: 'bg-green-500',
            amount: 500,
            recurringPattern: 'monthly',
            priority: 'high',
            description: 'Monthly emergency fund contribution'
        },
        {
            id: 'investment',
            title: 'Investment Contribution',
            category: 'investments',
            icon: TrendingUp,
            color: 'bg-purple-500',
            amount: 1000,
            recurringPattern: 'monthly',
            priority: 'medium',
            description: 'Monthly investment contribution'
        },
        {
            id: 'insurance',
            title: 'Car Insurance',
            category: 'insurance',
            icon: Shield,
            color: 'bg-yellow-500',
            amount: 150,
            recurringPattern: 'monthly',
            priority: 'high',
            description: 'Monthly car insurance payment'
        },
        {
            id: 'electricity',
            title: 'Electricity Bill',
            category: 'utilities',
            icon: Zap,
            color: 'bg-orange-500',
            amount: 120,
            recurringPattern: 'monthly',
            priority: 'medium',
            description: 'Monthly electricity bill payment'
        },
        {
            id: 'phone',
            title: 'Phone Bill',
            category: 'utilities',
            icon: Smartphone,
            color: 'bg-indigo-500',
            amount: 80,
            recurringPattern: 'monthly',
            priority: 'medium',
            description: 'Monthly phone bill payment'
        },
        {
            id: 'gym',
            title: 'Gym Membership',
            category: 'subscriptions',
            icon: FileText,
            color: 'bg-pink-500',
            amount: 50,
            recurringPattern: 'monthly',
            priority: 'low',
            description: 'Monthly gym membership fee'
        }
    ];
    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template.id);
        setTimeout(() => {
            onSelectTemplate(template);
        }, 200);
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
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Reminder Templates" }), _jsx("p", { className: "text-sm text-gray-500", children: "Choose from common reminder templates to get started quickly" })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: "\u00D7" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: templates.map((template) => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === template.id;
                    return (_jsxs("button", { onClick: () => handleSelectTemplate(template), className: `p-4 border rounded-lg text-left transition-all hover:shadow-md ${isSelected
                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: `p-2 rounded-lg ${template.color}`, children: _jsx(Icon, { className: "h-5 w-5 text-white" }) }), isSelected && (_jsx(Check, { className: "h-5 w-5 text-primary-600" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: template.title }), _jsx("p", { className: "text-sm text-gray-600", children: template.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(template.priority)}`, children: template.priority }), _jsx("span", { className: "text-xs text-gray-500 capitalize", children: template.recurringPattern })] }), template.amount && (_jsxs("span", { className: "text-sm font-medium text-gray-900", children: ["$", template.amount.toFixed(2)] }))] })] })] }, template.id));
                }) }), _jsx("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Don't see what you need? You can create a custom reminder instead." })] }) })] }));
}
