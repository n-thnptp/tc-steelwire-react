import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';

const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');

                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
        setShowSignupPrompt(false);
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

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

            // Handle different response cases
            if (data.code === 'ACCOUNT_NOT_FOUND') {
                setError(data.message);
                setShowSignupPrompt(true);
                return;
            }

            if (data.code === 'INVALID_PASSWORD') {
                setError(data.message);
                return;
            }

            if (data.error && !data.code) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.success && data.user) {
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                await new Promise(resolve => setTimeout(resolve, 100));

                if (data.user.role_id === 2) {
                    
                    await router.replace('/manager/dashboard');
                } else if (data.user.role_id === 1) {
                    
                    await router.replace('/');
                } else {
                    
                    await router.replace('/');
                }
            }

        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again.');
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