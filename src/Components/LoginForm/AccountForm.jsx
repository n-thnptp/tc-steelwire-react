import React, { useState, useRef } from "react";
import FormInput from "./FormInput";
import { Button } from '@material-tailwind/react';
import { FileUploader } from 'react-drag-drop-files';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiLogoutBoxFill } from "react-icons/ri";
import { RiContractRightLine } from "react-icons/ri";
import { FaCheck, FaTimes } from "react-icons/fa";
import useFormContext from "../Hooks/useFormContext";

// Updated Tooltip component with requirement list support
const ValidationTooltip = ({ show, message, requirements }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    React.useEffect(() => {
        let timeoutId;
        if (show) {
            // Small delay to ensure CSS transition works
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 50);
        } else {
            setIsVisible(false);
        }
        return () => clearTimeout(timeoutId);
    }, [show]);
    
    if (!show && !isVisible) return null;
    
    const baseTooltipClasses = "absolute z-10 transform translate-y-full left-0 transition-all duration-200 ease-in-out";
    const visibilityClasses = isVisible ? "opacity-100 translate-y-full" : "opacity-0 translate-y-[calc(100%+8px)]";
    
    if (requirements) {
        return (
            <div className={`${baseTooltipClasses} ${visibilityClasses} px-4 py-3 text-sm bg-white border rounded shadow-lg -bottom-1 w-full`}>
                <div className="absolute -top-2 left-4 w-3 h-3 bg-white border-t border-l transform rotate-45 -mt-[1px]" />
                <ul className="space-y-1">
                    {Object.entries(requirements).map(([key, { met, text }]) => (
                        <li key={key} className="flex items-center gap-2">
                            {met ? (
                                <FaCheck className="text-green-500 w-4 h-4" />
                            ) : (
                                <FaTimes className="text-red-500 w-4 h-4" />
                            )}
                            <span className={met ? 'text-green-500' : 'text-red-500'}>
                                {text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    
    return message ? (
        <div className={`${baseTooltipClasses} ${visibilityClasses} px-3 py-2 text-sm text-white bg-red-500 rounded shadow-lg -bottom-1`}>
            <div className="absolute -top-2 left-4 w-3 h-3 bg-red-500 transform rotate-45" />
            {message}
        </div>
    ) : null;
};

const FileTypes = ["JPG", "JPEG", "PNG"];

const AccountForm = () => {
    const { data, handleChange, handleFileChange, page, setPage } = useFormContext();
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [focusedField, setFocusedField] = useState(null);
    const focusTimeoutRef = useRef(null);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: { met: false, text: 'At least 8 characters' },
        uppercase: { met: false, text: 'One uppercase letter' },
        lowercase: { met: false, text: 'One lowercase letter' },
        number: { met: false, text: 'One number' },
        special: { met: false, text: 'One special character' },
    });

    // Clear timeout on unmount
    React.useEffect(() => {
        return () => {
            if (focusTimeoutRef.current) {
                clearTimeout(focusTimeoutRef.current);
            }
        };
    }, []);

    const validateUsername = (username) => {
        if (!username) return 'Username is required';
        if (username.length < 3) return 'Username must be at least 3 characters';
        if (username.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const checkPasswordRequirements = (password) => {
        const requirements = {
            length: { met: password.length >= 8, text: 'At least 8 characters' },
            uppercase: { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
            lowercase: { met: /[a-z]/.test(password), text: 'One lowercase letter' },
            number: { met: /[0-9]/.test(password), text: 'One number' },
            special: { met: /[!@#$%^&*]/.test(password), text: 'One special character' },
        };
        
        setPasswordRequirements(requirements);
        
        return Object.values(requirements).every(req => req.met) ? '' : 'Password requirements not met';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);

        let errorMessage = '';
        switch (name) {
            case 'username':
                errorMessage = validateUsername(value);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = checkPasswordRequirements(value);
                if (data.confirmPassword) {
                    setErrors(prev => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(data.confirmPassword, value)
                    }));
                }
                break;
            case 'confirmPassword':
                errorMessage = validateConfirmPassword(value, data.password);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const handleFocus = (fieldName) => {
        // Clear any existing timeout
        if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current);
            focusTimeoutRef.current = null;
        }
        
        setFocusedField(fieldName);
        if (fieldName === 'password' && data.password) {
            checkPasswordRequirements(data.password);
        }
    };

    const handleBlur = (fieldName) => {
        // Set timeout and store the reference
        focusTimeoutRef.current = setTimeout(() => {
            // Only update if we're still focused on this field
            if (focusedField === fieldName) {
                setFocusedField(null);
            }
            
            let errorMessage = '';
            switch (fieldName) {
                case 'username':
                    errorMessage = validateUsername(data.username || '');
                    break;
                case 'email':
                    errorMessage = validateEmail(data.email || '');
                    break;
                case 'password':
                    errorMessage = checkPasswordRequirements(data.password || '');
                    break;
                case 'confirmPassword':
                    errorMessage = validateConfirmPassword(data.confirmPassword || '', data.password || '');
                    break;
                default:
                    break;
            }
            
            setErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage
            }));
        }, 200); // Increased timeout for smoother transitions
    };

    const handleNext = (e) => {
        e.preventDefault();
        
        const newErrors = {
            username: validateUsername(data.username),
            email: validateEmail(data.email),
            password: checkPasswordRequirements(data.password),
            confirmPassword: validateConfirmPassword(data.confirmPassword, data.password)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        if (!hasErrors) {
            setPage(prev => prev + 1);
        } else {
            const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
            setFocusedField(firstErrorField);
        }
    };

    return (
        <form onSubmit={handleNext} className="flex flex-col rounded-3xl bg-neutral-white">
            <div className="px-24 pt-10">
                <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 text-primary-700">
                    Step 1
                </h1>

                <div className="mb-5 drag-and-drop">
                    <FileUploader
                        multiple={false}
                        handleChange={handleFileChange}
                        name="profileImage"
                        types={FileTypes}
                    />
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <FormInput
                            name="username"
                            type="text"
                            placeholder="Username"
                            icon={FaUser}
                            value={data.username || ""}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('username')}
                            onBlur={() => handleBlur('username')}
                            required
                        />
                        <ValidationTooltip 
                            show={focusedField === 'username'} 
                            message={errors.username}
                        />
                    </div>

                    <div className="relative">
                        <FormInput
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon={MdEmail}
                            value={data.email || ""}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            required
                        />
                        <ValidationTooltip 
                            show={focusedField === 'email'} 
                            message={errors.email}
                        />
                    </div>

                    <div className="relative">
                        <FormInput
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon={RiLockPasswordFill}
                            value={data.password || ""}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            required
                        />
                        <ValidationTooltip 
                            show={focusedField === 'password'}
                            requirements={passwordRequirements}
                        />
                    </div>

                    <div className="relative">
                        <FormInput
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            icon={RiLockPasswordFill}
                            value={data.confirmPassword || ""}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('confirmPassword')}
                            onBlur={() => handleBlur('confirmPassword')}
                            required
                        />
                        <ValidationTooltip 
                            show={focusedField === 'confirmPassword'} 
                            message={errors.confirmPassword}
                        />
                    </div>
                </div>

                <div className="mt-2 flex justify-center">
                    <button
                        type="submit"
                        className="primary-buttons inline-flex w-3/4 items-center justify-center gap-2"
                    >
                        Continue <RiContractRightLine className="text-accent-900" />
                    </button>
                </div>
            </div>

            <div className="px-10">
                <div className="mt-7 line separator"> OR </div>

                <div className="grid grid-cols-2 gap-5 mt-7">
                    <Button
                        href="#"
                        size="lg"
                        color="white"
                        className="flex items-center justify-center"
                    >
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                            className="w-8 h-8" 
                            alt="Google logo"
                        />
                    </Button>

                    <Button
                        href="#"
                        size="lg"
                        color="white"
                        className="flex items-center justify-center"
                    >
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Facebook_icon_2013.svg" 
                            className="w-8 h-8" 
                            alt="Facebook logo"
                        />
                    </Button>
                </div>

                <div className="flex py-8 gap-2 font-inter text-sm items-center justify-center text-accent-600">
                    <div>Already have an account ?</div>
                    <a href="#" className="button-underline inline-flex items-center justify-center gap-1">
                        <RiLogoutBoxFill className="text-xl"/> Login
                    </a>
                </div>
            </div>
        </form>
    );
};

export default AccountForm;