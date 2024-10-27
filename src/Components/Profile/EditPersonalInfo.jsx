// EditPersonalInfoPopup.jsx
import React from 'react';

const EditPersonalInfo = ({ userData, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Edit Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="p-2 border rounded" defaultValue={userData.firstName} placeholder="First Name" />
          <input className="p-2 border rounded" defaultValue={userData.lastName} placeholder="Last Name" />
          <input className="p-2 border rounded" defaultValue={userData.email} placeholder="Email Address" />
          <input className="p-2 border rounded" defaultValue={userData.phone} placeholder="Phone No." />
        </div>
        <button onClick={onSave} className="mt-4 bg-[#603F26] text-white px-4 py-2 rounded">Save</button>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">X</button>
      </div>
    </div>
  );
};

export default EditPersonalInfo;
