import React from 'react';

const CartView = () => {
  const items = [
    { 
      name: 'PC WIRE', 
      size: 'XX.XX MM', 
      weight: 'X,XXX.XX KG', 
      length: 'XX.XX M', 
      feature: 'SMOOTH / INDENTATIONS', 
      price: 'XX,XXX.XX BAHT',
      image: '/pic/PC-strand1.png' 
    },
    { 
      name: 'PC WIRE', 
      size: 'XX.XX MM', 
      weight: 'X,XXX.XX KG', 
      length: 'XX.XX M', 
      feature: 'SMOOTH / INDENTATIONS', 
      price: 'XX,XXX.XX BAHT',
      image: '/pic/PC-strand1.png' 
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <img src="/icon/Basket.png" alt="Cart Icon" className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">ORDER IN CART</h2>
      </div>

      {/* กล่องสินค้า - จำกัดความสูงและสามารถเลื่อนดูได้ */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}> {/* ล็อกความสูงและเพิ่มการเลื่อน */}
        {items.map((item, index) => (
          <div key={index} className="flex items-start mb-3 p-2">
            {/* แสดงรูปสินค้า */}
            <div className="w-1/4">
              <img src={item.image} alt="Product" className="w-full h-full rounded-lg object-cover" />
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="w-2/4 pl-4 flex flex-col justify-between ">
              <h3 className="font-bold mb-1">{item.name}</h3>
              <p className="text-sm mb-1">SIZE</p>
              <p className="text-sm mb-1">WEIGHT</p>
              <p className="text-sm mb-1">LENGTH</p>
              <p className="text-sm mb-1">FEATURE</p>

              {/* เส้นใต้ */}
              <hr className="my-2 border-t border-gray-300" />

              {/* ย้ายไอคอนลงมาไว้ข้างล่าง */}
              <div className="flex justify-start items-center space-x-2 mt-2">
                <button className="text-brown-500 p-2">
                  <img src="/icon/Bookmark.png" alt="Bookmark Icon" className="w-5 h-5" />
                </button>
                <button className="text-red-500 p-2">
                  <img src="/icon/Trash.png" alt="Trash Icon" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ราคาสินค้า */}
            <div className="w-1/4 text-right">
              <p className="font-bold mb-1">{item.price}</p>
              <p className="text-sm mb-1">{item.size}</p>
              <p className="text-sm mb-1">{item.weight}</p>
              <p className="text-sm mb-1">{item.length}</p>
              <p className="text-sm mb-1">{item.feature}</p>
            {/* เส้นใต้ */}
            <hr className="my-2 border-t border-gray-300 " />
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนของการจัดการจัดส่ง */}
      <div className="mt-6">
        <p className="font-bold">SHIPPING</p>
        <p className="text-sm text-gray-500">ESTIMATED TIME : MONTHS DAYS</p>
        <button className="text-accent-900 underline text-sm">EDIT LOCATION</button>
      </div>
    </div>
  );
};

export default CartView;
