import { createContext, useState } from "react";
import { useRouter } from 'next/router';

// Create the context with default values
export const FormContext = createContext({
    page: 0,
    setPage: () => { },
    data: {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        profileImage: null,
        companyName: "",
        phoneNumber: "",
        address: "",
        province: "",
        amphur: "",
        tambon: "",
        postcode: "",
    },
    error: "",
    loading: false,
    showLoginPrompt: false,
    locationOptions: {
        provinces: [],
        amphurs: [],
        tambons: []
    },
    loadingStates: {
        provinces: false,
        amphurs: false,
        tambons: false
    },
    handleChange: () => { },
    handleSubmit: () => { },
    navigateToLogin: () => { },
    disableNext: true,
    disablePrev: true,
    fetchProvinces: () => { },
});

export const FormProvider = ({ children }) => {
    const router = useRouter();

    // Add all missing state definitions
    const [page, setPage] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Initialize locationOptions state
    const [locationOptions, setLocationOptions] = useState({
        provinces: [],
        amphurs: [],
        tambons: []
    });

    // Initialize loadingStates state
    const [loadingStates, setLoadingStates] = useState({
        provinces: false,
        amphurs: false,
        tambons: false
    });

    // Initialize form data state
    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        profileImage: null,
        companyName: "",
        phoneNumber: "",
        address: "",
        province: "",
        amphur: "",
        tambon: "",
        postcode: "",
    });

    const fetchProvinces = async () => {
        setLoadingStates(prev => ({ ...prev, provinces: true }));
        try {
            const response = await fetch('/api/locations/provinces/all');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch provinces');
            }

            const data = await response.json();

            // Group provinces by geography if needed
            const groupedProvinces = data.reduce((acc, province) => {
                if (!acc[province.geography]) {
                    acc[province.geography] = [];
                }
                acc[province.geography].push(province);
                return acc;
            }, {});

            // Update state with the fetched provinces
            setLocationOptions(prev => ({
                ...prev,
                provinces: Array.isArray(data) ? data : [],
                // You can also store the grouped data if needed
                provincesByGeography: groupedProvinces
            }));

            // Clear dependent fields
            setData(prev => ({
                ...prev,
                province: "",
                amphur: "",
                tambon: ""
            }));

        } catch (error) {
            console.error('Error fetching provinces:', error);
            setError('Failed to load provinces. Please try again.');
            setLocationOptions(prev => ({
                ...prev,
                provinces: []
            }));
        } finally {
            setLoadingStates(prev => ({ ...prev, provinces: false }));
        }
    };

    const fetchAmphurs = async (provinceId) => {
        if (!provinceId) {
            setLocationOptions(prev => ({ ...prev, amphurs: [], tambons: [] }));
            setData(prev => ({ ...prev, amphur: "", tambon: "" }));
            return;
        }

        setLoadingStates(prev => ({ ...prev, amphurs: true }));
        try {
            const response = await fetch(`/api/locations/provinces/${provinceId}`);
            if (!response.ok) throw new Error('Failed to fetch amphurs');
            const data = await response.json();

            setLocationOptions(prev => ({
                ...prev,
                amphurs: Array.isArray(data) ? data : [],
                tambons: []
            }));
            setData(prev => ({ ...prev, amphur: "", tambon: "" }));
        } catch (error) {
            console.error('Error fetching amphurs:', error);
            setLocationOptions(prev => ({ ...prev, amphurs: [], tambons: [] }));
        } finally {
            setLoadingStates(prev => ({ ...prev, amphurs: false }));
        }
    };

    const fetchTambons = async (amphurId) => {
        if (!amphurId) {
            setLocationOptions(prev => ({ ...prev, tambons: [] }));
            setData(prev => ({ ...prev, tambon: "" }));
            return;
        }

        setLoadingStates(prev => ({ ...prev, tambons: true }));
        try {
            const response = await fetch(`/api/locations/amphurs/${amphurId}`);
            if (!response.ok) throw new Error('Failed to fetch tambons');
            const data = await response.json();
            setLocationOptions(prev => ({ ...prev, tambons: Array.isArray(data) ? data : [] }));
            setData(prev => ({ ...prev, tambon: "" }));
        } catch (error) {
            console.error('Error fetching tambons:', error);
            setLocationOptions(prev => ({ ...prev, tambons: [] }));
        } finally {
            setLoadingStates(prev => ({ ...prev, tambons: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Handle cascading dropdowns
        if (name === 'province') {
            fetchAmphurs(value);
        } else if (name === 'amphur') {
            fetchTambons(value);
        }

        setError('');
        setShowLoginPrompt(false);
    };

    const handleFileChange = (file) => {
        setData(prevData => ({
            ...prevData,
            profileImage: file
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setShowLoginPrompt(false);

        try {
            const registrationData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                companyName: data.companyName,
                phoneNumber: data.phoneNumber,
                address: data.address,
                province: data.province,
                amphur: data.amphur,
                tambon: data.tambon,
                postcode: data.postcode
            };


            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            // First try to get the response as JSON
            let result;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                // If not JSON, get the response as text for debugging
                const textResult = await response.text();
                console.error('Received non-JSON response:', textResult);
                throw new Error('Received invalid response from server');
            }

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            // Success
            setPage(2);

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'An error occurred during registration');
            if (err.message.includes('already exists')) {
                setShowLoginPrompt(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.push('/login');
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

    const validateFirstPage = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            emailRegex.test(data.email) &&
            data.password.length >= 6 &&
            data.password === data.confirmPassword &&
            data.firstName.length > 0 &&
            data.lastName.length > 0
        );
    };

    const validateSecondPage = () => {
        return (
            data.phoneNumber.length >= 10 &&
            data.address.length >= 5 &&
            data.province &&
            data.amphur &&
            data.tambon &&
            data.postcode.length >= 4 &&
            (data.companyName.length >= 2 || data.companyName === "")
        );
    };

    return (
        <FormContext.Provider
            value={{
                page,
                setPage,
                data,
                error,
                loading,
                showLoginPrompt,
                handleChange,
                handleFileChange,
                handleSubmit,
                navigateToLogin: () => router.push('/login'),
                disableNext: disableNext(),
                disablePrev: page === 0,
                locationOptions,
                loadingStates,
                fetchProvinces,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export default FormContext;
