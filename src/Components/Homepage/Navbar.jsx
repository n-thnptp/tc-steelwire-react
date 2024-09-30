import React, { useState } from 'react';

const Navbar = () => {
  const [active, setActive] = useState('HOME'); // สถานะ active สำหรับเมนูที่เลือก

  const handleMenuClick = (menu) => {
    setActive(menu); // เปลี่ยนสถานะ active เมื่อกดที่เมนู
  };

  return (
    <nav className="sticky top-0 flex items-center justify-between bg-white shadow-md p-4" style={{ height: '80px', width: '100%' }}>
      {/* โลโก้ */}
      <div className="flex items-center" style={{ width: '180px', height: '60px' }}>
        <h1 className="text-lg font-inter font-bold text-accent-900 mx-auto text-[20px]">
          TC STEELWIRE
        </h1>
      </div>
      
      {/* เมนูหลัก */}
      <ul className="flex text-accent-900 font-inter">
        <ul className="flex space-x-10 justify-center text-accent-900 font-inter font-bold text-[15px]" style={{height: '60px' }}>
        {['HOME', 'ORDER', 'PURCHASE', 'STATUS', 'CONFIGURATION'].map((menu) => (
          <li
            key={menu}
            className={`cursor-pointer flex flex-col items-center justify-center ${
              active === menu ? 'border-b-2 border-b-accent-900' : ''
            }`}
            onClick={() => handleMenuClick(menu)}
          >
            <span>{menu}</span>
          </li>
        ))}
        </ul>
      </ul>

      {/* ปุ่ม Log In และ Sign Up */}
      <div className="flex items-center space-x-4">
      <button className="bg-white text-accent-900 text-[10px] px-4 py-2 rounded font-inter font-bold" style={{ width: '75px', height: '35px' }}>LOGIN</button>
        <button className="bg-accent-900 text-white px-4 py-2 rounded font-inter text-[10px] font-bold" style={{ width: '75px', height: '35px' }}>SIGN UP</button>
      </div>
    </nav>
  );
};

export default Navbar;
