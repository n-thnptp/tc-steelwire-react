import React from 'react';
import useLoginContext from '../Hooks/useLoginContext';
import FormInput from './FormInput';
import { IoMdMail } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const LoginForm = () => {
    const { 
        loginData, 
        error, 
        loading, 
        showSignupPrompt,
        handleChange, 
        handleLogin,
        navigateToSignup 
    } = useLoginContext();

    return (
        <div className="min-h-screen relative">
            {/* Back Button */}
            <a 
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-neutral-white 
                         hover:text-neutral-gray-300 transition-colors duration-200"
            >
                <IoArrowBack className="text-xl" />
                <span className="font-medium">Back to Home</span>
            </a>

            {/* Login Form */}
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-primary-700 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <FormInput
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={handleChange}
                            icon={IoMdMail}
                            title="Email"
                            required
                        />

                        <FormInput
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={handleChange}
                            icon={FaLock}
                            title="Password"
                            required
                        />

                        {error && (
                            <div className="mb-4 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-3 rounded-md font-medium
                                     hover:bg-primary-700 transition-colors duration-200
                                     disabled:bg-primary-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button 
                                onClick={navigateToSignup}
                                className="button-underline font-medium"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;