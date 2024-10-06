import React from 'react';
import CartView from './CartView';
import PurchaseSummary from './PurchaseSummary';

const PurchasePage = () => {
  return (
    <div className="flex p-12 justify-between bg-gray-100 items-start" style={{ height: 'calc(96vh - 50px)' }}>
      {/* ส่วนแสดงรายการสินค้า */}
      <div className="w-3/5 bg-white rounded-lg p-4 shadow-lg overflow-y-auto">
        <CartView />
      </div>

      {/* ส่วนสรุปยอดรวม */}
      <div className="w-2/5 bg-white rounded-lg p-4 shadow-lg h-full"> {/* ใช้ h-full เพื่อให้มีความสูงเต็ม */}
        <PurchaseSummary />
      </div>
    </div>
  );
};

export default PurchasePage;
