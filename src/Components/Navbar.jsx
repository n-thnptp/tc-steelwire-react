import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [active, setActive] = useState('HOME');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
        navigate('/login');  // เปลี่ยนเส้นทางไปยังหน้า Login
        break;
      case 'SIGNUP':
        navigate('/signup');  // เปลี่ยนเส้นทางไปยังหน้า Sign Up
        break;
      default:
        navigate('/');
    }
  };

  const menuItems = ['HOME', 'ORDER', 'PURCHASE', 'STATUS', 'CONFIGURATION', 'HISTORY'];

  return (
    <nav className="sticky top-0 bg-white shadow-md p-4 w-full z-50 ">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-between" style={{ width: '180px', height: '50px' }}>
          <h1 className="text-lg font-inter font-bold text-accent-900 text-[20px] items-center justify-between">
            TC STEELWIRE
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 font-bold font-inter text-accent-900">
          {menuItems.map((menu) => (
            <span
              key={menu}
              className={`cursor-pointer ${
                active === menu ? 'border-b-2 border-accent-900' : ''
              }`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </span>
          ))}
        </div>

        {/* Desktop Login/Signup */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            className="bg-white text-accent-900 text-[10px] px-4 py-2 rounded font-inter font-bold"
            style={{ width: '75px', height: '35px' }}
            onClick={() => handleMenuClick('LOGIN')}  // เมื่อคลิกจะไปหน้า LOGIN
          >
            LOGIN
          </button>
          <button
            className="bg-accent-900 text-white px-4 py-2 rounded font-inter text-[10px] font-bold"
            style={{ width: '75px', height: '35px' }}
            onClick={() => handleMenuClick('SIGNUP')}  // เมื่อคลิกจะไปหน้า SIGN UP
          >
            SIGN UP
          </button>
        </div>

        {/* Hamburger Menu */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
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
              className={`cursor-pointer text-center ${
                active === menu ? 'border-b-2 border-accent-900' : ''
              } py-2`}
              onClick={() => handleMenuClick(menu)}
            >
              <span>{menu}</span>
            </li>
          ))}
          <li className="text-center py-2">
            <button
              className="bg-white text-accent-900 text-[10px] px-4 py-2 rounded font-inter font-bold"
              style={{ width: '100px', height: '35px' }}
              onClick={() => handleMenuClick('LOGIN')}  // เมื่อคลิกจะไปหน้า LOGIN
            >
              LOGIN
            </button>
          </li>
          <li className="text-center py-2">
            <button
              className="bg-accent-900 text-white text-[10px] px-4 py-2 rounded font-inter font-bold"
              style={{ width: '100px', height: '35px' }}
              onClick={() => handleMenuClick('SIGNUP')}  // เมื่อคลิกจะไปหน้า SIGN UP
            >
              SIGN UP
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
