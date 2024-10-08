import React from 'react';

const PurchaseSummary = () => {
  const subtotal = 'XXX.XX BAHT';
  const shipping = 'XXXX.XX BAHT';
  const total = 'XX,XXX.XX BAHT';

  return (
    <div className="flex flex-col justify-between p-6 lg:h-full h-auto">
      <h2 className="text-3xl font-bold mb-4 text-left text-[#603F26] font-inter mb-2">SUMMARY</h2>
      <div className="mb-6 border-b pb-4">
        {/* ยอดรวมสินค้า */}
        <p className="flex justify-between mb-3 text-[#603F26] font-bold font-inter">
          <span>SUBTOTAL</span> 
          <span>{subtotal}</span>
        </p>
        {/* ค่าจัดส่ง */}
        <p className="flex justify-between text-[#603F26] font-bold font-inter mb-6">
          <span>ESTIMATED SHIPPING</span> 
          <span>{shipping}</span>
        </p>

        {/* เส้นใต้ */}
        <hr className="my-2 border-t border-gray-300 mb-6" />

        {/* ยอดรวมทั้งหมด */}
        <p className="flex justify-between  text-[#603F26] font-bold font-inter mb-3">
          <span>TOTAL</span> 
          <span>{total}</span>
        </p>
      </div>
      <div className="flex flex-col items-center">
        {/* ปุ่ม Checkout */}
        <button className="w-[80%] p-2 bg-white text-accent-900 font-bold font-inter rounded-full border-2 shadow-lg mb-3">
          CHECKOUT
        </button>
        {/* ปุ่ม Cancel */}
        <button className="w-[80%] p-2 bg-accent-900 text-white font-bold font-inter rounded-full shadow-lg">
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default PurchaseSummary;
