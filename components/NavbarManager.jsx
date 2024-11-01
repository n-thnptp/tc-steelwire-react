import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NavbarManager = () => {
    const [active, setActive] = useState('ORDER');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const currentPath = router.pathname;
        if (currentPath.includes('customer-order')) {
            setActive('ORDER');
        } else if (currentPath.includes('stock')) {
            setActive('STOCK');
        } else if (currentPath.includes('transaction')) {
            setActive('TRANSACTION');
        } else if (currentPath.includes('update-order')) {
            setActive('UPDATE ORDER');
        }
    }, [router.pathname]);

    const handleMenuClick = (menu) => {
        setActive(menu);
        setIsOpen(false);

        switch (menu) {
            case 'ORDER':
                router.push('/manager/customer-order');
                break;
            case 'STOCK':
                router.push('/manager/stock');
                break;
            case 'TRANSACTION':
                router.push('/manager/transaction');
                break;
            case 'UPDATE ORDER':
                router.push('/manager/update-order');
                break;
            default:
                router.push('/');
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        router.push('/login');
    };

    const menuItems = ['ORDER', 'STOCK', 'TRANSACTION', 'UPDATE ORDER'];

    return (
        <nav className="sticky top-0 bg-neutral-white shadow-md p-4 w-full z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center" style={{ width: '180px', height: '50px' }}>
                    <h1 className="text-lg font-inter font-bold text-primary-700 text-[20px]">TC STEELWIRE</h1>
                </div>

                <div className="hidden lg:flex items-center space-x-8 font-bold font-inter text-primary-700">
                    {menuItems.map((menu) => (
                        <li
                            key={menu}
                            className={`button-underline hover:text-primary-700 ${active === menu ? 'border-b-2 border-accent-900' : ''}`}
                            onClick={() => handleMenuClick(menu)}
                        >
                            {menu}
                        </li>
                    ))}
                </div>

                <div className="mr-2">
                    <button
                        className="hidden lg:block px-4 py-2 bg-[#CD3535] text-white font-bold font-inter rounded-[20px]"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                        />
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
                            {menu}
                        </li>
                    ))}
                    <li className="text-center py-2">
                        <button
                            className="w-full px-4 py-2 bg-status-error text-white font-bold font-inter rounded-[20px]"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarManager;