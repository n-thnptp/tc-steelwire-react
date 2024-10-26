import React from 'react';
import Banking from './Banking';
import SummaryCheckout from './SummaryCheckout';

const PaymentPage = () => {
  return (
    <div className="flex flex-col lg:flex-row p-8 justify-between bg-white items-start h-full">
      {/* กล่อง Banking */}
      <div className="w-full lg:w-3/5 bg-white rounded-lg p-4 overflow-y-auto mb-4 lg:mb-0">
        <Banking />
      </div>

      {/* กล่อง SummaryCheckout */}
      <div className="w-full lg:w-2/5 bg-white rounded-lg p-4">
        <SummaryCheckout />
      </div>
    </div>
  );
};

export default PaymentPage;
