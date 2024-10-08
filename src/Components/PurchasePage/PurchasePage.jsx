import React from 'react';
import CartView from './CartView';
import PurchaseSummary from './PurchaseSummary';

const PurchasePage = () => {
  return (
    <div className="flex flex-col lg:flex-row p-8 justify-between bg-white items-start h-full" style={{ height: 'calc(95vh - 50px)' }}>
      {/* ส่วนแสดงรายการสินค้า */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg p-4 overflow-y-auto flex-grow mb-4 lg:mb-0"> 
        <CartView />
      </div>

      {/* ส่วนสรุปยอดรวม */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg p-4 lg:h-auto h-auto">
        <PurchaseSummary />
      </div>
    </div>
  );
};

export default PurchasePage;
