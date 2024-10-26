import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderStatusDetails = () => {
  const location = useLocation(); 
  const navigate = useNavigate();

  const order = location.state?.order; 

  if (!order) {
    return <p>No order details available.</p>;
  }

  const orderState = "paid"; // ใช้สำหรับทดสอบ

  return (
    <div className="flex justify-center items-center mt-10 ">
      <div className="p-8 w-[80%] bg-white">
        <h1 className="text-2xl font-bold text-[#603F26] mb-2">ORDER DETAILS</h1>
        <p className="text-[#603F26] opacity-50">DATE : {order.date || 'XX / XX / XXXX'}</p>

        {/* Order Progress */}
        <div className="flex items-center justify-between mt-8 mb-4">
          {/* ORDER CONFIRMED */}
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-6 h-6 flex items-center justify-center ${
                orderState === "paid" || orderState === "shipping" || orderState === "DeliverSuccess"
                  ? "bg-[#603F26] text-white"
                  : "border border-[#603F26] bg-white"
              }`}
            >
              {orderState === "paid" && "✓"}
            </div>
            <span
              className={`mt-2 font-bold font-inter text-center ${
                orderState === "paid" || orderState === "shipping" || orderState === "DeliverSuccess"
                  ? "text-[#603F26]"
                  : "text-gray-500"
              }`}
            >
              ORDER<br />CONFIRMED
            </span>
          </div>

          <div className="w-full border-b border-[#603F26] mx-4"></div>

          {/* SHIPPING */}
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-6 h-6 flex items-center justify-center ${
                orderState === "shipping" || orderState === "DeliverSuccess"
                  ? "bg-[#603F26] text-white"
                  : "border border-[#603F26] bg-white"
              }`}
            >
              {orderState === "shipping" && "✓"}
            </div>
            <span
              className={`mt-2 font-bold font-inter text-center ${
                orderState === "shipping" || orderState === "DeliverSuccess"
                  ? "text-[#603F26]"
                  : "text-gray-500"
              }`}
            >
              SHIPPING
            </span>
          </div>

          <div className="w-full border-b border-[#603F26] mx-4"></div>

          {/* DELIVER SUCCESS */}
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-6 h-6 flex items-center justify-center ${
                orderState === "DeliverSuccess"
                  ? "bg-[#603F26] text-white"
                  : "border border-[#603F26] bg-white"
              }`}
            >
              {orderState === "DeliverSuccess" && "✓"}
            </div>
            <span
              className={`mt-2 font-bold font-inter text-center ${
                orderState === "DeliverSuccess"
                  ? "text-[#603F26]"
                  : "text-gray-500"
              }`}
            >
              DELIVER<br />SUCCESS
            </span>
          </div>
        </div>

        {/* Order Information */}
        <div className="flex justify-between my-6">
          <div>
            <h2 className="text-[#603F26] font-bold font-inter"></h2>
            <p className="text-[#603F26] opacity-50">{order.date || 'XX.XX XM, MONTHS X, XXXX'}</p>
          </div>
          <div>
            <h2 className="text-[#603F26] font-bold font-inter"></h2>
            <p className="text-[#603F26] opacity-50">{order.shipping || 'SHIPPED WITH ........'}</p>
          </div>
          <div>
            <h2 className="text-[#603F26] font-bold font-inter"></h2>
            <p className="text-[#603F26] opacity-50">{order.deliveryDate || 'DELIVER DATE: MONTHS XX, XXXX'}</p>
          </div>
        </div>

        {/* Form Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#603F26] opacity-50 font-bold font-inter">COURIER NAME</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border border-[#603F26] rounded-[15px] opacity-50"
              value={order.courierName || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-[#603F26] opacity-50 font-bold font-inter rounded-[20px]">TRACKING NUMBER</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border border-[#603F26] rounded-[15px] opacity-50"
              value={order.trackingNumber || ''}
              readOnly
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[#603F26] opacity-50 font-bold font-inter rounded-[20px]">SHIPPING TRACKING URL</label>
          <input
            type="text"
            className="w-full p-2 mt-2 border border-[#603F26] rounded-[15px] opacity-50"
            value={order.trackingUrl || ''}
            readOnly
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            className="flex justify-center items-center px-4 py-2 border-2 border-[#603F26] text-[#603F26] font-bold font-inter rounded-[20px] w-[15%]"
            onClick={() => navigate(-1)} 
          >Back
          </button>
          <button className="px-6 py-2 bg-[#CD3535] text-white font-bold font-inter rounded-[20px] w-[15%]">CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusDetails;
