import React from 'react';

const Contact = () => {
  return (
    <div className="flex justify-end items-start bg-neutral-gray-100 p-10 w-full">
      
      {/* กล่องที่ครอบ Contact และ Follow Us */}
      <div className="flex justify-end space-x-24 max-w-screen-lg w-full items-start">
        
        {/* กล่องสำหรับ Contact Information */}
        <div className="flex flex-col items-start text-right">
          <h3 className="text-lg font-bold mb-6">CONTACT</h3>
          <ul className="text-sm">
            <li className="flex items-center font-inter font-bold"><span>🏳</span> <span className="ml-2">ADDRESS</span></li>
            <li className="flex items-center font-inter font-bold"><span>📞</span> <span className="ml-2">TEL NO.</span></li>
            <li className="flex items-center font-inter font-bold"><span>✉️</span> <span className="ml-2">EMAIL</span></li>
          </ul>
        </div>

        {/* กล่องสำหรับ Follow Us */}
        <div className="flex flex-col items-start text-right">
          <h3 className="text-lg font-bold mb-6">FOLLOW US</h3>
          <ul className="text-sm">
            <li className="flex items-center font-inter font-bold"><span>📸</span> <span className="ml-2"><a href="#">INSTAGRAM</a></span></li>
            <li className="flex items-center font-inter font-bold"><span>📘</span> <span className="ml-2"><a href="#">FACEBOOK</a></span></li>
            <li className="flex items-center font-inter font-bold"><span>🐦</span> <span className="ml-2"><a href="#">TWITTER</a></span></li>
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default Contact;
