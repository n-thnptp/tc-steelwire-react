import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [active, setActive] = useState('HOME');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ตรวจสอบเส้นทางปัจจุบันเมื่อกดรีหน้า
  useEffect(() => {
    if (location.state?.active) {
      setActive(location.state.active); // ตั้งค่า active ตาม state ที่ส่งมา
    } else {
      const currentPath = location.pathname;
      if (currentPath === '/') {
        setActive('HOME');
      } else if (currentPath.includes('order')) {
        setActive('ORDER');
      } else if (currentPath.includes('purchase')) {
        setActive('PURCHASE');
      } else if (currentPath.includes('status')) {
        setActive('STATUS');
      } else if (currentPath.includes('configuration')) {
        setActive('CONFIGURATION');
      } else if (currentPath.includes('history')) {
        setActive('HISTORY');
      } else if (currentPath.includes('bookmark')) {
        setActive('Bookmark');
      } else if (currentPath.includes('location')) {
        setActive('Location');
      } else if (currentPath.includes('profile')) {
        setActive('Profile');
      }
    }
  }, [location]);

  const handleMenuClick = (menu) => {
    setActive(menu);
    setIsOpen(false);

    // เปลี่ยนเส้นทางเมื่อเลือกเมนู
    switch (menu) {
      case 'HOME':
        navigate('/');
        break;
      case 'ORDER':
        navigate('/order');
        break;
      case 'PURCHASE':
        navigate('/purchase');
        break;
      case 'STATUS':
        navigate('/status');
        break;
      case 'CONFIGURATION':
        navigate('/configuration');
        break;
      case 'HISTORY':
        navigate('/history');
        break;
      case 'LOGIN':
        navigate('/login');
        break;
      case 'SIGNUP':
        navigate('/signup');
        break;
      case 'Bookmark':
        navigate('/bookmark');
        break;
      case 'Location':
        navigate('/location');
        break;
      case 'Profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  const menuItems = ['HOME', 'ORDER', 'PURCHASE', 'STATUS', 'CONFIGURATION', 'HISTORY'];

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

        {/* Icons */}
        <div className="hidden lg:flex space-x-4 ml-8"> {/* เพิ่ม ml-4 ให้ไอคอนขยับมาทางซ้าย */}
          <div className="flex items-center justify-between w-8">
            <img
              src="/icon/Bookmark.png"
              alt="Bookmark"
              className={`w-6 h-6 cursor-pointer ${active === 'Bookmark' ? 'border-b-2 border-accent-900' : ''}`}
              onClick={() => handleMenuClick('Bookmark')}
            />
          </div>
          <div className="flex items-center justify-between w-8">
            <img
              src="/icon/Pin_alt_fill.png"
              alt="Location"
              className={`w-6 h-6 cursor-pointer ${active === 'Location' ? 'border-b-2 border-accent-900' : ''}`}
              onClick={() => handleMenuClick('Location')}
            />
          </div>
          <div className="flex items-center justify-between w-8">
            <img
              src="/icon/User_alt_fill.png"
              alt="Profile"
              className={`w-6 h-6 cursor-pointer ${active === 'Profile' ? 'border-b-2 border-accent-900' : ''}`}
              onClick={() => handleMenuClick('Profile')}
            />
          </div>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
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
              <span>{menu}</span>
            </li>
          ))}
          {/* Mobile Icon Menu */}
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
