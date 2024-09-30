// src/components/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <div className="flex justify-between items-center bg-[#FFEAC5] p-10 w-full">
        {/* กล่องใหญ่ที่ 1 (ว่างเปล่า) */}
        <div className="w-1/3"></div>
        {/* กล่องใหญ่ที่ 2 (ว่างเปล่า) */}
        <div className="w-1/3"></div>

      {/* กล่องใหญ่ที่ 3 (มีกล่องย่อย 3 กล่อง) */}
      <div className="w-1/5 flex justify-between items-center">
        
        {/* กล่องย่อยที่ 1 (Contact Information) */}
        <div className="w-2/5 text-right">
          <h3 className="text-lg font-bold mb-4">CONTACT</h3>
          <ul className="text-sm">
            <li>ADDRESS</li>
            <li>TEL NO.</li>
            <li>EMAIL</li>
          </ul>
        </div>

        {/* กล่องย่อยที่ 2 (ว่างเปล่า) */}
        <div className="w-1/5"></div>

        {/* กล่องย่อยที่ 3 (Follow Us) */}
        <div className="w-2/5 text-right">
          <h3 className="text-lg font-bold mb-4">FOLLOW US</h3>
          <ul className="text-sm">
            <li><a href="#">INSTAGRAM</a></li>
            <li><a href="#">FACEBOOK</a></li>
            <li><a href="#">TWITTER</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
