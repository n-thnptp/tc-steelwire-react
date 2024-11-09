import React, { useState, useEffect } from 'react';

const EditPersonalInfo = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone_number: '',
        email: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                phone_number: userData.phone_number || '',
                email: userData.email || ''
            });
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        onSave(formData);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-neutral-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-primary-700 font-inter mb-6 text-center">PERSONAL INFORMATION</h2>

                <form
                    className="text-primary-700"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">FIRST NAME</label>
                        <input
                            type="text"
                            value={formData.firstname}
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">LAST NAME</label>
                        <input
                            type="text"
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">PHONE NUMBER</label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="py-3 w-[60%] primary-buttons"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPersonalInfo;