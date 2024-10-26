import React, { useState } from 'react';

const OrderM = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const orders = [
    {
      customerID: '123456789',
      phoneNo: 'ศูนย์เบ็ดเตล็ดสินค้าเปิดตู้โชว์',
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      status: 'PENDING',
    },
    {
      customerID: '123456789',
      phoneNo: 'ศูนย์เบ็ดเตล็ดสินค้าเปิดตู้โชว์',
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      status: 'CANCEL',
    },
    {
      customerID: '123456789',
      phoneNo: 'ศูนย์เบ็ดเตล็ดสินค้าเปิดตู้โชว์',
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      status: 'PAID',
    },
    {
        customerID: '123456789',
        phoneNo: 'ศูนย์เบ็ดเตล็ดสินค้าเปิดตู้โชว์',
        name: 'PC WIRE',
        size: '04.00 MM',
        feature: 'SMOOTH',
        length: '06.00 M',
        weight: '2,000.00 KG',
        price: 'XXXXX.XX BAHT',
        status: 'PAID',
      },
  ];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setDropdownOpen(false); // Close dropdown after selecting an option
  };

  const filteredOrders = orders.filter((order) => {
    const productString = `${order.name} ${order.size} ${order.feature} ${order.length} ${order.weight}`.toLowerCase();
    return productString.includes(searchTerm.toLowerCase());
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  return (
    <div className="flex flex-col p-8 justify-center bg-white items-center h-full">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-3xl font-bold mb-4 text-[#603F26] font-inter">PURCHASE ORDER</h2>

        {/* Search Box and Sort Button */}
        <div className="mb-4 flex justify-end items-center">
          <div className="relative flex items-center space-x-4 mr-4">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#603F26] text-white py-2 px-4 rounded-lg font-inter font-bold justify-end"
              >
                Order by ▼
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
                  <div
                    onClick={() => handleSort('price')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26]"
                  >
                    Price
                  </div>
                  <div
                    onClick={() => handleSort('status')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26]"
                  >
                    Payment
                  </div>
                  <div
                    onClick={() => handleSort('customerID')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26]"
                  >
                    Customer ID
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative w-1/3">
            <img
              src="/icon/search.png"
              alt="Search Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border border-[#603F26] rounded-full w-full text-[#603F26] font-inter"
            />
          </div>
        </div>

        {/* Order Table */}
        <div className="overflow-y-auto max-h-[400px]">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#FFEAC5] text-[#603F26]">
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter rounded-tl-lg">CUSTOMER_ID</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">PHONE_NO</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">PRODUCT</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">PRICE</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">PAYMENT STATUS</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter rounded-tr-lg">DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.customerID}</td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.phoneNo}</td>
                  <td className="py-3 px-4 text-[#603F26] font-inter">
                    {`${order.name} / ${order.size}`}
                    <br />
                    {`${order.feature} / ${order.length}`}
                    <br />
                    {order.weight}
                  </td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.price}</td>
                  <td className={`py-3 px-4 text-center font-bold ${
                    order.status === 'PENDING' ? 'text-yellow-500' :
                    order.status === 'CANCEL' ? 'text-red-500' :
                    'text-green-500'
                  }`}>
                    {order.status === 'PENDING' && 'PENDING ON PURCHASE'}
                    {order.status === 'CANCEL' && 'CANCEL'}
                    {order.status === 'PAID' && 'PAID'}
                  </td>
                  <td className="py-3 px-4 text-center text-[#603F26] font-inter font-bold cursor-pointer underline">
                    Detail
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderM;
