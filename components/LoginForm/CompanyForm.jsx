import React, { useState, useRef, useEffect } from 'react';
import FormInput from './FormInput';
import { RiContractRightLine } from "react-icons/ri";
import useFormContext from "../Hooks/useFormContext";

const FormSelect = ({
    name,
    title,
    options = [], // Provide default empty array
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    loading,
    required
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {title} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={disabled || loading}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${disabled ? 'bg-gray-100' : 'bg-white'
                    }`}
                required={required}
            >
                <option value="">Select {title}</option>
                {loading ? (
                    <option value="" disabled>Loading...</option>
                ) : (
                    Array.isArray(options) && options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

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
    const {
        data,
        handleChange: handleContextChange,
        setPage,
        handleSubmit,
        loading,
        error: registrationError,
        showLoginPrompt,
        navigateToLogin,
        locationOptions,
        loadingStates,
        fetchProvinces,
    } = useFormContext();

    // Add useEffect to fetch provinces on mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    const [validationErrors, setValidationErrors] = useState({
        companyName: '',
        phoneNumber: '',
        address: '',
        province: '',
        amphur: '',
        tambon: '',
        postcode: ''
    });

    // Update validation functions
    const validateProvince = (value) => {
        if (!value) return 'Province is required';
        return '';
    };

    const validateAmphur = (value) => {
        console.log(`validating ${value}`)
        if (!value) return 'Amphur is required';
        return '';
    };

    const validateTambon = (value) => {
        if (!value) return 'Tambon is required';
        return '';
    };

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

    const validatePostcode = (value) => {
        if (!value) return 'Postcode is required';
        const postcodeRegex = /^[A-Za-z0-9\s-]{4,10}$/;
        if (!postcodeRegex.test(value)) return 'Please enter a valid postcode';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleContextChange(e);
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

        setValidationErrors(prev => ({
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

                setValidationErrors(prev => ({
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

    const handleSubmitForm = async () => {
        setIsSubmitting(true);

        const newValidationErrors = {
            companyName: validateCompanyName(data.companyName || ''),
            phoneNumber: validatePhoneNumber(data.phoneNumber || ''),
            address: validateAddress(data.address || ''),
            province: validateProvince(data.province || ''),
            amphur: validateAmphur(data.amphur || ''),
            tambon: validateTambon(data.tambon || ''),
            postcode: validatePostcode(data.postcode || '')
        };

        setValidationErrors(newValidationErrors);

        const hasValidationErrors = Object.values(newValidationErrors).some(error => error !== '');
        if (!hasValidationErrors) {
            await handleSubmit();
        } else {
            const firstErrorField = Object.keys(newValidationErrors).find(key => newValidationErrors[key]);
            setFocusedField(firstErrorField);
        }
    };

    return (
        <div className="flex flex-col rounded-3xl bg-neutral-white px-20 py-10">
            <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 text-primary-700">
                Step 2
            </h1>

            <div className="flex flex-col">
                {/* Form inputs remain the same but use validationErrors instead of errors */}
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
                        message={validationErrors.companyName}
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
                        message={validationErrors.phoneNumber}
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
                        message={validationErrors.address}
                    />
                </div>

                <div className="relative">
                    <FormSelect
                        name="province"
                        title="Province"
                        options={locationOptions.provinces}
                        value={data.province}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('province')}
                        onBlur={() => handleBlur('province')}
                        loading={loadingStates.provinces}
                        required
                        renderOption={(option) => (
                            <option key={option.id} value={option.id}>
                                {option.name} ({option.nameEn})
                            </option>
                        )}
                    />
                    <ValidationTooltip
                        show={focusedField === 'province'}
                        message={validationErrors.province}
                    />
                </div>

                <div className="relative">
                    <FormSelect
                        name="amphur"
                        title="Amphur"
                        options={locationOptions.amphurs}
                        value={data.amphur || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('amphur')}
                        onBlur={() => handleBlur('amphur')}
                        loading={loadingStates.amphurs}
                        disabled={!data.province}
                        required
                    />
                    <ValidationTooltip
                        show={focusedField === 'amphur'}
                        message={validationErrors.amphur}
                    />
                </div>

                <div className="relative">
                    <FormSelect
                        name="tambon"
                        title="Tambon"
                        options={locationOptions.tambons}
                        value={data.tambon || ""}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('tambon')}
                        onBlur={() => handleBlur('tambon')}
                        loading={loadingStates.tambons}
                        disabled={!data.amphur}
                        required
                    />
                    <ValidationTooltip
                        show={focusedField === 'tambon'}
                        message={validationErrors.tambon}
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
                        message={validationErrors.postcode}
                    />
                </div>

                {registrationError && (
                    <div className="mb-4 text-status-error text-sm text-center">
                        {registrationError}
                    </div>
                )}

                {showLoginPrompt && (
                    <div className="mb-4 text-center">
                        <p className="text-gray-600 mb-2">
                            Already have an account?
                        </p>
                        <button
                            type="button"
                            onClick={navigateToLogin}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Log in here
                        </button>
                    </div>
                )}

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
                        disabled={loading}
                        className="primary-buttons inline-flex w-full items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : (
                            <>
                                Submit <RiContractRightLine className="text-accent-900" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyForm;