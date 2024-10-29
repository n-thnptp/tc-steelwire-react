import React, { useState, useEffect } from 'react';

const EditAddress = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                address: userData.address || '',
                city: userData.city || '',
                country: userData.country || '',
                postalCode: userData.postalCode || ''
            });
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user/update-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            const data = await response.json();
            if (data.success) {
                onSave(data.user);
                onClose();
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

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

                <h2 className="text-xl font-bold text-[#603F26] font-inter mb-6 text-center">ADDRESS INFORMATION</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">ADDRESS</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">CITY</label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">COUNTRY</label>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">POSTAL CODE</label>
                        <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

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