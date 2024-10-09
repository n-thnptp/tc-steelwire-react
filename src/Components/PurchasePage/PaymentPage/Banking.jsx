import React from 'react';

const Banking = () => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6 text-[#603F26] font-inter">PAYMENT</h2>
      
      {/* PromptPay Section */}
      <div className="border p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <img src="/pic/PROMPTPAY.png" alt="PromptPay" className="w-24" />
        <button className="text-gray-600">
          <span>&#9660;</span> {/* Dropdown Arrow */}
        </button>
      </div>

      {/* Bank Options Section */}
      <div className="border p-4 rounded-lg shadow flex justify-between items-center">
        <div className="flex space-x-4">
          <img src="/pic/SCB_LOGO.png" alt="SCB" className="w-8" />
          <img src="/pic/KBANK_LOGO.png" alt="KBANK" className="w-8" />
          <img src="/pic/BAY_LOGO.png" alt="BAY" className="w-8" />
          <img src="/pic/KTB_LOGO.png" alt="KTB" className="w-8" />
          <img src="/pic/BBL_LOGO.png" alt="BBL" className="w-8" />
        </div>
        <button className="text-gray-600">
          <span>&#9660;</span> {/* Dropdown Arrow */}
        </button>
      </div>

      {/* ปุ่ม Checkout และ Cancel */}
      <div className="flex flex-col items-center">
        <button className="w-[15%] fixed bottom-11 left-12 bg-white text-accent-900 font-bold font-inter p-3 rounded-full shadow-lg">
          CANCEL
        </button>
      </div>



    </div>
  );
};

export default Banking;
