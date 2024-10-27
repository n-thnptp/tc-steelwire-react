// EditPersonalInfoPopup.jsx
import React, { useState } from 'react';

const EditPersonalInfo = ({ userData, onClose, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handleNumberChange = (e, setState, maxLength) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setState(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Personal information saved", { fullName, phoneNumber, emailAddress });
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-[#603F26] font-inter mb-6 text-center">PERSONAL INFORMATION</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">FULL NAME</label>
            <input
              type="text"
              placeholder="FULL NAME"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">PHONE NUMBER</label>
            <input
              type="text"
              placeholder="PHONE NUMBER"
              value={phoneNumber}
              onChange={(e) => handleNumberChange(e, setPhoneNumber, 10)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#6A462F] text-[#FFDBB5] py-3 rounded-full font-bold w-[60%] text-center shadow-lg hover:bg-[#5A3C2F]"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPersonalInfo;
