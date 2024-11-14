import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from "@material-tailwind/react";
import { GrMapLocation } from "react-icons/gr";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

const Navbar = () => {
    const [active, setActive] = useState('HOME');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const currentPath = router.pathname;
        if (currentPath.includes('order-details')) {
            setActive('STATUS');
        } else if (currentPath.includes('status')) {
            setActive('STATUS');
        } else if (currentPath.includes('purchase')) {
            setActive('SHOPPING CART');
        } else if (currentPath.includes('profile')) {
            setActive('PROFILE');
        } else if (currentPath === '/') {
            setActive('HOME');
        } else if (currentPath === '/history') {
            setActive('HISTORY');
        } else if (currentPath === '/payment'){
            setActive('SHOPPING CART');
        }
    }, [router.pathname]);

    const handleMenuClick = (menu) => {
        setActive(menu);
        setIsOpen(false);

        switch (menu) {
            case 'HOME':
                router.push('/');
                break;
            case 'ORDER':
                router.push('/order');
                break;
            case 'SHOPPING CART':
                router.push('/purchase');
                break;
            case 'STATUS':
                router.push('/status');
                break;
            case 'HISTORY':
                router.push('/history');
                break;
            case 'LOGIN':
                router.push('/login');
                break;
            case 'SIGNUP':
                router.push('/signup');
                break;
            case 'Location':
                router.push('/location');
                break;
            case 'Profile':
                router.push('/profile');
                break;
            default:
                router.push('/');
        }
    };

    const menuItems = ['HOME', 'ORDER', 'SHOPPING CART', 'STATUS', 'HISTORY'];

    return (
        <nav className="sticky top-0 bg-neutral-white shadow-md p-2 w-full z-50 h-16">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center" style={{ width: '180px', height: '50px' }}>
                    <a
                        className="cursor-pointer text-lg font-inter font-bold text-accent-900 text-[20px]"
                        onClick={() => handleMenuClick('HOME')}
                    >
                        TC STEELWIRE
                    </a>
                </div>

                <div className="hidden lg:flex items-center space-x-8 font-bold font-inter text-accent-900">
                    {menuItems.map((menu) => (
                        <li
                            key={menu}
                            className={`cursor-pointer button-underline hover:text-primary-700 ${active === menu ? 'selected' : ''}`}
                            onClick={() => handleMenuClick(menu)}
                        >
                            {menu}
                        </li>
                    ))}
                </div>

                <div className="hidden lg:flex space-x-4 ml-8">
                    <IconButton
                        variant="text"
                        className={`rounded-full hover:bg-primary-50`}
                        onClick={() => handleMenuClick('Location')}
                    >
                        {active === 'Location' ? (
                            <FaMapLocationDot className="text-2xl text-primary-700" />
                        ) : (
                            <GrMapLocation className="text-2xl text-gray-600 hover:text-primary-700 scale-x-[-1] transition-colors" />
                        )}
                    </IconButton>
                    <IconButton
                        variant="text"
                        className={`rounded-full hover:bg-primary-50`}
                        onClick={() => handleMenuClick('Profile')}
                    >
                        {active === 'Profile' ? (
                            <FaUser className="text-2xl text-primary-700" />
                        ) : (
                            <FaRegUser className="text-2xl text-gray-600 hover:text-primary-700 transition-colors" />
                        )}
                    </IconButton>
                </div>

                <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
                    </svg>
                </button>
            </div>

            <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} mt-4`}>
                <ul className="space-y-4">
                    {menuItems.map((menu) => (
                        <li
                            key={menu}
                            className={`text-center button-underline hover:text-primary-700 ${active === menu ? 'selected' : ''}`}
                            onClick={() => handleMenuClick(menu)}
                        >
                            <span>{menu}</span>
                        </li>
                    ))}
                    <li className="text-center py-2 flex justify-between w-full">
                        <div className="flex justify-center w-8">
                            <img
                                src="/icon/Bookmark.png"
                                alt="Bookmark"
                                className={`w-6 h-6 cursor-pointer ${active === 'Bookmark' ? 'border-b-2 border-accent-900' : ''}`}
                                onClick={() => handleMenuClick('Bookmark')}
                            />
                        </div>
                        <div className="flex justify-center w-8">
                            <img
                                src="/icon/Pin_alt_fill.png"
                                alt="Location"
                                className={`w-6 h-6 cursor-pointer ${active === 'Location' ? 'border-b-2 border-accent-900' : ''}`}
                                onClick={() => handleMenuClick('Location')}
                            />
                        </div>
                        <div className="flex justify-center w-8">
                            <img
                                src="/icon/User_alt_fill.png"
                                alt="Profile"
                                className={`w-6 h-6 cursor-pointer ${active === 'Profile' ? 'border-b-2 border-accent-900' : ''}`}
                                onClick={() => handleMenuClick('Profile')}
                            />
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
