// EditPassword.jsx (Popup)
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const EditPassword = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/user/update-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || 'Failed to update password');
                return;
            }

            if (data.requireRelogin) {
                router.push('/login?message=Please login again with your new password');
            }
        } catch (error) {
            setErrorMessage('Failed to change password');
            console.error('Update error:', error);
        }
    };

    const handleClickOutside = (e) => {
        if (e.target.id === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClickOutside}
        >
            <div
                className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-[#603F26] font-inter mb-6 text-center">EDIT ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">OLD PASSWORD</label>
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Enter old password..."
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">NEW PASSWORD</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password..."
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">CONFIRM NEW PASSWORD</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confirm new password..."
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}

                    {/* Save Button */}
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

export default EditPassword;
