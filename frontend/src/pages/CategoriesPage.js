import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Tag, Edit3, Trash2, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CategoryForm } from '../components/CategoryForm';
import { listCategories, deleteCategory, ensureDefaultCategories } from '../services/accountsStore';
import toast from 'react-hot-toast';
export function CategoriesPage() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    useEffect(() => {
        // Ensure defaults are seeded
        ensureDefaultCategories();
        loadCategories();
    }, []);
    const loadCategories = () => {
        try {
            setLoading(true);
            const allCategories = listCategories();
            setCategories(allCategories);
        }
        catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteCategory = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category)
            return;
        // Special warning for default categories
        const message = category.isDefault
            ? `This is a default category. You can hide or rename it, but deleting will remove it permanently. Continue?`
            : 'Are you sure you want to delete this category?';
        if (!confirm(message)) {
            return;
        }
        try {
            if (deleteCategory(categoryId)) {
                toast.success('Category deleted successfully');
                loadCategories();
            }
            else {
                toast.error('Failed to delete category');
            }
        }
        catch (error) {
            toast.error(error.message || 'Failed to delete category');
            console.error('Error deleting category:', error);
        }
    };
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowCategoryForm(true);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Categories" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Organize your transactions with categories" })] }), _jsxs("button", { onClick: () => {
                            setEditingCategory(null);
                            setShowCategoryForm(true);
                        }, className: "btn btn-primary flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Add Category" })] })] }), categories.length > 0 ? (_jsxs("div", { className: "space-y-6", children: [categories.filter(c => c.type === 'income').length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(TrendingUp, { className: "h-5 w-5 text-green-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Income" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: categories.filter(c => c.type === 'income').map((category) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center", style: {
                                                                backgroundColor: `${category.color}20`,
                                                                color: category.color
                                                            }, children: _jsx(Tag, { className: "h-4 w-4" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: category.name }), category.isDefault && (_jsx("span", { className: "text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded", children: "Default" }))] }), _jsx("p", { className: "text-xs text-gray-500", children: "Income" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleEditCategory(category), className: "text-gray-400 hover:text-gray-600", title: "Edit category", children: _jsx(Edit3, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDeleteCategory(category.id), className: "text-gray-400 hover:text-red-600", title: "Delete category", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, category.id))) })] })), categories.filter(c => c.type === 'expense').length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(TrendingDown, { className: "h-5 w-5 text-red-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Expenses" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: categories.filter(c => c.type === 'expense').map((category) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center", style: {
                                                                backgroundColor: `${category.color}20`,
                                                                color: category.color
                                                            }, children: _jsx(Tag, { className: "h-4 w-4" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: category.name }), category.isDefault && (_jsx("span", { className: "text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded", children: "Default" }))] }), _jsx("p", { className: "text-xs text-gray-500", children: "Expense" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleEditCategory(category), className: "text-gray-400 hover:text-gray-600", title: "Edit category", children: _jsx(Edit3, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDeleteCategory(category.id), className: "text-gray-400 hover:text-red-600", title: "Delete category", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, category.id))) })] })), categories.filter(c => c.type === 'transfer').length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(ArrowLeftRight, { className: "h-5 w-5 text-blue-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Transfers" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: categories.filter(c => c.type === 'transfer').map((category) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center", style: {
                                                                backgroundColor: `${category.color}20`,
                                                                color: category.color
                                                            }, children: _jsx(Tag, { className: "h-4 w-4" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: category.name }), category.isDefault && (_jsx("span", { className: "text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded", children: "Default" }))] }), _jsx("p", { className: "text-xs text-gray-500", children: "Transfer" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleEditCategory(category), className: "text-gray-400 hover:text-gray-600", title: "Edit category", children: _jsx(Edit3, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDeleteCategory(category.id), className: "text-gray-400 hover:text-red-600", title: "Delete category", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, category.id))) })] }))] })) : (_jsx("div", { className: "card", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-400 mb-4", children: _jsx(Tag, { className: "h-12 w-12 mx-auto" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No categories yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Create categories to organize your transactions" }), _jsxs("button", { onClick: () => {
                                setEditingCategory(null);
                                setShowCategoryForm(true);
                            }, className: "btn btn-primary flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Add Category" })] })] }) })), showCategoryForm && (_jsx(CategoryForm, { isOpen: showCategoryForm, onClose: () => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                }, onSuccess: () => {
                    loadCategories();
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                }, editingCategory: editingCategory }))] }));
}
