import React, { useState, useEffect } from 'react';

const EditAddress = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        province: userData?.province_id || '',
        amphur: userData?.amphur_id || '',
        tambon: userData?.tambon_id || '',
        address: userData?.address || '',
        postalCode: userData?.zip_code || ''
    });

    const [locationOptions, setLocationOptions] = useState({
        provinces: [],
        amphurs: [],
        tambons: []
    });

    const [loadingStates, setLoadingStates] = useState({
        provinces: true,
        amphurs: false,
        tambons: false
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

                    // Set initial form data with IDs
                    setFormData({
                        address: user.address || '',
                        province: user.province_id || '',  // Use province_id
                        amphur: user.amphur_id || '',     // Use amphur_id
                        tambon: user.tambon_id || '',     // Use tambon_id
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
            setErrors(prev => ({ ...prev, submit: 'Failed to load provinces. Please try again.' }));
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tambon' && value) {
            const tambonId = parseInt(value);
            // const selectedTambon = locationOptions.tambons.find(
            //     tambon => tambon.tambon_id === tambonId
            // );
            const selectedTambon = locationOptions.tambons.find(
                tambon => tambon.id === parseInt(value)
            )
            console.log(selectedTambon);

            setFormData(prevData => ({
                ...prevData,
                tambon: value,
                postalCode: selectedTambon ? selectedTambon.zip_code : ''
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));

            // Handle cascading dropdowns after the state update
            if (name === 'province') {
                fetchAmphurs(value);
            } else if (name === 'amphur') {
                fetchTambons(value);
            }
        }

        setErrors({}); // Clear errors when user makes changes
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
        
        // Validate form first
        if (!validateForm()) {
            return;
        }
        
        try {
            // Call the parent's onSave with the form data
            if (onSave) {
                await onSave({
                    tambon: formData.tambon,
                    address: formData.address
                });
            }
        } catch (error) {
            console.error('Error updating address:', error);
            setErrors({ submit: 'Failed to update address' });
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-primary-700 mb-6">Edit Address</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Province Select */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-primary-700 mb-2">
                            PROVINCE
                        </label>
                        <select
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
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
                            <p className="mt-1 text-sm text-status-error">{errors.province}</p>
                        )}
                    </div>

                    {/* Amphur Select */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-primary-700 mb-2">
                            AMPHUR
                        </label>
                        <select
                            name="amphur"
                            value={formData.amphur}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
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
                            <p className="mt-1 text-sm text-status-error">{errors.amphur}</p>
                        )}
                    </div>

                    {/* Tambon Select */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-primary-700 mb-2">
                            TAMBON
                        </label>
                        <select
                            name="tambon"
                            value={formData.tambon}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
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
                            <p className="mt-1 text-sm text-status-error">{errors.tambon}</p>
                        )}
                    </div>

                    {/* Address Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-primary-700 mb-2">
                            ADDRESS
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
                            placeholder="Enter your address"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-status-error">{errors.address}</p>
                        )}
                    </div>

                    {/* Postal Code Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-primary-700 mb-2">
                            POSTAL CODE
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
                            maxLength="5"
                            placeholder="Enter postal code"
                        />
                        {errors.postalCode && (
                            <p className="mt-1 text-sm text-status-error">{errors.postalCode}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddress;