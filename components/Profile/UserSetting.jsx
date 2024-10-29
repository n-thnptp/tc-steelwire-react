import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditAddress from './EditAddress';
import EditPersonalInfo from './EditPersonalInfo';
import EditUsernamePassword from './EditUsernamePassword';
import useLoginContext from '../Hooks/useLoginContext';
import { Button } from "@material-tailwind/react";
import { FaCircleUser } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { RiLogoutBoxFill } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { BsShieldFillCheck } from "react-icons/bs";

const UserSetting = () => {
    const router = useRouter();
    const { handleLogout: contextLogout } = useLoginContext();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditPersonalOpen, setEditPersonalOpen] = useState(false);
    const [isEditAddressOpen, setEditAddressOpen] = useState(false);
    const [isEditUsernamePasswordOpen, setEditUsernamePasswordOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/profile');

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setUser(data.user);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Format the address string
    const formattedAddress = user ? `${user.address || ''}, ${user.city || ''} ${user.postalCode || ''}`.trim() : '';

    // Handlers for edit popups
    const toggleEditPersonal = () => setEditPersonalOpen(!isEditPersonalOpen);
    const toggleEditAddress = () => setEditAddressOpen(!isEditAddressOpen);
    const toggleEditUsernamePassword = () => setEditUsernamePasswordOpen(!isEditUsernamePasswordOpen);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                if (contextLogout) {
                    await contextLogout();
                }
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Handlers for form submission
    const handleSavePersonalInfo = async (updatedData) => {
        try {
            const response = await fetch('/api/user/update-personal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update local state with new user data
                toggleEditPersonal();
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleSaveAddress = async (updatedData) => {
        try {
            const response = await fetch('/api/user/update-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update local state with new user data
                toggleEditAddress();
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleSaveUsernamePassword = async (updatedData) => {
        try {
            const response = await fetch('/api/user/update-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update local state with new user data
                toggleEditUsernamePassword();
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-4 items-start bg-white">

            <div className="p-4 flex h-[80vh] w-full flex-col items-center bg-gray-50 max-w-4xl mx-auto">

                {/* Top Tabs Section */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold w-60 justify-center ${activeTab === 'profile' ? 'bg-primary-700 text-neutral-white' : 'bg-neutral-white text-primary-700 border border-primary-700'}`}
                    >
                        {activeTab === 'profile' ? <FaCircleUser className="mr-2" /> : <FaRegCircleUser className="mr-2" />}
                        My Profile
                    </button>

                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold w-60 justify-center ${activeTab === 'privacy' ? 'bg-primary-700 text-neutral-white' : 'bg-neutral-white text-primary-700 border border-primary-700'
                            }`}
                    >
                            {activeTab === 'profile' ? <BsShieldCheck className="mr-2" /> : <BsShieldFillCheck className="mr-2" />}
                        Privacy & Security
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <>
                        {/* User Info Section */}
                        <div className="w-full bg-neutral-white p-4 rounded-lg mb-6 flex text-primary-700 font-inter items-center">
                            <FaCircleUser className="text-6xl mr-5" />
                            <div>
                                <h3 className="text-xl font-bold flex items-center">
                                    {`${user.firstname || ''} ${user.lastname || ''}`}
                                </h3>
                                <p className="text-sm text-primary-500 font-inter flex items-center opacity-50">
                                    {formattedAddress}
                                </p>
                            </div>
                        </div>

                        <div className="w-full p-3 rounded-lg bg-neutral-white">

                            {/* Personal Information Section */}
                            <div className="w-full p-3 font-inter">
                                <div className="h-fit flex place-content-between items-center">
                                    <h4 className="text-primary-700 text-lg font-bold">Personal Information</h4>
                                    <Button variant="text" size="sm" className="relative flex text-primary-500" onClick={toggleEditPersonal}>
                                        <FiEdit2 className="text-xs mr-1" />
                                        Edit
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-primary-700">
                                    <div>
                                        <p className="text-sm text-primary-500 font-inter opacity-50">First Name</p>
                                        <p>{user.firstname}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-500 font-inter opacity-50">Last Name</p>
                                        <p>{user.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-500 font-inter opacity-50">Email Address</p>
                                        <p>{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary-500 font-inter opacity-50">Phone No.</p>
                                        <p>{user.phone_number || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="w-full p-3 font-inter">
                                <div className="h-fit flex place-content-between items-center">
                                    <h4 className="text-primary-700 text-lg font-bold">Address</h4>
                                    <Button variant="text" size="sm" className="relative flex text-primary-500" onClick={toggleEditAddress}>
                                        <FiEdit2 className="text-xs mr-1" />
                                        Edit
                                    </Button>
                                </div>

                                <div className="text-primary-700">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-primary-500 font-inter opacity-50">Province</p>
                                            <p>{user.province}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-primary-500 font-inter opacity-50">Amphur</p>
                                            <p>{user.amphur}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-primary-500 font-inter opacity-50">Tambon</p>
                                            <p>{user.tambon}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-primary-500 font-inter opacity-50">Postal Code</p>
                                            <p>{user.postalCode || 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="text" size="sm" className="absolute top-4 right-4 flex items-center" onClick={toggleEditAddress}>
                                    <FiEdit2 className="text-xs mr-1" />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full bg-white p-4 rounded-lg text-[#603F26] font-inter relative">
                        <h4 className="text-lg font-bold mb-4">Username & Password</h4>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <p className="text-sm text-[#603F26] font-inter opacity-50">Username</p>
                                <p className="text-[#603F26] font-inter">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#603F26] font-inter opacity-50">Password</p>
                                <p className="text-[#603F26] font-inter">********</p>
                            </div>
                        </div>
                        <button className="absolute top-4 right-4 flex items-center" onClick={toggleEditUsernamePassword}>
                            <img src="/icon/Edit_duotone_line.png" alt="Edit Icon" className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                    </div>
                )}

                {/* Logout Section */}
                <div className="flex justify-end w-full mt-6 text-primary-700 font-inter">
                    <Button
                        variant="outlined"
                        className="inline-flex mr-3 border-status-error text-status-error"
                        onClick={handleLogout}
                    >
                        <div className="relative flex items-center">
                            <RiLogoutBoxFill className="text-xl" />
                            Logout
                        </div>
                    </Button>
                </div>
            </div>

            {/* Modal components */}
            {isEditPersonalOpen && (
                <EditPersonalInfo
                    userData={user}
                    onClose={toggleEditPersonal}
                    onSave={handleSavePersonalInfo}
                />
            )}
            {isEditAddressOpen && (
                <EditAddress
                    userData={user}
                    onClose={toggleEditAddress}
                    onSave={handleSaveAddress}
                />
            )}
            {isEditUsernamePasswordOpen && (
                <EditUsernamePassword
                    userData={user}
                    onClose={toggleEditUsernamePassword}
                    onSave={handleSaveUsernamePassword}
                />
            )}
        </div>
    );
};

export default UserSetting;