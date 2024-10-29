import { createContext, useState } from "react";

const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setError(""); // Clear error when user types
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(loginData.email) && loginData.password.length >= 6;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setError("Please enter valid email and password");
            return;
        }

        setLoading(true);
        try {
            // API call would go here
            console.log('Logging in with:', loginData);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // On success, you would typically:
            // 1. Store auth token
            // 2. Update user context
            // 3. Redirect to dashboard
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContext.Provider
            value={{
                loginData,
                error,
                loading,
                handleChange,
                handleLogin,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContext;