import React, { useState } from 'react';

const StockTable = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const stockData = [
    { type: 'PC WIRE', size: '03.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'LOW STOCK' },
    { type: 'PC WIRE', size: '04.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'OUT OF STOCK' },
    { type: 'PC STRAND', size: '05.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'IN STOCK' },
    { type: 'PC STRAND', size: '06.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'IN STOCK' },
    { type: 'PC STRAND', size: '07.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'IN STOCK' },
    { type: 'PC STRAND', size: '08.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'IN STOCK' },
    { type: 'PC STRAND', size: '09.00 MM', amount: 'XXX.XX KG', price: 'XXXXX.XX BAHT', available: 'IN STOCK' },
    // เพิ่มข้อมูลเพิ่มเติมเพื่อทดสอบการเลื่อน
  ];

  const handleSort = (column) => {
    setIsOrderMenuOpen(false);
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedStockData = [...stockData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleRowClick = (column, item) => {
    if (['type', 'size', 'amount', 'price'].includes(column) && item.available === 'IN STOCK') {
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto relative">
      <h2 className="text-3xl font-bold text-[#603F26] mb-4 font-inter">STOCK</h2>

      {/* ปุ่ม Order By */}
      <div className="mb-4 flex justify-end">
        <div className="relative">
          <button
            onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
            className="bg-[#603F26] text-white py-3 px-4 rounded-lg font-inter font-bold text-base justify-end"
          >
            <span>Order by ▼</span>
          </button>
          {isOrderMenuOpen && (
            <ul className="absolute mt-2 bg-white border rounded shadow-lg">
              <li onClick={() => handleSort('price')} className="px-4 py-2 cursor-pointer hover:bg-gray-200">Price</li>
              <li onClick={() => handleSort('amount')} className="px-4 py-2 cursor-pointer hover:bg-gray-200">Amount</li>
              <li onClick={() => handleSort('size')} className="px-4 py-2 cursor-pointer hover:bg-gray-200">Size</li>
            </ul>
          )}
        </div>
      </div>

      {/* ตารางสต็อก */}
      <div className="overflow-y-auto max-h-90"> {/* ตั้ง max-height และ overflow สำหรับการเลื่อน */}
        <table className="min-w-full bg-white rounded-lg text-[#603F26] font-bold font-inter text-base"> {/* text-base ทำให้ขนาดเท่ากับ OrderM */}
          <thead className="bg-[#D3D3D3] rounded-t-lg">
            <tr>
              <th className="py-3 px-4 text-center font-bold rounded-tl-lg">STEEL TYPE</th>
              <th className="py-3 px-4 text-center font-bold">STEEL SIZE</th>
              <th className="py-3 px-4 text-center font-bold">AMOUNT</th>
              <th className="py-3 px-4 text-center font-bold">PRICE</th>
              <th className="py-3 px-4 text-center font-bold rounded-tr-lg">AVAILABLE</th>
            </tr>
          </thead>
          <tbody>
            {sortedStockData.map((item, index) => (
              <tr key={index} className="border-b border-gray-300 cursor-pointer">
                <td
                  className="py-3 px-4 text-center"
                  onClick={() => handleRowClick('type', item)}
                >
                  {item.type}
                </td>
                <td
                  className="py-3 px-4 text-center"
                  onClick={() => handleRowClick('size', item)}
                >
                  {item.size}
                </td>
                <td
                  className="py-3 px-4 text-center"
                  onClick={() => handleRowClick('amount', item)}
                >
                  {item.amount}
                </td>
                <td
                  className="py-3 px-4 text-center"
                  onClick={() => handleRowClick('price', item)}
                >
                  {item.price}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.available === 'IN STOCK' ? (
                    <span className="text-green-600" onClick={() => handleRowClick('price', item)}>{item.available}</span>
                  ) : (
                    <a
                      href="/manager/stock"
                      className={`${item.available === 'OUT OF STOCK' ? 'text-red-600' : item.available === 'LOW STOCK' ? 'text-yellow-500' : 'text-green-600'}`}
                    >
                      {item.available} +
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClosePopup}
        >
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
            >
              &times;
            </button>
            {/* เนื้อหาของ Popup */}
            <h2 className="text-2xl font-bold text-[#603F26] text-center font-inter">Empty Popup</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTable;
