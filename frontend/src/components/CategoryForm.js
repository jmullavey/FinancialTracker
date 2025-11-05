import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Tag, Palette, Sparkles } from 'lucide-react';
import { createCategory, updateCategory, listCategories } from '../services/accountsStore';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { api } from '../services/api';
import toast from 'react-hot-toast';
const COLOR_OPTIONS = [
    { value: '#EF4444', label: 'Red' },
    { value: '#F59E0B', label: 'Orange' },
    { value: '#EAB308', label: 'Yellow' },
    { value: '#22C55E', label: 'Green' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#6B7280', label: 'Gray' }
];
export function CategoryForm({ isOpen, onClose, onSuccess, editingCategory }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        color: '#3B82F6',
        useTemplate: false,
        selectedTemplate: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showCustomForm, setShowCustomForm] = useState(false);
    useEffect(() => {
        if (editingCategory && isOpen) {
            setFormData({
                name: editingCategory.name,
                type: editingCategory.type,
                color: editingCategory.color,
                useTemplate: false,
                selectedTemplate: ''
            });
            setShowCustomForm(true);
        }
        else if (isOpen) {
            setFormData({
                name: '',
                type: 'expense',
                color: '#3B82F6',
                useTemplate: false,
                selectedTemplate: ''
            });
            // Auto-show custom form if no templates available
            const existingCategories = listCategories();
            const availableTemplates = DEFAULT_CATEGORIES.filter(template => {
                return !existingCategories.some(cat => cat.name.toLowerCase() === template.name.toLowerCase());
            });
            setShowCustomForm(availableTemplates.length === 0);
        }
    }, [editingCategory, isOpen]);
    // Get available templates (that don't already exist)
    const existingCategories = listCategories();
    const availableTemplates = DEFAULT_CATEGORIES.filter(template => {
        return !existingCategories.some(cat => cat.name.toLowerCase() === template.name.toLowerCase());
    });
    if (!isOpen)
        return null;
    const handleTemplateSelect = async (templateName) => {
        const template = DEFAULT_CATEGORIES.find(t => t.name === templateName);
        if (template) {
            try {
                // Save to localStorage
                const category = createCategory({
                    name: template.name,
                    type: template.type,
                    color: template.color,
                    icon: template.icon
                });
                // Sync to API
                try {
                    await api.post('/categories', {
                        name: category.name,
                        color: category.color,
                        icon: category.icon
                    });
                }
                catch (apiError) {
                    console.warn('Failed to sync category to API:', apiError);
                    // Continue anyway - localStorage is primary
                }
                toast.success(`Category "${template.name}" added successfully!`);
                onSuccess();
                onClose();
            }
            catch (error) {
                toast.error(error.message || 'Failed to create category');
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Please enter a category name');
            return;
        }
        setSubmitting(true);
        try {
            if (editingCategory) {
                // Update existing category
                const updated = updateCategory(editingCategory.id, {
                    name: formData.name.trim(),
                    type: formData.type,
                    color: formData.color
                });
                if (updated) {
                    // Try to sync to API (optional - localStorage is primary)
                    try {
                        await api.put(`/categories/${editingCategory.id}`, {
                            name: updated.name,
                            color: updated.color,
                            icon: updated.icon
                        });
                    }
                    catch (apiError) {
                        console.warn('Failed to sync category update to API:', apiError);
                        // Continue anyway - localStorage is primary
                    }
                    toast.success('Category updated successfully!');
                }
                else {
                    throw new Error('Failed to update category');
                }
            }
            else {
                // Create new custom category
                const category = createCategory({
                    name: formData.name.trim(),
                    type: formData.type,
                    color: formData.color
                });
                // Sync to API (optional - localStorage is primary)
                try {
                    await api.post('/categories', {
                        name: category.name,
                        color: category.color,
                        icon: category.icon
                    });
                }
                catch (apiError) {
                    console.warn('Failed to sync category to API:', apiError);
                    // Continue anyway - localStorage is primary
                    // Don't show error to user since localStorage save succeeded
                }
                toast.success('Category created successfully!');
            }
            onSuccess();
            onClose();
        }
        catch (error) {
            toast.error(error.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
            console.error('Error saving category:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: editingCategory ? 'Edit Category' : 'Add Category' }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [!editingCategory && !showCustomForm && availableTemplates.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Sparkles, { className: "h-4 w-4 text-primary-600" }), _jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Select from Templates" })] }), _jsx("div", { className: "grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3", children: availableTemplates.map((template) => (_jsxs("button", { type: "button", onClick: () => handleTemplateSelect(template.name), className: "flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded border border-gray-200 transition-colors", children: [_jsx("div", { className: "w-4 h-4 rounded-full flex-shrink-0", style: { backgroundColor: template.color } }), _jsx("span", { className: "text-sm text-gray-700", children: template.name }), _jsx("span", { className: "text-xs text-gray-500 ml-auto capitalize", children: template.type })] }, template.name))) }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [availableTemplates.length, " template", availableTemplates.length !== 1 ? 's' : '', " available"] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "OR" }) })] }), _jsxs("button", { type: "button", onClick: () => setShowCustomForm(true), className: "w-full btn btn-secondary flex items-center justify-center", children: [_jsx(Tag, { className: "h-4 w-4 mr-2" }), "Create Custom Category"] })] })), !editingCategory && !showCustomForm && availableTemplates.length === 0 && (_jsxs("div", { className: "text-center py-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: "All default categories have been added. Create a custom category below." }), _jsxs("button", { type: "button", onClick: () => setShowCustomForm(true), className: "btn btn-primary flex items-center justify-center mx-auto", children: [_jsx(Tag, { className: "h-4 w-4 mr-2" }), "Create Custom Category"] })] })), (editingCategory || showCustomForm) && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Category Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData(prev => ({ ...prev, type: e.target.value })), className: "input", required: true, children: [_jsx("option", { value: "income", children: "Income" }), _jsx("option", { value: "expense", children: "Expense" }), _jsx("option", { value: "transfer", children: "Transfer" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Category Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Tag, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), placeholder: "e.g., Food & Dining, Transportation", className: "input pl-10", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Color" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Palette, { className: "h-4 w-4 text-gray-400" }), _jsx("div", { className: "flex gap-2 flex-wrap", children: COLOR_OPTIONS.map((color) => (_jsx("button", { type: "button", onClick: () => setFormData(prev => ({ ...prev, color: color.value })), className: `w-8 h-8 rounded-full border-2 transition-all ${formData.color === color.value
                                                            ? 'border-gray-900 scale-110'
                                                            : 'border-gray-300 hover:border-gray-500'}`, style: { backgroundColor: color.value }, title: color.label }, color.value))) })] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Selected: ", _jsx("span", { className: "font-medium", style: { color: formData.color }, children: COLOR_OPTIONS.find(c => c.value === formData.color)?.label })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: () => {
                                                if (showCustomForm && !editingCategory) {
                                                    setShowCustomForm(false);
                                                }
                                                else {
                                                    onClose();
                                                }
                                            }, className: "flex-1 btn btn-secondary", disabled: submitting, children: showCustomForm && !editingCategory ? 'Back' : 'Cancel' }), _jsx("button", { type: "submit", className: "flex-1 btn btn-primary", disabled: submitting, children: submitting
                                                ? (editingCategory ? 'Updating...' : 'Adding...')
                                                : (editingCategory ? 'Update Category' : 'Add Category') })] })] })), !editingCategory && !showCustomForm && (_jsx("button", { type: "button", onClick: onClose, className: "w-full btn btn-secondary", children: "Cancel" }))] })] }) }));
}
