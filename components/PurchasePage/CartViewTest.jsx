import React, { useEffect, useState } from 'react';

const CartView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders); // ดึงข้อมูลออเดอร์จาก localStorage
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <img src="/icon/Basket.png" alt="Cart Icon" className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">ORDER IN CART</h2>
      </div>

      {orders.map((order, index) => (
        <div key={index} className="flex mb-6 p-4 border-b-2 border-gray-300">
          <div className="w-1/4">
            <img src="/pic/PC-strand1.png" alt="Product" className="w-full h-auto rounded-lg" />
          </div>
          <div className="w-2/4 pl-4">
            {order.items.map((item, idx) => (
              <div key={idx}>
                <h3 className="font-bold">{item.product}</h3>
                <p className="text-sm">SIZE: {item.steelSize}</p>
                <p className="text-sm">WEIGHT: {item.weight}</p>
                <p className="text-sm">LENGTH: {item.length}</p>
                <p className="text-sm">FEATURE: {item.steelFeature}</p>
              </div>
            ))}
          </div>
          <div className="w-1/4 text-right">
            <p className="font-bold mb-4">XX,XXX.XX BAHT</p>
            <div className="flex justify-end items-center space-x-2">
              <button className="text-brown-500 p-2">
                <img src="/icon/Bookmark.png" alt="Bookmark Icon" className="w-5 h-5" />
              </button>
              <button className="text-red-500 p-2">
                <img src="/icon/Trash.png" alt="Trash Icon" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <p className="font-bold">SHIPPING</p>
        <p className="text-sm text-gray-500">ESTIMATED TIME : MONTHS DAYS</p>
        <button className="text-accent-900 underline text-sm">EDIT LOCATION</button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">FAVORITES</h3>
        <p className="text-sm text-gray-500">
          WANT TO VIEW YOUR BOOKMARKS? <a href="#" className="underline">JOIN US</a> OR <a href="#" className="underline">SIGN IN</a>
        </p>
      </div>
    </div>
  );
};

export default CartView;
