import React from 'react';

const PurchaseSummary = () => {
  const subtotal = 'XXX.XX BAHT';
  const shipping = 'XXXX.XX BAHT';
  const total = 'XX,XXX.XX BAHT';

  return (
    <div className="flex flex-col justify-start p-6">
      {/* กล่องเพิ่มขนาด เพื่อให้ Summary อยู่ในระดับเดียวกับ ORDER IN CART */}
      <div className="flex-grow"></div> {/* กล่องว่างเพื่อปรับระดับ */}
      
      <h2 className="text-3xl font-bold mb-4 text-left">SUMMARY</h2>
      <div className="mb-4 border-b pb-4 mb-6">
        {/* ยอดรวมสินค้า */}
        <p className="flex justify-between mb-3">
          <span>SUBTOTAL</span> 
          <span>{subtotal}</span>
        </p>
        {/* ค่าจัดส่ง */}
        <p className="flex justify-between">
          <span>ESTIMATED SHIPPING</span> 
          <span>{shipping}</span>
        </p>

        {/* เส้นใต้ */}
        <hr className="my-2 border-t border-gray-300 mb-6" />

        {/* ยอดรวมทั้งหมด */}
        <p className="flex justify-between font-bold">
          <span>TOTAL</span> 
          <span>{total}</span>
        </p>
      </div>
      <div className="flex flex-col items-center">
        {/* ปุ่ม Checkout */}
        <button className="w-[45%] p-2 bg-white text-accent-900 font-bold rounded-lg border-2 shadow-lg mb-2">
          CHECKOUT
        </button>
        {/* ปุ่ม Cancel */}
        <button className="w-[45%] p-2 bg-accent-900 text-white font-bold rounded-lg shadow-lg">
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default PurchaseSummary;
