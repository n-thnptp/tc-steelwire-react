import { createContext, useState } from "react";

const FormContext = createContext({});

export const FormProvider = ({ children }) => {
    const title = {
        0: "Account Info",
        1: "Company Info",
        2: "Registration Complete"
    };

    const [page, setPage] = useState(0);
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
        companyName: "",
        phoneNumber: "",
        address: "",
        city: "",
        postcode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('handleChange called with:', { name, value });
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (file) => {
        console.log('File changed:', file);
        setData(prevData => ({
            ...prevData,
            profileImage: file
        }));
    };

    const validateFirstPage = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            data.username.length >= 3 &&
            emailRegex.test(data.email) &&
            data.password.length >= 6 &&
            data.password === data.confirmPassword
        );
    };

    const validateSecondPage = () => {
        return (
            data.companyName.length >= 2 &&
            data.phoneNumber.length >= 10 &&
            data.address.length >= 5 &&
            data.city.length >= 2 &&
            data.postcode.length >= 4
        );
    };

    const handleSubmit = () => {
        // Submit logic here
        console.log('Submitting form data:', data);
        // API call would go here
        
        // Move to success page
        setPage(2);
    };

    const disableNext = () => {
        if (page === 0) {
            return !validateFirstPage();
        }
        if (page === 1) {
            return !validateSecondPage();
        }
        return true;
    };

    const disablePrev = page === 0;

    return (
        <FormContext.Provider
            value={{
                title,
                page,
                setPage,
                data,
                setData,
                handleChange,
                handleFileChange,
                handleSubmit,
                disablePrev,
                disableNext: disableNext(),
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export default FormContext;