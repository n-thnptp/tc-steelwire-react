import React, { useState, useEffect } from 'react';
import { getMaterialOrderStatus } from '../../Utils/getMaterialOrderStatus';
import { formatDate } from '../../Utils/formatDate';
import { formatNumber } from '../../Utils/formatNumber';
import { TbArrowsSort } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import AlertModal from '../AlertModal';

const MaterialOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showAlert = (title, message, type = 'success') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await (await fetch('/api/manager/material-order')).json();

      setOrders(data.order);
    };
    fetchOrders();
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setIsOrderMenuOpen(false);
  };


  const getNextStatus = (currentStatus) => {
    switch (Number(currentStatus)) {
      case 1: return 2;
      default: return currentStatus;
    }
  };

  const updateOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manager/update-material-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.smo_id,
          newStatus: getNextStatus(selectedOrder.status)
        }),
      });

      if (response.ok) {

        setOrders(prevOrders =>
          prevOrders.map(order => {
            if (order.smo_id === selectedOrder.smo_id) {
              return {
                ...order,
                status: getNextStatus(order.status)
              };
            }
            return order;
          })
        );

        setIsDetailModalOpen(false);
        showAlert(
          'Accept Successful',
          `Successfully Accepted ${selectedOrder.smo_id} orders`
        );
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to accept order');
      }
    } catch (error) {
      showAlert(
        'Accept Failed',
        `Failed to accept order: ${error.message}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const filteredOrders = orders.filter((item) => {
    const searchString = (
      item.o_id +
      item.c_id +
      formatDate(item.o_date) +
      item.o_total_price +
      getMaterialOrderStatus(item.status).label
    ).toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'materialId':
        aValue = a.smo_id;
        bValue = b.smo_id;
        break;
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col p-8 justify-center bg-white items-center h-full pb-60">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-800 font-inter w-1/4">MATERIAL ORDER</h2>
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
                        onClick={() => handleSort('materialId')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Material ID
                      </li>
                      <li
                        onClick={() => handleSort('price')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Amount price
                      </li>
                      <li
                        onClick={() => handleSort('status')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Order status
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
                placeholder="Search Order"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-10 border border-primary-500 rounded-xl w-full text-primary-500 font-inter"
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto min-h-screen">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#D3D3D3] text-primary-800">
                <th className="py-3 px-4 text-center rounded-tl-lg font-bold text-primary-800 font-inter">MATERIAL ID</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">AMOUNT PRICE</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">ORDER STATUS</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter rounded-tr-lg">DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-b h-32">
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{order.sm_id}</td>
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{formatNumber(order.price)} BAHT</td>
                  <td className={`py-3 px-4 text-center font-bold ${getMaterialOrderStatus(order.status).color}`}>
                    {getMaterialOrderStatus(order.status).label}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {order.status === 1 && <button
                      onClick={() => handleDetailClick(order)}
                      className='bg-primary-700 font-medium py-2 px-4 rounded-3xl text-white w-full'
                    >
                      DETAIL
                    </button>}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsDetailModalOpen(false)}
          >
            <div
              className="bg-white relative rounded-lg p-8 w-full max-w-xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-primary-800 mb-6 text-center">ORDER DETAIL</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-primary-500 mb-2">SMO ID</label>
                  <input
                    type="text"
                    value={selectedOrder.sm_id}
                    disabled
                    className="w-full py-3 px-4 opacity-50 border border-primary-400 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-primary-500 mb-2">TYPE</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedOrder.price}
                    disabled
                    className="w-full py-3 px-4 opacity-50 border border-primary-400 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-primary-500 mb-2">SIZE</label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedOrder.size}
                    disabled
                    className="w-full py-3 px-4 opacity-50 border border-primary-400 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-primary-500 mb-2">AMOUNT</label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedOrder.quantity}
                    disabled
                    className="w-full py-3 px-4 opacity-50 border border-primary-400 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-primary-500 mb-2">PRICE</label>
                  <input
                    type="number"
                    name="amount"
                    value={selectedOrder.price}
                    disabled
                    className="w-full py-3 px-4 opacity-50 border border-primary-400 rounded-xl bg-white"
                  />
                </div>

                <div className='w-full flex justify-center'>
                  <button
                    onClick={updateOrder}
                    disabled={loading}
                    className={`w-1/2 bg-status-success text-white py-4 rounded-3xl mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {loading ? 'ACCEPING...' : 'ACCEPT DELIVERY'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-2 right-5 text-gray-500 hover:text-gray-700 text-2xl"
              >
                x
              </button>
            </div>
          </div>
        )}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </div>
  );
};

export default MaterialOrder;