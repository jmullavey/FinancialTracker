import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';
export function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    // Refs for autofill detection
    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);
    // Detect autofill and mark inputs with .filled class (same as LoginPage)
    useEffect(() => {
        const inputs = [
            firstNameInputRef.current,
            lastNameInputRef.current,
            emailInputRef.current,
            passwordInputRef.current,
            confirmPasswordInputRef.current
        ].filter(Boolean);
        if (inputs.length === 0)
            return;
        const checkInput = (input) => {
            const hasValue = input.value.length > 0;
            let isAutofilled = false;
            try {
                isAutofilled = input.matches ? input.matches(':-webkit-autofill') : false;
            }
            catch (e) {
                isAutofilled = false;
            }
            if (hasValue || isAutofilled) {
                input.classList.add('filled');
            }
            else {
                input.classList.remove('filled');
            }
        };
        const checkAll = () => {
            inputs.forEach(checkInput);
        };
        // Initial check
        checkAll();
        // Listen for input changes
        const handleInput = (e) => {
            checkInput(e.target);
        };
        inputs.forEach(input => {
            input.addEventListener('input', handleInput);
        });
        // Detect autofill via animationstart (most reliable)
        const handleAnimationStart = (e) => {
            if (e.animationName === 'onAutoFillStart') {
                setTimeout(checkAll, 10);
            }
        };
        document.addEventListener('animationstart', handleAnimationStart);
        // Check on focus/blur
        const handleFocus = (e) => {
            setTimeout(() => checkInput(e.target), 50);
        };
        const handleBlur = (e) => {
            checkInput(e.target);
        };
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });
        // Periodic check for delayed autofill
        let checkInterval = null;
        const startPeriodicCheck = () => {
            if (checkInterval)
                return;
            checkInterval = setInterval(() => {
                checkAll();
                if (inputs.every(input => input.value)) {
                    if (checkInterval) {
                        clearInterval(checkInterval);
                        checkInterval = null;
                    }
                }
            }, 100);
            setTimeout(() => {
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
            }, 3000);
        };
        startPeriodicCheck();
        window.addEventListener('focus', () => {
            checkAll();
            startPeriodicCheck();
        });
        return () => {
            inputs.forEach(input => {
                input.removeEventListener('input', handleInput);
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
            document.removeEventListener('animationstart', handleAnimationStart);
            window.removeEventListener('focus', startPeriodicCheck);
            if (checkInterval) {
                clearInterval(checkInterval);
            }
        };
    }, []);
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Update filled class for autofill detection
        if (e.target.value.length > 0) {
            e.target.classList.add('filled');
        }
        else {
            e.target.classList.remove('filled');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (!agreedToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }
        setLoading(true);
        try {
            await register(formData.email, formData.password, formData.firstName, formData.lastName);
            toast.success('Account created successfully!');
            navigate('/');
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6)
            strength++;
        if (password.length >= 8)
            strength++;
        if (/[A-Z]/.test(password))
            strength++;
        if (/[0-9]/.test(password))
            strength++;
        if (/[^A-Za-z0-9]/.test(password))
            strength++;
        return strength;
    };
    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return (_jsxs("div", { className: "min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 register-page", children: [_jsxs("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50", children: [_jsx("div", { className: "absolute inset-0 opacity-25", style: {
                            backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
                            backgroundSize: '50px 50px'
                        } }), _jsx("div", { className: "absolute top-16 left-16 w-36 h-36 bg-indigo-200 rounded-full opacity-20 blur-xl" }), _jsx("div", { className: "absolute top-32 right-24 w-44 h-44 bg-purple-200 rounded-full opacity-15 blur-xl" }), _jsx("div", { className: "absolute bottom-28 left-32 w-48 h-48 bg-blue-200 rounded-full opacity-25 blur-xl" }), _jsx("div", { className: "absolute bottom-16 right-16 w-32 h-32 bg-indigo-300 rounded-full opacity-20 blur-xl" }), _jsx("div", { className: "absolute top-1/4 left-8 w-80 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30" }), _jsx("div", { className: "absolute top-1/3 right-8 w-96 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-25" }), _jsx("div", { className: "absolute bottom-1/4 left-16 w-72 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-35" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/90 to-blue-50/80" })] }), _jsx("div", { className: "w-full max-w-6xl relative z-10", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center", children: [_jsx("div", { className: "hidden lg:block", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center mb-8", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-7 w-7 text-white" }) }), _jsx("span", { className: "ml-3 text-2xl font-bold text-gray-900", children: "FinanceTracker" })] }), _jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-6", children: ["Start your financial", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600", children: " journey" })] }), _jsx("p", { className: "text-lg text-gray-600 mb-8", children: "Join thousands of users who are taking control of their finances and building wealth." }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4", children: _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }) }), _jsx("span", { className: "text-gray-700", children: "Free to get started" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4", children: _jsx(Shield, { className: "h-4 w-4 text-blue-600" }) }), _jsx("span", { className: "text-gray-700", children: "Your data is secure" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4", children: _jsx(Zap, { className: "h-4 w-4 text-purple-600" }) }), _jsx("span", { className: "text-gray-700", children: "Set up in minutes" })] })] })] }) }), _jsxs("div", { className: "w-full max-w-md mx-auto", children: [_jsxs("div", { className: "lg:hidden flex items-center justify-center mb-8", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-6 w-6 text-white" }) }), _jsx("span", { className: "ml-2 text-xl font-bold text-gray-900", children: "FinanceTracker" })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Create your account" }), _jsx("p", { className: "text-gray-600", children: "Get started with your free account today" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: firstNameInputRef, id: "firstName", name: "firstName", type: "text", autoComplete: "given-name", required: true, value: formData.firstName, onChange: handleChange, onFocus: (e) => {
                                                                        e.target.classList.add('focused');
                                                                    }, onBlur: (e) => {
                                                                        e.target.classList.remove('focused');
                                                                        if (e.target.value.length > 0) {
                                                                            e.target.classList.add('filled');
                                                                        }
                                                                        else {
                                                                            e.target.classList.remove('filled');
                                                                        }
                                                                    }, className: "floating-input w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "firstName", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "First name" })] }), _jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: lastNameInputRef, id: "lastName", name: "lastName", type: "text", autoComplete: "family-name", required: true, value: formData.lastName, onChange: handleChange, onFocus: (e) => {
                                                                        e.target.classList.add('focused');
                                                                    }, onBlur: (e) => {
                                                                        e.target.classList.remove('focused');
                                                                        if (e.target.value.length > 0) {
                                                                            e.target.classList.add('filled');
                                                                        }
                                                                        else {
                                                                            e.target.classList.remove('filled');
                                                                        }
                                                                    }, className: "floating-input w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "lastName", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Last name" })] })] }), _jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: emailInputRef, id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: handleChange, onFocus: (e) => {
                                                                e.target.classList.add('focused');
                                                            }, onBlur: (e) => {
                                                                e.target.classList.remove('focused');
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, className: "floating-input w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "email", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Email address" })] }), _jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: passwordInputRef, id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: "new-password", required: true, value: formData.password, onChange: handleChange, onFocus: (e) => {
                                                                e.target.classList.add('focused');
                                                            }, onBlur: (e) => {
                                                                e.target.classList.remove('focused');
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, className: "floating-input w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "password", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "h-5 w-5" }) : _jsx(Eye, { className: "h-5 w-5" }) }), formData.password && (_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Password strength" }), _jsx("span", { className: `text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                                                                                passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'}`, children: strengthLabels[passwordStrength - 1] || 'Very Weak' })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-red-500'}`, style: { width: `${(passwordStrength / 5) * 100}%` } }) })] }))] }), _jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: confirmPasswordInputRef, id: "confirmPassword", name: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', autoComplete: "new-password", required: true, value: formData.confirmPassword, onChange: handleChange, onFocus: (e) => {
                                                                e.target.classList.add('focused');
                                                            }, onBlur: (e) => {
                                                                e.target.classList.remove('focused');
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, className: "floating-input w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "confirmPassword", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Confirm password" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10", "aria-label": showConfirmPassword ? 'Hide password' : 'Show password', children: showConfirmPassword ? _jsx(EyeOff, { className: "h-5 w-5" }) : _jsx(Eye, { className: "h-5 w-5" }) }), formData.confirmPassword && formData.password !== formData.confirmPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: "Passwords do not match" }))] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "agreedToTerms", name: "agreedToTerms", type: "checkbox", checked: agreedToTerms, onChange: (e) => setAgreedToTerms(e.target.checked), className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), _jsxs("label", { htmlFor: "agreedToTerms", className: "ml-2 block text-sm text-gray-700", children: ["I agree to the", ' ', _jsx("a", { href: "#", className: "text-indigo-600 hover:text-indigo-500", children: "Terms of Service" }), ' ', "and", ' ', _jsx("a", { href: "#", className: "text-indigo-600 hover:text-indigo-500", children: "Privacy Policy" })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 mr-2 animate-spin" }), "Creating account..."] })) : (_jsxs(_Fragment, { children: ["Create account", _jsx(ArrowRight, { className: "h-5 w-5 ml-2" })] })) })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Already have an account?" }) })] }), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/login", className: "w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200", children: "Sign in to your account" }) })] })] }), _jsx("div", { className: "mt-8 text-center", children: _jsx("p", { className: "text-xs text-gray-500", children: "Secure registration with bank-level encryption" }) })] })] }) })] }));
}
