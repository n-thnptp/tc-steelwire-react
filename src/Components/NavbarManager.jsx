import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavbarManager = () => {
  const [active, setActive] = useState('ORDER');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ตรวจสอบเส้นทางปัจจุบันเมื่อโหลดหน้า
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('orderM')) {
      setActive('ORDER');
    } else if (currentPath.includes('stock')) {
      setActive('STOCK');
    } else if (currentPath.includes('transaction')) {
      setActive('TRANSACTION');
    } else if (currentPath.includes('update-order')) {
      setActive('UPDATE ORDER');
    }
  }, [location]);

  const handleMenuClick = (menu) => {
    setActive(menu);
    setIsOpen(false);

    // เปลี่ยนเส้นทางตามเมนูที่เลือก
    switch (menu) {
      case 'ORDER':
        navigate('/manager/orderM');
        break;
      case 'STOCK':
        navigate('/manager/stock');
        break;
      case 'TRANSACTION':
        navigate('/manager/transaction');
        break;
      case 'UPDATE ORDER':
        navigate('/manager/update-order');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = ['ORDER', 'STOCK', 'TRANSACTION', 'UPDATE ORDER'];

  return (
    <nav className="sticky top-0 bg-white shadow-md p-4 w-full z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center" style={{ width: '180px', height: '50px' }}>
          <h1 className="text-lg font-inter font-bold text-accent-900 text-[20px]">TC STEELWIRE</h1>
        </div>

        {/* Menu Items */}
        <div className="hidden lg:flex items-center space-x-8 font-bold font-inter text-accent-900">
          {menuItems.map((menu) => (
            <span
              key={menu}
              className={`cursor-pointer ${active === menu ? 'border-b-2 border-accent-900' : ''}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </span>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mr-2">
          <button
            className="hidden lg:block px-4 py-2 bg-[#CD3535] text-white font-bold font-inter rounded-[20px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Hamburger Menu */}
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

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} mt-4`}>
        <ul className="space-y-4">
          {menuItems.map((menu) => (
            <li
              key={menu}
              className={`cursor-pointer text-center ${active === menu ? 'border-b-2 border-accent-900' : ''} py-2`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
          {/* Logout Button for Mobile Menu */}
          <li className="text-center py-2">
            <button
              className="w-full px-4 py-2 bg-[#CD3535] text-white font-bold font-inter rounded-[20px]"
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
