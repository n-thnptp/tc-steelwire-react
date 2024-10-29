import React, { useState, useEffect } from 'react';

const EditAddress = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        address: '',
        province: '',
        amphur: '',
        tambon: '',
        postalCode: ''
    });

    const [locationOptions, setLocationOptions] = useState({
        provinces: [],
        amphurs: [],
        tambons: []
    });

    const [loadingStates, setLoadingStates] = useState({
        provinces: false,
        amphurs: false,
        tambons: false,
        initial: true
    });

    const [errors, setErrors] = useState({});

    // Fetch initial user data and address details
    useEffect(() => {
        const fetchUserAddressDetails = async () => {
            try {
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const data = await response.json();
                    const user = data.user;

                    // Set initial form data
                    setFormData({
                        address: user.address || '',
                        province: user.province_id || '',
                        amphur: user.amphur_id || '',
                        tambon: user.tambon_id || '',
                        postalCode: user.postalCode || ''
                    });

                    // Fetch provinces and then cascade to other dropdowns
                    await fetchProvinces();

                    if (user.province_id) {
                        await fetchAmphurs(user.province_id);
                    }

                    if (user.amphur_id) {
                        await fetchTambons(user.amphur_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoadingStates(prev => ({ ...prev, initial: false }));
            }
        };

        fetchUserAddressDetails();
    }, []);

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
            setFormData(prev => ({
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
            setFormData(prev => ({ ...prev, amphur: "", tambon: "" }));
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
            setFormData(prev => ({ ...prev, amphur: "", tambon: "" }));
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
            setFormData(prev => ({ ...prev, tambon: "" }));
            return;
        }

        setLoadingStates(prev => ({ ...prev, tambons: true }));
        try {
            const response = await fetch(`/api/locations/amphurs/${amphurId}`);
            if (!response.ok) throw new Error('Failed to fetch tambons');
            const data = await response.json();
            setLocationOptions(prev => ({ ...prev, tambons: Array.isArray(data) ? data : [] }));
            setFormData(prev => ({ ...prev, tambon: "" }));
        } catch (error) {
            console.error('Error fetching tambons:', error);
            setLocationOptions(prev => ({ ...prev, tambons: [] }));
        } finally {
            setLoadingStates(prev => ({ ...prev, tambons: false }));
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));

        if (name === 'province') {
            setFormData(prev => ({ ...prev, amphur: '', tambon: '', postalCode: '' }));
            if (value) {
                await fetchAmphurs(value);
            } else {
                setLocationOptions(prev => ({ ...prev, amphurs: [], tambons: [] }));
            }
        }

        if (name === 'amphur') {
            setFormData(prev => ({ ...prev, tambon: '', postalCode: '' }));
            if (value) {
                await fetchTambons(value);
            } else {
                setLocationOptions(prev => ({ ...prev, tambons: [] }));
            }
        }

        if (name === 'tambon' && value) {
            const selectedTambon = locationOptions.tambons.find(t => t.id === parseInt(value));
            if (selectedTambon) {
                setFormData(prev => ({ ...prev, postalCode: selectedTambon.zip_code.toString() }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.province) newErrors.province = 'Province is required';
        if (!formData.amphur) newErrors.amphur = 'Amphur is required';
        if (!formData.tambon) newErrors.tambon = 'Tambon is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add this log
        console.log('Submitting form with data:', formData);

        if (validateForm()) {
            try {
                const tambonIdNum = parseInt(formData.tambon);
                if (isNaN(tambonIdNum)) {
                    setErrors(prev => ({ ...prev, tambon: 'Invalid tambon ID' }));
                    return;
                }

                const response = await fetch('/api/user/update-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address: formData.address,
                        tambonId: tambonIdNum
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update address');
                }

                const data = await response.json();
                if (data.success) {
                    onSave(data.user);  // This is passing the entire user object
                    onClose();
                }

            } catch (error) {
                console.error('Update error:', error);
                setErrors(prev => ({ ...prev, submit: error.message }));
            }
        }
    };


    if (loadingStates.initial) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-[#603F26] font-inter mb-6 text-center">
                    ADDRESS INFORMATION
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">
                            ADDRESS
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">
                            PROVINCE
                        </label>
                        <select
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                            disabled={loadingStates.provinces}
                        >
                            <option value="">Select Province</option>
                            {locationOptions.provinces.map(province => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                        {errors.province && (
                            <p className="mt-1 text-sm text-red-500">{errors.province}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">
                            AMPHUR
                        </label>
                        <select
                            name="amphur"
                            value={formData.amphur}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                            disabled={!formData.province || loadingStates.amphurs}
                        >
                            <option value="">Select Amphur</option>
                            {locationOptions.amphurs.map(amphur => (
                                <option key={amphur.id} value={amphur.id}>
                                    {amphur.name}
                                </option>
                            ))}
                        </select>
                        {errors.amphur && (
                            <p className="mt-1 text-sm text-red-500">{errors.amphur}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">
                            TAMBON
                        </label>
                        <select
                            name="tambon"
                            value={formData.tambon}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                            disabled={!formData.amphur || loadingStates.tambons}
                        >
                            <option value="">Select Tambon</option>
                            {locationOptions.tambons.map(tambon => (
                                <option key={tambon.id} value={tambon.id}>
                                    {tambon.name}
                                </option>
                            ))}
                        </select>
                        {errors.tambon && (
                            <p className="mt-1 text-sm text-red-500">{errors.tambon}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">
                            POSTAL CODE
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26] bg-gray-100"
                            readOnly
                        />
                    </div>

                    {errors.submit && (
                        <div className="mb-4 text-red-500 text-sm text-center">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-[#6A462F] text-[#FFDBB5] py-3 rounded-full font-bold w-[60%] text-center shadow-lg hover:bg-[#5A3C2F]"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddress;