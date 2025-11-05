import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, DollarSign, Calendar, AlertCircle, Plus } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SpendingTrendsChart } from '../components/SpendingTrendsChart';
import { CategoryBreakdownChart } from '../components/CategoryBreakdownChart';
import { SmartInsights, generateInsights } from '../components/SmartInsights';
import { EnhancedMetrics, generateMetrics } from '../components/EnhancedMetrics';
export function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        try {
            // Load from localStorage store
            const { listTransactions, listAccounts } = await import('../services/accountsStore');
            const storeTransactions = listTransactions();
            const storeAccounts = listAccounts();
            // Also fetch reminders and categories from API
            const [remindersResponse, categoriesResponse] = await Promise.all([
                api.get('/reminders?limit=5').catch(() => ({ data: { reminders: [] } })),
                api.get('/categories').catch(() => ({ data: { categories: [] } }))
            ]);
            const allTransactions = storeTransactions.map(tx => ({
                id: tx.id,
                accountId: tx.account_id,
                amount: tx.amount,
                description: tx.description,
                date: tx.date,
                type: tx.type,
                merchant: tx.merchant,
                categoryId: tx.category_id
            }));
            const reminders = remindersResponse.data.reminders || [];
            const categories = categoriesResponse.data.categories || [];
            const accounts = storeAccounts.map(a => ({
                id: a.id,
                name: a.name,
                type: a.account_type,
                balance: a.current_balance
            }));
            // Calculate total account balances
            const totalAccountBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            // Calculate current period stats (last 30 days)
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const currentPeriodTransactions = allTransactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= thirtyDaysAgo && transactionDate <= currentDate;
            });
            // Calculate ALL TIME totals (not just last 30 days)
            const allTimeIncome = allTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const allTimeExpenses = Math.abs(allTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0));
            // Calculate current period totals (last 30 days)
            const totalIncome = currentPeriodTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = Math.abs(currentPeriodTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0));
            // Net worth = account balances + (income - expenses from transactions)
            // Or use total account balance if it's being maintained
            const netWorth = totalAccountBalance > 0 ? totalAccountBalance : (allTimeIncome - allTimeExpenses);
            // Sort all transactions by date (newest first) for recent transactions
            const sortedTransactions = [...allTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            // Generate spending trends data (most recent days with transactions)
            // Use all transactions to find the most recent days with data, not just last 30 days
            const spendingTrends = generateSpendingTrendsData(allTransactions);
            // Generate category spending data from ALL transactions (for better insights)
            const categorySpending = generateCategorySpendingData(allTransactions, categories);
            // Generate previous period data for comparison
            const previousPeriodData = generatePreviousPeriodData(allTransactions, thirtyDaysAgo);
            setStats({
                totalIncome: allTimeIncome, // Show all-time income
                totalExpenses: allTimeExpenses, // Show all-time expenses
                netWorth,
                accountBalance: totalAccountBalance,
                transactionCount: allTransactions.length, // Total transaction count
                recentTransactions: sortedTransactions.slice(0, 5), // Most recent 5 transactions
                upcomingReminders: reminders,
                spendingTrends,
                categorySpending,
                monthlyBudget: 3000, // Default budget - in real app, this would come from user settings
                previousPeriodData
            });
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // Helper functions for data generation
    const generateSpendingTrendsData = (transactions) => {
        if (!transactions || transactions.length === 0) {
            return [];
        }
        // Find all unique dates that have transactions
        const dateSet = new Set();
        transactions.forEach(t => {
            if (t.date) {
                // Normalize date to YYYY-MM-DD format for consistent comparison
                const dateStr = typeof t.date === 'string' ? t.date.split('T')[0] : t.date;
                dateSet.add(dateStr);
            }
        });
        if (dateSet.size === 0) {
            return [];
        }
        // Convert to array, sort by date (newest first), and take up to 7 most recent days
        const uniqueDates = Array.from(dateSet)
            .sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
        })
            .slice(0, 7);
        // Sort oldest to newest for display
        const sortedDates = uniqueDates.sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
        });
        // Generate data for each day with transactions
        const spendingTrends = sortedDates.map(dateStr => {
            // Match transactions by date (normalize both sides)
            const dayTransactions = transactions.filter(t => {
                if (!t.date)
                    return false;
                const txDateStr = typeof t.date === 'string' ? t.date.split('T')[0] : t.date;
                return txDateStr === dateStr;
            });
            const income = dayTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + (t.amount || 0), 0);
            const expenses = Math.abs(dayTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + (t.amount || 0), 0));
            return {
                date: dateStr,
                income,
                expenses,
                net: income - expenses
            };
        });
        return spendingTrends;
    };
    const generateCategorySpendingData = (transactions, categories) => {
        const categoryMap = new Map();
        transactions
            .filter(t => t.type === 'expense' && t.categoryName)
            .forEach(t => {
            const categoryName = t.categoryName;
            const amount = Math.abs(t.amount);
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
        });
        const totalSpent = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
        return Array.from(categoryMap.entries()).map(([name, value], index) => {
            const category = categories.find(c => c.name === name);
            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
            return {
                name,
                value,
                color: category?.color || colors[index % colors.length],
                percentage: totalSpent > 0 ? (value / totalSpent) * 100 : 0
            };
        }).sort((a, b) => b.value - a.value);
    };
    const generatePreviousPeriodData = (allTransactions, thirtyDaysAgo) => {
        const sixtyDaysAgo = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
        const previousPeriodTransactions = allTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= sixtyDaysAgo && transactionDate < thirtyDaysAgo;
        });
        const income = previousPeriodTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = Math.abs(previousPeriodTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0));
        return {
            income,
            expenses,
            transactions: previousPeriodTransactions.length,
            categories: new Set(previousPeriodTransactions.map(t => t.categoryName).filter(Boolean)).size
        };
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    return (_jsxs("div", { className: "space-y-5 sm:space-y-6 lg:space-y-8", children: [_jsx("div", { className: "px-1 sm:px-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600", children: "Overview of your financial activity" })] }), stats && stats.transactionCount > 0 && (_jsxs("div", { className: "hidden sm:flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Last updated: ", new Date().toLocaleDateString()] })] }))] }) }), stats && (_jsx(EnhancedMetrics, { metrics: generateMetrics({
                    income: stats.totalIncome,
                    expenses: stats.totalExpenses,
                    transactions: stats.transactionCount,
                    categories: stats.categorySpending.length
                }, stats.previousPeriodData, 'month'), period: "month" })), stats && stats.accountBalance !== undefined && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6", children: [_jsx("div", { className: "card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500 mb-1", children: "Total Account Balance" }), _jsx("p", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words", children: formatCurrency(stats.accountBalance) }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Across all accounts" })] }), _jsx("div", { className: "flex-shrink-0 ml-3 p-2 sm:p-3 bg-blue-50 rounded-lg", children: _jsx(CreditCard, { className: "h-6 w-6 sm:h-8 sm:w-8 text-blue-600" }) })] }) }), _jsx("div", { className: "card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500 mb-1", children: "Total Transactions" }), _jsx("p", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900", children: stats.transactionCount.toLocaleString() }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "All time" })] }), _jsx("div", { className: "flex-shrink-0 ml-3 p-2 sm:p-3 bg-purple-50 rounded-lg", children: _jsx(Calendar, { className: "h-6 w-6 sm:h-8 sm:w-8 text-purple-600" }) })] }) }), _jsx("div", { className: "card p-4 sm:p-6 sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs sm:text-sm font-medium text-gray-500 mb-1", children: "Net Cash Flow" }), _jsx("p", { className: `text-xl sm:text-2xl lg:text-3xl font-bold ${stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(stats.netWorth) }), _jsxs("p", { className: `text-xs mt-1 ${stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [stats.netWorth >= 0 ? 'Positive' : 'Negative', " balance"] })] }), _jsx("div", { className: `flex-shrink-0 ml-3 p-2 sm:p-3 rounded-lg ${stats.netWorth >= 0 ? 'bg-green-50' : 'bg-red-50'}`, children: _jsx(DollarSign, { className: `h-6 w-6 sm:h-8 sm:w-8 ${stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}` }) })] }) })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8", children: [stats?.spendingTrends && (_jsx("div", { className: "min-w-0", children: _jsx(SpendingTrendsChart, { data: stats.spendingTrends, period: "week" }) })), stats?.categorySpending && stats.categorySpending.length > 0 && (_jsx("div", { className: "min-w-0", children: _jsx(CategoryBreakdownChart, { data: stats.categorySpending, totalSpent: stats.totalExpenses }) }))] }), stats && (_jsx(SmartInsights, { insights: generateInsights(stats.totalIncome, stats.totalExpenses, stats.monthlyBudget, stats.categorySpending, stats.recentTransactions) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8", children: [_jsxs("div", { className: "card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-gray-200", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Recent Transactions" }), _jsxs(Link, { to: "/transactions", className: "text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center gap-1", children: ["View all", _jsx("span", { className: "hidden sm:inline", children: "\u2192" })] })] }), _jsx("div", { className: "space-y-3 sm:space-y-4", children: stats?.recentTransactions.length ? (stats.recentTransactions.map((transaction) => (_jsxs("div", { className: "flex items-center justify-between py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0", children: [_jsxs("div", { className: "flex-1 min-w-0 pr-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: transaction.description }), _jsxs("p", { className: "text-xs text-gray-500 mt-1 flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), formatDate(transaction.date)] })] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsx("p", { className: `text-sm sm:text-base font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(transaction.amount) }), _jsx("span", { className: `inline-block mt-1 px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${transaction.type === 'income'
                                                        ? 'bg-green-100 text-green-700'
                                                        : transaction.type === 'expense'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-blue-100 text-blue-700'}`, children: transaction.type })] })] }, transaction.id)))) : (_jsxs("div", { className: "text-center py-8 sm:py-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4", children: _jsx(CreditCard, { className: "h-8 w-8 sm:h-10 sm:w-10 text-gray-400" }) }), _jsx("h3", { className: "text-sm sm:text-base font-medium text-gray-900 mb-1", children: "No transactions yet" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500 mb-4", children: "Get started by uploading your first statement" }), _jsxs(Link, { to: "/transactions", className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors touch-manipulation", children: [_jsx(Plus, { className: "h-4 w-4" }), "Upload statements"] })] })) })] }), _jsxs("div", { className: "card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-gray-200", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Upcoming Reminders" }), _jsxs(Link, { to: "/reminders", className: "text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center gap-1", children: ["View all", _jsx("span", { className: "hidden sm:inline", children: "\u2192" })] })] }), _jsx("div", { className: "space-y-3 sm:space-y-4", children: stats?.upcomingReminders.length ? (stats.upcomingReminders.map((reminder) => {
                                    const daysUntilDue = Math.ceil((new Date(reminder.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                    const isOverdue = daysUntilDue < 0;
                                    const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;
                                    return (_jsxs("div", { className: `flex items-center justify-between py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg transition-colors border-b border-gray-100 last:border-0 ${isOverdue ? 'bg-red-50 hover:bg-red-100' : isUrgent ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}`, children: [_jsxs("div", { className: "flex-1 min-w-0 pr-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: reminder.title }), _jsxs("p", { className: `text-xs mt-1 flex items-center gap-1 ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-500'}`, children: [_jsx(Calendar, { className: "h-3 w-3" }), "Due ", formatDate(reminder.dueDate), daysUntilDue >= 0 && ` (${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''})`] })] }), reminder.amount && (_jsx("div", { className: "text-right flex-shrink-0", children: _jsx("p", { className: "text-sm sm:text-base font-semibold text-gray-900", children: formatCurrency(reminder.amount) }) }))] }, reminder.id));
                                })) : (_jsxs("div", { className: "text-center py-8 sm:py-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4", children: _jsx(Calendar, { className: "h-8 w-8 sm:h-10 sm:w-10 text-gray-400" }) }), _jsx("h3", { className: "text-sm sm:text-base font-medium text-gray-900 mb-1", children: "No reminders set" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500 mb-4", children: "Stay organized with payment reminders" }), _jsxs(Link, { to: "/reminders", className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors touch-manipulation", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add reminder"] })] })) })] })] }), _jsxs("div", { className: "card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-gray-200", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold text-gray-900", children: "Quick Actions" }), _jsxs(Link, { to: "/transactions", className: "text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center gap-1", children: ["View all", _jsx("span", { className: "hidden sm:inline", children: "\u2192" })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", children: [_jsxs(Link, { to: "/transactions", className: "flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm active:bg-primary-100 transition-all group touch-manipulation min-h-[120px] sm:min-h-[140px]", children: [_jsx("div", { className: "flex-shrink-0 mb-2 sm:mb-3", children: _jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 group-hover:scale-110 transition-all duration-200", children: _jsx(Plus, { className: "h-6 w-6 sm:h-7 sm:w-7 text-primary-600" }) }) }), _jsx("p", { className: "text-xs sm:text-sm font-semibold text-gray-900 text-center", children: "Upload Statement" }), _jsx("p", { className: "text-[10px] sm:text-xs text-gray-500 text-center mt-1", children: "Import PDF/CSV" })] }), _jsxs(Link, { to: "/transactions", className: "flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm active:bg-blue-100 transition-all group touch-manipulation min-h-[120px] sm:min-h-[140px]", children: [_jsx("div", { className: "flex-shrink-0 mb-2 sm:mb-3", children: _jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-200", children: _jsx(CreditCard, { className: "h-6 w-6 sm:h-7 sm:w-7 text-blue-600" }) }) }), _jsx("p", { className: "text-xs sm:text-sm font-semibold text-gray-900 text-center", children: "All Transactions" }), _jsxs("p", { className: "text-[10px] sm:text-xs text-gray-500 text-center mt-1", children: [stats?.transactionCount || 0, " total"] })] }), _jsxs(Link, { to: "/reminders", className: "flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 hover:shadow-sm active:bg-orange-100 transition-all group touch-manipulation min-h-[120px] sm:min-h-[140px]", children: [_jsx("div", { className: "flex-shrink-0 mb-2 sm:mb-3", children: _jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-200", children: _jsx(AlertCircle, { className: "h-6 w-6 sm:h-7 sm:w-7 text-orange-600" }) }) }), _jsx("p", { className: "text-xs sm:text-sm font-semibold text-gray-900 text-center", children: "Reminders" }), _jsxs("p", { className: "text-[10px] sm:text-xs text-gray-500 text-center mt-1", children: [stats?.upcomingReminders.length || 0, " upcoming"] })] }), _jsxs(Link, { to: "/accounts", className: "flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 hover:shadow-sm active:bg-green-100 transition-all group touch-manipulation min-h-[120px] sm:min-h-[140px]", children: [_jsx("div", { className: "flex-shrink-0 mb-2 sm:mb-3", children: _jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 group-hover:scale-110 transition-all duration-200", children: _jsx(DollarSign, { className: "h-6 w-6 sm:h-7 sm:w-7 text-green-600" }) }) }), _jsx("p", { className: "text-xs sm:text-sm font-semibold text-gray-900 text-center", children: "Accounts" }), _jsx("p", { className: "text-[10px] sm:text-xs text-gray-500 text-center mt-1 line-clamp-1", children: stats?.accountBalance !== undefined ? formatCurrency(stats.accountBalance) : 'Manage' })] })] })] })] }));
}
