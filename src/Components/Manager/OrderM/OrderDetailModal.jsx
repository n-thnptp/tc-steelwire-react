import React from 'react';

const OrderDetailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // ฟังก์ชันจัดการการคลิกภายนอก Modal
  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div 
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClickOutside}
    >
      <div className="relative bg-white p-8 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* ปุ่มปิดตรงมุมขวาบน */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[#603F26] font-bold text-sm">
          X
        </button>
        
        <div className="text-[#603F26] text-sm">
          <h3 className="text-lg font-bold mb-4">Purchase Order</h3>
          <p><strong>Date:</strong> xx/xx/xxxx</p>
          <p><strong>P.O. no.:</strong> 123456789</p>
          <p><strong>Customer ID:</strong> #123456</p>
        </div>
        
        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="text-[#603F26] text-sm">
          <p><strong>Delivery Date:</strong> xx/xx/xxxx</p>
          <p><strong>Ship via:</strong> shipping company</p>
        </div>
        
        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="flex justify-between text-[#603F26] text-sm">
          <div>
            <h4 className="font-bold">Vendor</h4>
            <p>Name</p>
            <p>Company name</p>
            <p>Street address</p>
            <p>City, State, Zip</p>
            <p>(+66) xx-xxx-xxxx</p>
            <p>Email@example.com</p>
          </div>
          <div>
            <h4 className="font-bold">Ship to</h4>
            <p>Name</p>
            <p>Company name</p>
            <p>Street address</p>
            <p>City, State, Zip</p>
            <p>(+66) xx-xxx-xxxx</p>
            <p>Email@example.com</p>
          </div>
        </div>
        
        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        {/* ตารางสินค้า */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg text-sm">
            <thead>
              <tr className="bg-[#FFEAC5] text-[#603F26]">
                <th className="py-2 px-4 text-left font-bold text-[#603F26] font-inter">Item</th>
                <th className="py-2 px-4 text-left font-bold text-[#603F26] font-inter">Description</th>
                <th className="py-2 px-4 text-left font-bold text-[#603F26] font-inter">Qty</th>
                <th className="py-2 px-4 text-left font-bold text-[#603F26] font-inter">Unit price</th>
                <th className="py-2 px-4 text-left font-bold text-[#603F26] font-inter">Total price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-200 border-b border-gray-300">
                <td className="py-2 px-4 text-[#603F26] font-inter">PC w/st</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">Description</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">x,xxx KG</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx.xx</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx,xxx</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-4 text-[#603F26] font-inter">PC w/st</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">Description</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">x,xxx KG</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx.xx</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx,xxx</td>
              </tr>
              <tr className="bg-gray-200 border-b border-gray-300">
                <td className="py-2 px-4 text-[#603F26] font-inter">PC w/st</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">Description</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">x,xxx KG</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx.xx</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx,xxx</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-4 text-[#603F26] font-inter">PC w/st</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">Description</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">x,xxx KG</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx.xx</td>
                <td className="py-2 px-4 text-[#603F26] font-inter">xx,xxx</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="text-[#603F26] text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>xx,xxx.xx</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping & Handling</p>
            <p>x,xxx.xx</p>
          </div>
          <div className="flex justify-between">
            <p>Tax rate</p>
            <p>x.xx %</p>
          </div>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="flex justify-between font-bold text-[#603F26] text-sm">
          <p>Total</p>
          <p>xx,xxx.xx</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
