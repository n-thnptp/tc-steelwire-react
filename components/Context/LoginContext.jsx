import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';

const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        }
        return null;
    });
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Handling input change:', name, value);
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
        setShowSignupPrompt(false);
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        console.log('Login attempt with data:', loginData);
        
        if (!loginData.email || !loginData.password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        setError('');
        setShowSignupPrompt(false);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.error) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.success && data.user) {
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (data.user.role_id === 2) {
                    console.log('Admin user detected, redirecting to dashboard');
                    await router.replace('/manager/dashboard');
                } else {
                    console.log('Regular user detected, redirecting to dashboard');
                    await router.replace('/dashboard');
                }
            }

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed');
            setShowSignupPrompt(error.message?.includes('not registered'));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            localStorage.removeItem('user');
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const navigateToSignup = () => {
        router.push('/signup');
    };

    return (
        <LoginContext.Provider
            value={{
                loginData,
                error,
                loading,
                user,
                showSignupPrompt,
                handleChange,
                handleLogin,
                handleLogout,
                navigateToSignup
            }}
        >
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContext;