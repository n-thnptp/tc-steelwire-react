import React, { useState } from 'react';

const EditAddress = ({ onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNumberChange = (e, setState, maxLength) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setState(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Address saved", { fullName, phoneNumber, province, address, zipCode });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
        {/* ปุ่มกากบาทสำหรับปิด */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#603F26] font-inter mb-4 text-center">EDIT ADDRESS</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-1">FULL NAME</label>
            <input
              type="text"
              placeholder="FULL NAME"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-1">PHONE NUMBER</label>
            <input
              type="text"
              placeholder="PHONE NUMBER"
              value={phoneNumber}
              onChange={(e) => handleNumberChange(e, setPhoneNumber, 10)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-1">PROVINCE</label>
            <input
              type="text"
              placeholder="PROVINCE"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-1">ADDRESS</label>
            <input
              type="text"
              placeholder="ADDRESS"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-1">ZIP CODE</label>
            <input
              type="text"
              placeholder="ZIP CODE"
              value={zipCode}
              onChange={(e) => handleNumberChange(e, setZipCode, 5)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          {/* ปุ่ม SAVE */}
          <div className="flex justify-center  mt-4">
            <button
              type="submit"
              className="bg-[#6A462F] text-[#FFDBB5] p-2 rounded-full font-bold shadow-lg hover:bg-[#5A3C2F] w-[60%]"
            >
              Save as present address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
