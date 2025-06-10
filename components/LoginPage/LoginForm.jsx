import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import LoginContext from '../Context/LoginContext';
import FormInput from './FormInput';

const LoginForm = () => {
    const router = useRouter();
    const { login, loading, error } = useContext(LoginContext);
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(credentials);
    };

    return (
        <form onSubmit={handleLogin}>
            <FormInput
                name="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleChange}
                required
            />
            <FormInput
                name="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm; 