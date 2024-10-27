import React, { useState, useRef, useEffect } from 'react';
import FormInput from './FormInput';
import { RiContractRightLine } from "react-icons/ri";
import useFormContext from "../Hooks/useFormContext";

// Reusing the ValidationTooltip component
const ValidationTooltip = ({ show, message }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    React.useEffect(() => {
        let timeoutId;
        if (show) {
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
    
    return message ? (
        <div className={`${baseTooltipClasses} ${visibilityClasses} px-3 py-2 text-sm text-white bg-red-500 rounded shadow-lg -bottom-1`}>
            <div className="absolute -top-2 left-4 w-3 h-3 bg-red-500 transform rotate-45" />
            {message}
        </div>
    ) : null;
};

const CompanyForm = () => {
    const { data, handleChange, setPage, handleSubmit } = useFormContext();
    const [errors, setErrors] = useState({
        companyName: '',
        phoneNumber: '',
        address: '',
        city: '',
        postcode: ''
    });
    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const focusTimeoutRef = useRef(null);
    const submitTimeoutRef = useRef(null);

    // Clear timeouts on unmount
    useEffect(() => {
        return () => {
            if (focusTimeoutRef.current) {
                clearTimeout(focusTimeoutRef.current);
            }
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    // Effect to handle focusing input when error is shown after submit
    useEffect(() => {
        if (isSubmitting && focusedField) {
            const input = document.querySelector(`input[name="${focusedField}"], textarea[name="${focusedField}"]`);
            if (input) {
                input.focus();
            }
        }
    }, [isSubmitting, focusedField]);

    // Validation functions remain the same...
    const validateCompanyName = (value) => {
        if (!value) return 'Company name is required';
        if (value.length < 2) return 'Company name must be at least 2 characters';
        if (value.length > 100) return 'Company name must be less than 100 characters';
        return '';
    };

    const validatePhoneNumber = (value) => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-+()]{10,}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return '';
    };

    const validateAddress = (value) => {
        if (!value) return 'Address is required';
        if (value.length < 5) return 'Address must be at least 5 characters';
        if (value.length > 200) return 'Address must be less than 200 characters';
        return '';
    };

    const validateCity = (value) => {
        if (!value) return 'City is required';
        if (value.length < 2) return 'City must be at least 2 characters';
        if (value.length > 50) return 'City must be less than 50 characters';
        return '';
    };

    const validatePostcode = (value) => {
        if (!value) return 'Postcode is required';
        const postcodeRegex = /^[A-Za-z0-9\s-]{4,10}$/;
        if (!postcodeRegex.test(value)) return 'Please enter a valid postcode';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);
        setIsSubmitting(false);

        let errorMessage = '';
        switch (name) {
            case 'companyName':
                errorMessage = validateCompanyName(value);
                break;
            case 'phoneNumber':
                errorMessage = validatePhoneNumber(value);
                break;
            case 'address':
                errorMessage = validateAddress(value);
                break;
            case 'city':
                errorMessage = validateCity(value);
                break;
            case 'postcode':
                errorMessage = validatePostcode(value);
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
        if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current);
            focusTimeoutRef.current = null;
        }
        if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current);
            submitTimeoutRef.current = null;
        }
        
        setFocusedField(fieldName);
    };

    const handleBlur = (fieldName) => {
        // Only set blur timeout if we're not in submit mode
        if (!isSubmitting) {
            focusTimeoutRef.current = setTimeout(() => {
                if (focusedField === fieldName) {
                    setFocusedField(null);
                }
                
                let errorMessage = '';
                switch (fieldName) {
                    case 'companyName':
                        errorMessage = validateCompanyName(data.companyName || '');
                        break;
                    case 'phoneNumber':
                        errorMessage = validatePhoneNumber(data.phoneNumber || '');
                        break;
                    case 'address':
                        errorMessage = validateAddress(data.address || '');
                        break;
                    case 'city':
                        errorMessage = validateCity(data.city || '');
                        break;
                    case 'postcode':
                        errorMessage = validatePostcode(data.postcode || '');
                        break;
                    default:
                        break;
                }
                
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: errorMessage
                }));
            }, 200);
        }
    };

    const handlePrev = () => {
        setIsSubmitting(false);
        setPage(prev => prev - 1);
    };

    const handleSubmitForm = () => {
        setIsSubmitting(true);
        
        const newErrors = {
            companyName: validateCompanyName(data.companyName),
            phoneNumber: validatePhoneNumber(data.phoneNumber),
            address: validateAddress(data.address),
            city: validateCity(data.city),
            postcode: validatePostcode(data.postcode)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        if (!hasErrors) {
            setIsSubmitting(false);
            handleSubmit();
        } else {
            const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
            setFocusedField(firstErrorField);
        }
    };

    return (
        <div className="flex flex-col rounded-3xl bg-neutral-white px-20 py-10">
            <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 text-primary-700">
                Step 2
            </h1>
            
            <div className="flex flex-col">
                <div className="relative">
                    <FormInput
                        name="companyName"
                        title="Company Name"
                        type="text"
                        placeholder="Company Name"
                        value={data.companyName || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('companyName')}
                        onBlur={() => handleBlur('companyName')}
                        required
                    />
                    <ValidationTooltip 
                        show={focusedField === 'companyName'} 
                        message={errors.companyName}
                    />
                </div>

                <div className="relative">
                    <FormInput
                        name="phoneNumber"
                        title="Phone Number"
                        type="tel"
                        placeholder="Phone Number"
                        value={data.phoneNumber || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('phoneNumber')}
                        onBlur={() => handleBlur('phoneNumber')}
                        required
                    />
                    <ValidationTooltip 
                        show={focusedField === 'phoneNumber'} 
                        message={errors.phoneNumber}
                    />
                </div>

                <div className="relative">
                    <FormInput
                        name="address"
                        title="Address"
                        type="text"
                        isTextArea
                        placeholder="Address"
                        value={data.address || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('address')}
                        onBlur={() => handleBlur('address')}
                        required
                    />
                    <ValidationTooltip 
                        show={focusedField === 'address'} 
                        message={errors.address}
                    />
                </div>

                <div className="relative">
                    <FormInput
                        name="city"
                        title="City"
                        type="text"
                        placeholder="City"
                        value={data.city || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('city')}
                        onBlur={() => handleBlur('city')}
                        required
                    />
                    <ValidationTooltip 
                        show={focusedField === 'city'} 
                        message={errors.city}
                    />
                </div>

                <div className="relative">
                    <FormInput
                        name="postcode"
                        title="Postcode"
                        type="text"
                        placeholder="Postcode"
                        value={data.postcode || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('postcode')}
                        onBlur={() => handleBlur('postcode')}
                        required
                    />
                    <ValidationTooltip 
                        show={focusedField === 'postcode'} 
                        message={errors.postcode}
                    />
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between gap-4 mt-4">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="secondary-buttons w-full"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitForm}
                        className="primary-buttons inline-flex w-full items-center justify-center gap-2"
                    >
                        Submit <RiContractRightLine className="text-accent-900" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyForm;