import React, { useState, useEffect } from 'react';
import { formatDate } from '../../Utils/formatDate';
import { calculateDeliveryDate } from '../../Utils/calculateDeliveryDate';
import { formatNumber } from '../../Utils/formatNumber';

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await (await fetch(`/api/manager/order-detail?id=${orderId}`)).json();
      setOrder(data.order);
    };
    fetchOrders();
  }, [orderId]);

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (orderId === "") return null;

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClickOutside}
    >
      <div className="relative bg-white p-8 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* ปุ่มปิดตรงมุมขวาบน */}
        <button onClick={onClose} className="absolute top-4 right-4 text-primary-800 font-bold text-sm">
          X
        </button>

        <div className="text-primary-800 text-sm">
          <h3 className="text-lg font-bold mb-4">Purchase Order</h3>
          <p><strong>Date:</strong> {order?.o_date ? formatDate(order.o_date) : ''}</p>
          <p><strong>P.O. no.:</strong> {order?.o_id ?? ''}</p>
          <p><strong>Customer ID:</strong> {order?.c_id ?? ''}</p>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="text-primary-800 text-sm">
          <p><strong>Delivery Date:</strong> {calculateDeliveryDate(order?.o_date, order?.o_estimated_shipping_day)}</p>
          <p><strong>Ship via:</strong> {order?.courier_name ?? ''}</p>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="flex justify-between text-primary-800 text-sm">
          <div className='w-1/2 px-2'>
            <h4 className="font-bold">Vendor</h4>
            <p>TC steel factory</p>
            <p>TC steel factory</p>
            <p>191/3 moo 5</p>
            <p>thamasala meung naknonpathom 73000</p>
            <p>(+66) xx-xxx-xxxx</p>
            <p>Email@example.com</p>
          </div>
          <div className='w-1/2 px-2'>
            <h4 className="font-bold">Ship to</h4>
            <p>{order?.firstname} {order?.lastname}</p>
            <p>{order?.company}</p>
            <p>{order?.address}</p>
            <p>{order?.tambon} {order?.aumphur} {order?.province} {order?.zip_code}</p>
            <p>(+66) {order?.phone_number}</p>
            <p>{order?.email}</p>
          </div>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        {/* ตารางสินค้า */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg text-sm">
            <thead>
              <tr className="bg-primary-200 text-primary-800">
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Item</th>
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Size</th>
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Feature</th>
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Qty</th>
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Unit price</th>
                <th className="py-2 px-4 text-left font-bold text-primary-800 font-inter">Total price</th>
              </tr>
            </thead>
            <tbody>
              {order?.products.map((product) => (
                <tr className="border-b border-gray-300">
                  <td className="py-2 px-4 text-primary-800 font-inter">PC {product?.material_name ?? ''}</td>
                  <td className="py-2 px-4 text-primary-800 font-inter">{product?.size ?? ''}</td>
                  <td className="py-2 px-4 text-primary-800 font-inter">{product?.feature ?? ''}</td>
                  <td className="py-2 px-4 text-primary-800 font-inter">{product?.quantity ?? ''} KG</td>
                  <td className="py-2 px-4 text-primary-800 font-inter">{formatNumber(product?.price) ?? ''}</td>
                  <td className="py-2 px-4 text-primary-800 font-inter">{formatNumber(product?.quantity * product?.price) ?? ''}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="text-primary-800 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatNumber(order?.o_total_price - order?.shipping_fee) ?? ''}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping & Handling</p>
            <p>{formatNumber(order?.shipping_fee)}</p>
          </div>
        </div>

        <div className="my-4 border-t-2 border-gray-300">
          <hr />
        </div>

        <div className="flex justify-between font-bold text-primary-800 text-sm">
          <p>Total</p>
          <p>{formatNumber(order?.o_total_price)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
