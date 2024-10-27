import React, { useState } from 'react';

import EditAddress from '../EditAddress';


const SummaryCheckout = () => {
  const subtotal = 'XXX.XX BAHT';
  const shipping = 'XXXX.XX BAHT';
  const total = 'XX,XXX.XX BAHT';

  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditAddressOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditAddressOpen(false);
  };


  return (
    <div className="flex flex-col justify-between h-full p-6">
      {/* หัวข้อ Summary */}
      <h2 className="text-3xl font-bold mb-4 text-left font-inter text-[#603F26]">SUMMARY</h2>

      {/* Delivery Address */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-[#603F26] font-inter">DELIVERY ADDRESS</p>
          {/* ปุ่มแก้ไขอยู่ในบรรทัดเดียวกัน */}
          <button onClick={handleEditClick} className="bg-[#6A462F] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg font-inter">
            EDIT
          </button>
        </div>
        <p className="text-sm text-[#9A7B4F] font-semibold font-inter">THOMAS  EDISON</p>
        <p className="text-sm text-[#9A7B4F] font-inter">
          123 MAPLE STREET, SPRINGFIELD, IL 62704, USA
        </p>
        <p className="text-sm text-[#9A7B4F] font-inter">+66 2 123 4567</p>
        <hr className="my-2 border-t border-gray-300 mb-6" />
      </div>

      {/* ส่วนแสดงยอดรวมสินค้า */}
      <div className="mb-4 border-b pb-4">
        <p className="flex justify-between mb-3 text-[#603F26] font-bold font-inter">
          <span>SUBTOTAL</span> 
          <span>{subtotal}</span>
        </p>
        <p className="flex justify-between text-[#603F26] font-bold font-inter mb-6">
          <span>ESTIMATED SHIPPING</span> 
          <span>{shipping}</span>
        </p>
        <hr className="my-2 border-t border-gray-300 mb-6" />
        <p className="flex justify-between text-[#603F26] font-bold font-inter mb-3">
          <span>TOTAL</span> 
          <span>{total}</span>
        </p>
      </div>

      {/* ปุ่ม Checkout และ Cancel */}
      <div className="flex flex-col items-center">
        <button className="w-[15%] fixed bottom-11 right-12 bg-accent-900 text-white p-3 rounded-full shadow-lg font-bold">
          FINISH
        </button>
      </div>

      {/* แสดงหน้าต่าง EditAddress ถ้า isEditAddressOpen เป็น true */}
      {isEditAddressOpen && <EditAddress onClose={handleCloseEdit} />}

    </div>
  );
};

export default SummaryCheckout;
