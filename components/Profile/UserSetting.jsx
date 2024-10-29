import React, { useState } from 'react';
import { useRouter } from 'next/router';
import EditAddress from './EditAddress';
import EditPersonalInfo from './EditPersonalInfo';
import EditUsernamePassword from './EditUsernamePassword';

const UserSetting = () => {
    const router = useRouter();

    // Mock data for user information (simulate pulling from a database)
    const [userData] = useState({
        name: 'Jack Dawson',
        address: '1234 Elm Street',
        firstName: 'Jack',
        lastName: 'Dawson',
        email: 'example@gmail.com',
        phone: '012345678',
        country: 'Thailand',
        city: 'Bangkok',
        postalCode: '10200',
        FullName: 'Phone NO.',
        username: 'JackTennison',
        password: '********',
    });

    const [isEditPersonalOpen, setEditPersonalOpen] = useState(false);
    const [isEditAddressOpen, setEditAddressOpen] = useState(false);
    const [isEditUsernamePasswordOpen, setEditUsernamePasswordOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Handlers for edit popups
    const toggleEditPersonal = () => setEditPersonalOpen(!isEditPersonalOpen);
    const toggleEditAddress = () => setEditAddressOpen(!isEditAddressOpen);
    const toggleEditUsernamePassword = () => setEditUsernamePasswordOpen(!isEditUsernamePasswordOpen);

    const handleClickOutside = (e, closeModal) => {
        if (e.target === e.currentTarget) closeModal();
    };

    const handleLogout = () => {
        router.push('/login');
    };

    // Handlers for form submission (simulated save function)
    const handleSavePersonalInfo = () => {
        // Save logic here (e.g., sending data to the backend)
        toggleEditPersonal();
    };

    const handleSaveAddress = () => {
        // Save logic here (e.g., sending data to the backend)
        toggleEditAddress();
    };

    const handleSaveUsernamePassword = () => {
        // Save logic here (e.g., sending data to the backend)
        toggleEditUsernamePassword();
    };

    return (
        <div className="p-4 items-start bg-white">
            <div className="p-4 flex h-[80vh] w-full flex-col items-center bg-gray-50 max-w-4xl mx-auto">

                {/* Top Tabs Section */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold w-60 justify-center ${activeTab === 'profile' ? 'bg-[#603F26] text-white' : 'bg-white text-[#603F26] border border-[#603F26]'
                            }`}
                    >
                        <img
                            src={activeTab === 'profile' ? '/icon/User_cicrle_light.png' : '/icon/User_cicrle_light_brown.png'}
                            alt="Profile Icon"
                            className="w-5 h-5"
                        />
                        <span>My Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold w-60 justify-center ${activeTab === 'privacy' ? 'bg-[#603F26] text-white' : 'bg-white text-[#603F26] border border-[#603F26]'
                            }`}
                    >
                        <img
                            src={activeTab === 'profile' ? '/icon/Chield_check.png' : '/icon/Chield_check_white.png'}
                            alt="Privacy Icon"
                            className="w-5 h-5"
                        />
                        <span>Privacy & Security</span>
                    </button>
                </div>

                {/* Conditionally Render Sections */}
                {activeTab === 'profile' ? (
                    <>
                        {/* User Info Section */}
                        <div className="w-full bg-white p-4 rounded-lg mb-6 flex text-[#603F26] font-inter items-center">
                            <img
                                src='/icon/User_cicrle_light_brown.png'
                                alt="User Icon"
                                className="w-16 h-16 mr-4"
                            />
                            <div>
                                <h3 className="text-xl font-bold flex items-center">{userData.name}</h3>
                                <p className="text-sm text-[#603F26] font-inter flex items-center opacity-50">{userData.address}</p>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="w-full bg-white p-4 rounded-lg mb-6 relative text-[#603F26] font-inter">
                            <h4 className="text-lg font-bold mb-4">Personal Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">First Name</p>
                                    <p className="text-[#603F26] font-inter">{userData.firstName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">Last Name</p>
                                    <p className="text-[#603F26] font-inter">{userData.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">Email Address</p>
                                    <p className="text-[#603F26] font-inter">{userData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">Phone No.</p>
                                    <p className="text-[#603F26] font-inter">{userData.phone}</p>
                                </div>
                            </div>
                            <button className="absolute top-4 right-4 flex items-center" onClick={toggleEditPersonal}>
                                <img src="/icon/Edit_duotone_line.png" alt="Edit Icon" className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                        </div>

                        {/* Address Section */}
                        <div className="w-full bg-white p-4 rounded-lg mb-6 relative text-[#603F26] font-inter">
                            <h4 className="text-lg font-bold mb-4">Address</h4>
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">Country</p>
                                    <p className="text-[#603F26] font-inter">{userData.country}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">City / State</p>
                                    <p className="text-[#603F26] font-inter">{userData.city}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#603F26] font-inter opacity-50">Postal Code</p>
                                    <p className="text-[#603F26] font-inter">{userData.postalCode}</p>
                                </div>
                            </div>
                            <button className="absolute top-4 right-4 flex items-center" onClick={toggleEditAddress}>
                                <img src="/icon/Edit_duotone_line.png" alt="Edit Icon" className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full bg-white p-4 rounded-lg text-[#603F26] font-inter relative">
                        {/* Privacy & Security Content */}
                        <h4 className="text-lg font-bold mb-4">Username & Password</h4>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <p className="text-sm text-[#603F26] font-inter opacity-50">Username</p>
                                <p className="text-[#603F26] font-inter">{userData.username}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#603F26] font-inter opacity-50">Password</p>
                                <p className="text-[#603F26] font-inter">{userData.password}</p>
                            </div>
                        </div>
                        <button className="absolute top-4 right-4 flex items-center" onClick={toggleEditUsernamePassword}>
                            <img src="/icon/Edit_duotone_line.png" alt="Edit Icon" className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                    </div>
                )}

                {/* Logout Section */}
                <div className="flex justify-end w-full mt-6 text-[#603F26] font-inter">
                    <button onClick={handleLogout} className="flex items-center text-red-500 border border-red-500 px-4 py-2 rounded-lg font-bold">
                        <img src="/icon/Sign_out_squre.png" alt="Logout Icon" className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Rest of the UserSetting component code here */}
            {isEditPersonalOpen && (
                <EditPersonalInfo userData={userData} onClose={toggleEditPersonal} onSave={handleSavePersonalInfo} />
            )}
            {isEditAddressOpen && (
                <EditAddress userData={userData} onClose={toggleEditAddress} onSave={handleSaveAddress} />
            )}
            {isEditUsernamePasswordOpen && (
                <EditUsernamePassword userData={userData} onClose={toggleEditUsernamePassword} onSave={handleSaveUsernamePassword} />
            )}
        </div>
    );
};

export default UserSetting;
