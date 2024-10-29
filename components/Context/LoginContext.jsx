import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/router';

const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Start with loading true
    const [user, setUser] = useState(null);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const validateSession = async () => {
            const data = await (await fetch('/api/auth/validate')).json();
            console.log(data);
            setUser(data.user);
            setLoading(false)
            // try {
            //     const response = await fetch('/api/auth/validate');
            //     if (response.ok) {
            //         const userData = await response.json();
            //         setUser(userData.user);
            //     } else {
            //         console.error("Fetching /api/auth/validate failed")
            //     }
            // } catch (err) {
            //     // Only log unexpected errors
            //     if (!err.message.includes('failed with status 401')) {
            //         console.error('Session validation error:', err);
            //     }
            //     setUser(null);
            // } finally {
            //     setLoading(false); // Always set loading to false when done
            // }
        };

        validateSession();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setError("");
        setShowSignupPrompt(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setShowSignupPrompt(false);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            if (!data.success) {
                if (data.code === 'ACCOUNT_NOT_FOUND') {
                    setShowSignupPrompt(true);
                }
                throw new Error(data.message || data.error || 'Login failed');
            }

            // Validate session to get user data
            // const userResponse = await fetch('/api/auth/validate');

            // if (!userResponse.ok) {
            //     throw new Error("Oh no! Something went wrong in the back end.")
            // }
            // const userData = await userResponse.json();
            // if (!userData.success) {
            //     throw new Error("Oh no! Something went wrong in the back end.")
            // }
            // setUser(userData);
            router.push('/');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
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