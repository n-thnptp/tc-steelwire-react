import React, { useState } from 'react';

const Status = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

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
      statusColor: 'text-green-500',
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
      statusColor: 'text-red-500',
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

  return (
    <div className="flex flex-col lg:flex-row p-8 justify-center bg-white items-start h-full" style={{ height: 'calc(95.5vh - 50px)' }}>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg overflow-hidden h-[95%]">
        <h2 className="text-3xl font-bold mb-4">MY ORDER</h2>

        {/* Search Box */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search Product"
            className="p-2 border border-gray-300 rounded-full w-1/4"
          />
        </div>

        {/* Order Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full bg-white rounded-lg h-[70%]">
            <thead>
              <tr className="bg-[#FFEAC5] text-[#603F26]">
                <th className="py-3 px-4 text-left font-bold cursor-pointer" onClick={() => handleSort('product')}>
                  PRODUCT {getSortIcon('product')}
                </th>
                <th className="py-3 px-4 text-left font-bold cursor-pointer" onClick={() => handleSort('price')}>
                  PRICE {getSortIcon('price')}
                </th>
                <th className="py-3 px-4 text-left font-bold cursor-pointer" onClick={() => handleSort('progress')}>
                  PROGRESS {getSortIcon('progress')}
                </th>
                <th className="py-3 px-4 text-left font-bold cursor-pointer" onClick={() => handleSort('status')}>
                  PAYMENT STATUS {getSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">
                    {/* แสดงข้อมูลสินค้าตามที่กำหนด */}
                    {`${order.name} / ${order.size} / ${order.feature} / ${order.length} / ${order.weight}`}
                  </td>
                  <td className="py-3 px-4">{order.price}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-3/4 h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-full bg-[#6A462F] rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-[#603F26]">{order.progress}%</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${order.statusColor} font-bold`}>{order.status}</td>
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
