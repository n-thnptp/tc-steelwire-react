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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
                setErrorMessage('Please fill out all fields.');
                return;
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                setErrorMessage('Passwords do not match.');
                return;
            }

            await onSave({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            // If we get here, it was successful
            setErrorMessage('');

        } catch (error) {
            // Handle the error message from the API
            setErrorMessage(error.message || 'Failed to update password');
        } finally {
            setIsSubmitting(false);
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
            onClick={(e) => e.target.id === 'modal-overlay' && onClose()}
        >
            <div
                className="bg-neutral-white rounded-lg p-8 w-full max-w-md shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-primary-700 font-inter mb-6 text-center">EDIT ACCOUNT</h2>

                <form
                    className="text-primary-700"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">OLD PASSWORD</label>
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Enter old password..."
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">NEW PASSWORD</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password..."
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold font-inter mb-2">CONFIRM NEW PASSWORD</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confirm new password..."
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="w-full p-3 input-field"
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`py-3 w-[60%] primary-buttons ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'SAVING...' : 'SAVE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPassword;
