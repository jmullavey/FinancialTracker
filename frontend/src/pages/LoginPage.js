import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    // Detect autofill and mark inputs with .filled class
    useEffect(() => {
        const emailInput = emailInputRef.current;
        const passwordInput = passwordInputRef.current;
        if (!emailInput || !passwordInput)
            return;
        const checkInput = (input) => {
            // Check if input has value (including autofill)
            const hasValue = input.value.length > 0;
            // Try to detect webkit autofill (may not work in all browsers)
            let isAutofilled = false;
            try {
                isAutofilled = input.matches ? input.matches(':-webkit-autofill') : false;
            }
            catch (e) {
                // matches() may throw in some browsers
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
            if (emailInput)
                checkInput(emailInput);
            if (passwordInput)
                checkInput(passwordInput);
        };
        // Initial check
        checkAll();
        // Listen for input changes
        const handleEmailInput = () => checkInput(emailInput);
        const handlePasswordInput = () => checkInput(passwordInput);
        emailInput.addEventListener('input', handleEmailInput);
        passwordInput.addEventListener('input', handlePasswordInput);
        // Detect autofill via animationstart (most reliable)
        const handleAnimationStart = (e) => {
            if (e.animationName === 'onAutoFillStart') {
                setTimeout(checkAll, 10);
            }
        };
        document.addEventListener('animationstart', handleAnimationStart);
        // Check on focus/blur
        const handleEmailFocus = () => setTimeout(() => checkInput(emailInput), 50);
        const handleEmailBlur = () => checkInput(emailInput);
        const handlePasswordFocus = () => setTimeout(() => checkInput(passwordInput), 50);
        const handlePasswordBlur = () => checkInput(passwordInput);
        emailInput.addEventListener('focus', handleEmailFocus);
        emailInput.addEventListener('blur', handleEmailBlur);
        passwordInput.addEventListener('focus', handlePasswordFocus);
        passwordInput.addEventListener('blur', handlePasswordBlur);
        // Periodic check for delayed autofill (especially Chrome/Edge/Safari)
        let checkInterval = null;
        const startPeriodicCheck = () => {
            if (checkInterval)
                return;
            checkInterval = setInterval(() => {
                checkAll();
                // Stop checking after autofill is typically complete
                if (emailInput.value && passwordInput.value) {
                    if (checkInterval) {
                        clearInterval(checkInterval);
                        checkInterval = null;
                    }
                }
            }, 100);
            // Stop after 3 seconds max
            setTimeout(() => {
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
            }, 3000);
        };
        // Start periodic check on page load and window focus
        startPeriodicCheck();
        window.addEventListener('focus', () => {
            checkAll();
            startPeriodicCheck();
        });
        return () => {
            emailInput.removeEventListener('input', handleEmailInput);
            passwordInput.removeEventListener('input', handlePasswordInput);
            document.removeEventListener('animationstart', handleAnimationStart);
            emailInput.removeEventListener('focus', handleEmailFocus);
            emailInput.removeEventListener('blur', handleEmailBlur);
            passwordInput.removeEventListener('focus', handlePasswordFocus);
            passwordInput.removeEventListener('blur', handlePasswordBlur);
            window.removeEventListener('focus', startPeriodicCheck);
            if (checkInterval) {
                clearInterval(checkInterval);
            }
        };
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 login-page", children: [_jsxs("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50", children: [_jsx("div", { className: "absolute inset-0 opacity-30", style: {
                            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
                            backgroundSize: '40px 40px'
                        } }), _jsx("div", { className: "absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl" }), _jsx("div", { className: "absolute top-40 right-32 w-48 h-48 bg-indigo-200 rounded-full opacity-15 blur-xl" }), _jsx("div", { className: "absolute bottom-32 left-40 w-40 h-40 bg-purple-200 rounded-full opacity-25 blur-xl" }), _jsx("div", { className: "absolute bottom-20 right-20 w-36 h-36 bg-blue-300 rounded-full opacity-20 blur-xl" }), _jsx("div", { className: "absolute top-1/3 left-10 w-96 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30" }), _jsx("div", { className: "absolute top-1/4 right-10 w-80 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-25" }), _jsx("div", { className: "absolute bottom-1/3 left-20 w-72 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-35" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80" })] }), _jsx("div", { className: "w-full max-w-6xl relative z-10", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center", children: [_jsx("div", { className: "hidden lg:block", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center mb-8", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-7 w-7 text-white" }) }), _jsx("span", { className: "ml-3 text-2xl font-bold text-gray-900", children: "FinanceTracker" })] }), _jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-6", children: ["Take control of your", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600", children: " finances" })] }), _jsx("p", { className: "text-lg text-gray-600 mb-8", children: "Track expenses, manage budgets, and achieve your financial goals with our intuitive platform." }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4", children: _jsx(Shield, { className: "h-4 w-4 text-green-600" }) }), _jsx("span", { className: "text-gray-700", children: "Bank-level security" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4", children: _jsx(Zap, { className: "h-4 w-4 text-blue-600" }) }), _jsx("span", { className: "text-gray-700", children: "Real-time insights" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4", children: _jsx(TrendingUp, { className: "h-4 w-4 text-purple-600" }) }), _jsx("span", { className: "text-gray-700", children: "Smart analytics" })] })] })] }) }), _jsxs("div", { className: "w-full max-w-md mx-auto", children: [_jsxs("div", { className: "lg:hidden flex items-center justify-center mb-8", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-6 w-6 text-white" }) }), _jsx("span", { className: "ml-2 text-xl font-bold text-gray-900", children: "FinanceTracker" })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Welcome back" }), _jsx("p", { className: "text-gray-600", children: "Sign in to your account to continue" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: emailInputRef, id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => {
                                                                setEmail(e.target.value);
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, onFocus: (e) => {
                                                                e.target.classList.add('focused');
                                                            }, onBlur: (e) => {
                                                                e.target.classList.remove('focused');
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, className: "floating-input w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "email", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Email address" })] }), _jsxs("div", { className: "floating-input-wrapper relative", children: [_jsx("input", { ref: passwordInputRef, id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", required: true, value: password, onChange: (e) => {
                                                                setPassword(e.target.value);
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, onFocus: (e) => {
                                                                e.target.classList.add('focused');
                                                            }, onBlur: (e) => {
                                                                e.target.classList.remove('focused');
                                                                if (e.target.value.length > 0) {
                                                                    e.target.classList.add('filled');
                                                                }
                                                                else {
                                                                    e.target.classList.remove('filled');
                                                                }
                                                            }, className: "floating-input w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm placeholder:opacity-0", placeholder: " " }), _jsx("label", { htmlFor: "password", className: "floating-label absolute left-4 pointer-events-none origin-left", children: "Password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "h-5 w-5" }) : _jsx(Eye, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-700", children: "Remember me" })] }), _jsx("div", { className: "text-sm", children: _jsx("a", { href: "#", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Forgot password?" }) })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 mr-2 animate-spin" }), "Signing in..."] })) : (_jsxs(_Fragment, { children: ["Sign in", _jsx(ArrowRight, { className: "h-5 w-5 ml-2" })] })) })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "New to FinanceTracker?" }) })] }), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/register", className: "w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200", children: "Create your account" }) })] })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["By signing in, you agree to our", ' ', _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-500", children: "Terms of Service" }), ' ', "and", ' ', _jsx("a", { href: "#", className: "text-blue-600 hover:text-blue-500", children: "Privacy Policy" })] }) })] })] }) })] }));
}
