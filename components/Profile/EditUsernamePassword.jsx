// EditUsernamePasswordPopup.jsx
import React, { useState } from 'react';

const EditUsernamePassword = ({ userData, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    console.log("Account information saved", { username, password });
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

        <h2 className="text-xl font-bold text-[#603F26] font-inter mb-6 text-center">EDIT ACCOUNT</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">USERNAME</label>
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">PASSWORD</label>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold font-inter text-[#603F26] mb-2">CONFIRM PASSWORD</label>
            <input
              type="password"
              placeholder="CONFIRM PASSWORD"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6A462F] font-inter text-[#603F26]"
            />
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}

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

export default EditUsernamePassword;
