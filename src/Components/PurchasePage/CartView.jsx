import React, { useState } from 'react';
import EditAddress from './EditAddress';

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


  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditAddressOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditAddressOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <img src="/icon/Basket.png" alt="Cart Icon" className="w-6 h-6 mr-2" />
        <h2 className="text-xl text-[#603F26] font-bold font-inter">ORDER IN CART</h2>
      </div>

      {/* กล่อง x ครอบกล่อง r */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {items.map((item, index) => (
          // กล่อง r ครอบกล่อง i
          <div key={index} className="mb-3 p-2 flex-wrap">
            {/* กล่อง i ครอบกล่อง y และ g */}
            <div className="flex flex-wrap">
              {/* กล่อง y แสดงรูปสินค้า */}
              <div className="w-full sm:w-1/4 flex-shrink-0 mb-6">
                <img src={item.image} alt="Product" className="w-full h-full rounded-lg object-cover" />
              </div>

              {/* กล่อง g ครอบกล่อง n */}
              <div className="w-full sm:w-3/4 pl-4 flex flex-col justify-between">
                {/* กล่อง n ครอบกล่อง z และ c */}
                <div className="flex flex-col sm:flex-row justify-between">
                  {/* กล่อง z รายละเอียดสินค้า */}
                  <div className="hidden sm:block w-full sm:w-1/2 mb-2 sm:mb-0">
                    <h3 className="text-[#603F26] font-bold font-inter mb-1">{item.name}</h3>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">SIZE: </p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">WEIGHT: </p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">LENGTH: </p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">FEATURE: </p>
                    </div>
                    {/* เพิ่มข้อมูลจากกล่อง c ในหน้าจอเล็ก */}
                  <div className="block sm:hidden">
                    <h3 className="text-[#603F26] font-bold font-inter mb-1">{item.name}</h3>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">SIZE: {item.size}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">WEIGHT: {item.weight}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">LENGTH: {item.length}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">FEATURE: {item.feature}</p>
                  </div>
      

                  {/* กล่อง c ราคาสินค้า */}
                  <div className="hidden sm:block w-full sm:w-1/2 text-right">
                    <p className="text-[#603F26] font-bold font-inter mb-1">{item.price}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">{item.size}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">{item.weight}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">{item.length}</p>
                    <p className="text-[#603F26] font-bold font-inter mb-1 opacity-50">{item.feature}</p>
                  </div>
                </div>

                {/* กล่อง v มี GrayLine and icon */}
                <div className="flex flex-col mt-2">
                  {/* กล่องสำหรับเส้นใต้ */}
                  <div className="w-full">
                    <hr className="border-t border-gray-300" />
                  </div>
                  {/* กล่องสำหรับไอคอน */}
                  <div className="flex justify-start items-center space-x-2 mt-2">
                    <button className="text-brown-500 p-2">
                      <img src="/icon/Bookmark.png" alt="Bookmark Icon" className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 p-2">
                      <img src="/icon/Trash.png" alt="Trash Icon" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนของการจัดการจัดส่ง */}
      <div className="mt-6">
        <p className="text-[#603F26] font-bold font-inter">SHIPPING</p>
        <p className="font-inter text-gray-500">ESTIMATED TIME : MONTHS DAYS</p>
        <button onClick={handleEditClick} className="text-accent-900 underline text-sm font-bold font-inter">EDIT LOCATION</button>
      </div>

      {/* แสดงหน้าต่าง EditAddress ถ้า isEditAddressOpen เป็น true */}
      {isEditAddressOpen && <EditAddress onClose={handleCloseEdit} />}

    </div>
  );
};

export default CartView;
