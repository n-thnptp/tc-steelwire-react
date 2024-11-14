import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../Utils/formatNumber';
import { TbArrowsSort } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortTransaction, setSortTransaction] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await (await fetch('/api/manager/transaction')).json();
      console.log(data);
      setTransactions(data.transactions);
    };
    fetchOrders();
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortTransaction(sortTransaction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortTransaction('asc');
    }
    setIsOrderMenuOpen(false);
  };

  const filteredTransactions = transactions.filter((item) => {
    const searchString = (
      item.transaction_id +
      item.o_id +
      item.method +
      item.price
    ).toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'transactionId':
        aValue = a.o_id;
        bValue = b.o_id;
        break;
      case 'orderId':
        aValue = a.c_id;
        bValue = b.c_id;
        break;
      case 'method':
        aValue = a.o_date;
        bValue = b.o_date;
        break;
      case 'price':
        aValue = parseFloat(a.o_total_price);
        bValue = parseFloat(b.o_total_price);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortTransaction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortTransaction === 'asc' ? 1 : -1;
    return 0;
  });

  const SlipModal = ({ filename, onClose }) => {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 select-none"
        onClick={onClose}
      >
        <div 
          className="relative bg-white p-4 rounded-lg w-[400px]"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="max-h-[70vh] overflow-y-auto">
            <img 
              src={`/uploads/${filename}`} 
              alt="Payment Slip" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col p-8 justify-center bg-white items-center h-full pb-60">
        <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary-800 font-inter">TRANSACTION</h2>
            <div className='flex items-center w-full justify-end'>
              <div className="relative flex items-center space-x-4 mr-4">
                <div className="relative space-x-5">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
                      className="flex items-center gap-2 bg-primary-600 text-white py-4 px-4 rounded-lg font-inter text-sm"
                    >
                      <TbArrowsSort size={20} />
                      <span>Order By</span>
                      {isOrderMenuOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    {isOrderMenuOpen && (
                      <ul className="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-lg w-36">
                        <li
                          onClick={() => handleSort('transactionId')}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                        >
                          Transation ID
                        </li>
                        <li
                          onClick={() => handleSort('orderId')}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                        >
                          Order ID
                        </li>
                        <li
                          onClick={() => handleSort('method')}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                        >
                          Methods
                        </li>
                        <li
                          onClick={() => handleSort('price')}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                        >
                          Price
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative w-1/2">
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4'>
                  <IoSearchOutline />
                </div>
                <input
                  type="text"
                  placeholder="Search Transaction"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 pl-10 border border-primary-500 rounded-xl w-full text-primary-500 font-inter"
                />
              </div>
            </div>
          </div>

          <div className="min-h-screen">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-[#D3D3D3] text-primary-700">
                  <th className="py-3 px-4 text-center rounded-tl-lg font-bold text-primary-700 font-inter">TRANSACTION ID</th>
                  <th className="py-3 px-4 text-center font-bold text-primary-700 font-inter">ORDER ID</th>
                  <th className="py-3 px-4 text-center font-bold text-primary-700 font-inter">SLIP</th>
                  <th className="py-3 px-4 text-center font-bold text-primary-700 font-inter rounded-tr-lg">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b h-16">
                    <td className="py-3 px-4 text-primary-700 font-inter text-center font-bold">{transaction.transaction_id}</td>
                    <td className="py-3 px-4 text-primary-700 font-inter text-center font-bold">{transaction.o_id}</td>
                    <td className="py-3 px-4 text-primary-700 font-inter text-center font-bold">
                      {transaction.filename ? (
                        <button 
                          onClick={() => setSelectedSlip(transaction.filename)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Slip
                        </button>
                      ) : (
                        'No slip uploaded'
                      )}
                    </td>
                    <td className="py-3 px-4 text-primary-700 font-inter text-center font-bold">{formatNumber(transaction.price)} BAHT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedSlip && (
        <SlipModal 
          filename={selectedSlip} 
          onClose={() => setSelectedSlip(null)} 
        />
      )}
    </>
  );
};

export default TransactionTable;