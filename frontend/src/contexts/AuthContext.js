import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        }
        else {
            setLoading(false);
        }
    }, []);
    const loadUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.user);
        }
        catch (error) {
            console.error('Failed to load user:', error);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
        finally {
            setLoading(false);
        }
    };
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        }
        catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };
    const register = async (email, password, firstName, lastName) => {
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                firstName,
                lastName
            });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        }
        catch (error) {
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, register, logout }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
