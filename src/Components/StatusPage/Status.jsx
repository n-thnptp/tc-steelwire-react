import React, { useState } from 'react';

const Status = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 50,
      status: 'IN PROGRESS',
    },
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 0,
      status: 'CANCEL',
    },
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 0,
      status: 'PENDING ON PURCHASE',
    },
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 0,
      status: 'CANCEL',
    },
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 0,
      status: 'CANCEL',
    },
    {
      name: 'PC WIRE',
      size: '04.00 MM',
      feature: 'SMOOTH',
      length: '06.00 M',
      weight: '2,000.00 KG',
      price: 'XXXXX.XX BAHT',
      progress: 0,
      status: 'CANCEL',
    },
    // เพิ่มรายการอื่น ๆ ตามต้องการ
  ];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '▲▼';
  };

  const getStatusColor = (status) => {
    if (status === 'IN PROGRESS') {
      return 'text-green-500';
    }
    if (status === 'CANCEL') {
      return 'text-red-500';
    }
    if (status === 'PENDING ON PURCHASE') {
      return 'text-yellow-500';
    }
    return 'text-gray-500'; // กำหนดสีเริ่มต้น
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
    <div className="flex flex-col lg:flex-row p-8 justify-center bg-white items-start h-full" style={{ height: 'calc(96.3vh - 50px)' }}>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg overflow-hidden h-[95%]">
        <h2 className="text-3xl font-bold mb-4 text-[#603F26] font-inter">MY ORDER</h2>

        {/* Search Box */}
        <div className="mb-4 flex justify-end text-[#603F26] font-inter opacity-[50%]">
          <div className="relative w-1/4">
            <img
              src="/icon/search.png"
              alt="Search Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 "
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
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full bg-white rounded-lg h-[70%]">
            <thead>
              <tr className="bg-[#FFEAC5] text-[#603F26]">
                <th className="py-3 px-4 text-center font-bold cursor-pointer text-[#603F26] font-inter rounded-tl-2xl" onClick={() => handleSort('product')}>
                  PRODUCT {getSortIcon('product')}
                </th>
                <th className="py-3 px-4 text-center font-bold cursor-pointer text-[#603F26] font-inter" onClick={() => handleSort('price')}>
                  PRICE {getSortIcon('price')}
                </th>
                <th className="py-3 px-4 text-center font-bold cursor-pointer text-[#603F26] font-inter" onClick={() => handleSort('progress')}>
                  PROGRESS {getSortIcon('progress')}
                </th>
                <th className="py-3 px-4 text-center font-bold cursor-pointer text-[#603F26] font-inter rounded-tr-2xl" onClick={() => handleSort('status')}>
                  PAYMENT STATUS {getSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 text-[#603F26] font-inter">
                    {`${order.name} / ${order.size} / ${order.feature}`}
                    <br />
                    {`${order.length} / ${order.weight}`}
                  </td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.price}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-3/4 h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-full bg-[#6A462F] rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-[#603F26] font-inter">{order.progress}%</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-center font-bold font-inter ${getStatusColor(order.status)}`}>
                    {order.status}
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

export default Status;
