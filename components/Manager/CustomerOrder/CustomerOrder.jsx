import React, { useState, useEffect } from 'react';
import OrderDetailModal from './OrderDetailModal';
import { getOrderStatus } from '../../Utils/getOrderStatus';
import { formatDate } from '../../Utils/formatDate';
import AlertModal from './AlertModal';

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
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
      const data = await (await fetch('/api/manager/customer-order')).json();
      console.log(data);
      setOrders(data.order);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (shouldOpenModal && orderId) {
      setModalOpen(true);
      setShouldOpenModal(false);
    }
  }, [orderId, shouldOpenModal]);

  const toggleModal = (id = "") => {
    if (!modalOpen) {
      setOrderId(id);
      setShouldOpenModal(true);
    } else {
      setModalOpen(false);
      setOrderId("");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setDropdownOpen(false);
  };

  const selectOrder = (order) => {
    setSelectedOrders(prev => {
      if (prev.includes(order)) {
        return prev.filter(id => id !== order);
      } else {
        return [...prev, order];
      }
    });
  }

  const getNextStatus = (currentStatus) => {
    switch (Number(currentStatus)) {
      case 1: return 2;
      case 2: return 3;
      case 3: return 4;
      case 4: return 5;
      default: return currentStatus;
    }
  };

  const updateOrder = async () => {
    if (selectedOrders.length === 0) {
      showAlert(
        'No Orders Selected',
        'Please select orders to update',
        'error'
      );
      return;
    }

    try {
      const ordersByStatus = selectedOrders.reduce((acc, order) => {
        if (!acc[order.status]) {
          acc[order.status] = [];
        }
        acc[order.status].push(order);
        return acc;
      }, {});

      const updatePromises = Object.entries(ordersByStatus).map(async ([currentStatus, orders]) => {
        const nextStatus = getNextStatus(currentStatus);

        if (nextStatus === currentStatus) {
          return null;
        }

        return Promise.all(orders.map(async (order) => {
          const response = await fetch('/api/manager/update-order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: order.o_id,
              newStatus: nextStatus
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update order ${order.o_id}`);
          }

          return { orderId: order.o_id, nextStatus };
        }));
      });

      await Promise.all(updatePromises.filter(Boolean));

      setOrders(prevOrders =>
        prevOrders.map(order => {
          const updatedOrder = selectedOrders.find(selected => selected.o_id === order.o_id);
          if (updatedOrder) {
            return {
              ...order,
              status: getNextStatus(updatedOrder.status)
            };
          }
          return order;
        })
      );

      setSelectedOrders([]);

      showAlert(
        'Update Successful',
        `Successfully updated ${selectedOrders.length} orders`
      );

    } catch (error) {
      console.error('Error updating orders:', error);
      showAlert(
        'Update Failed',
        'Failed to update orders. Please try again.',
        'error'
      );
    }
  };

  const filteredOrders = orders.filter((item) => {
    const searchString = (
      item.o_id +
      item.c_id +
      formatDate(item.o_date) +
      item.o_total_price +
      getOrderStatus(item.status).label
    ).toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'orderId':
        aValue = a.o_id;
        bValue = b.o_id;
        break;
      case 'customerId':
        aValue = a.c_id;
        bValue = b.c_id;
        break;
      case 'date':
        aValue = new Date(a.o_date);
        bValue = new Date(b.o_date);
        break;
      case 'price':
        aValue = parseFloat(a.o_total_price);
        bValue = parseFloat(b.o_total_price);
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
    <div className="flex flex-col p-8 justify-center bg-white items-center h-full">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-3xl font-bold mb-4 text-[#603F26] font-inter">CUSTOMER ORDER</h2>

        <div className="mb-4 flex justify-end items-center">
          <div className="relative flex items-center space-x-4 mr-4">
            <div className="relative space-x-5">
              <div className="relative inline-block">
                <button
                  onClick={updateOrder}
                  disabled={selectedOrders.length === 0}
                  className={`py-2 px-6 rounded-3xl font-inter font-bold transition-all duration-200 ease-in-out
                      ${selectedOrders.length === 0
                      ? 'bg-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  UPDATE {selectedOrders.length > 0 && (
                    <span className="ml-1 bg-white text-primary-500 px-2 py-0.5 rounded-full text-sm">
                      {selectedOrders.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-primary-500 text-white py-2 px-4 rounded-3xl font-inter font-bold justify-end"
              >
                Order by ▼
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div
                    onClick={() => handleSort('orderId')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26] flex justify-between items-center"
                  >
                    Order ID
                    {sortColumn === 'orderId' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div
                    onClick={() => handleSort('customerId')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26] flex justify-between items-center"
                  >
                    Customer ID
                    {sortColumn === 'customerId' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div
                    onClick={() => handleSort('date')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26] flex justify-between items-center"
                  >
                    Date
                    {sortColumn === 'date' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div
                    onClick={() => handleSort('price')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26] flex justify-between items-center"
                  >
                    Price
                    {sortColumn === 'price' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                  <div
                    onClick={() => handleSort('status')}
                    className="cursor-pointer p-2 hover:bg-gray-100 text-[#603F26] flex justify-between items-center"
                  >
                    Status
                    {sortColumn === 'status' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
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
              placeholder="Search Order"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border border-[#603F26] rounded-full w-full text-[#603F26] font-inter"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[400px]">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#D3D3D3] text-[#603F26]">
                <th className="py-3 px-4 text-center rounded-tl-lg font-bold text-[#603F26] font-inter">ORDER ID</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">CUSTOMER_ID</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">ORDER DATE</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">TOTAL PRICE</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">ORDER STATUS</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter">DETAIL</th>
                <th className="py-3 px-4 text-center font-bold text-[#603F26] font-inter rounded-tr-lg">Edit status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-b h-32">
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.o_id}</td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.c_id}</td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{formatDate(order.o_date)}</td>
                  <td className="py-3 px-4 text-[#603F26] font-inter text-center">{order.o_total_price}</td>
                  <td className={`py-3 px-4 text-center font-bold ${getOrderStatus(order.status).color}`}>
                    {getOrderStatus(order.status).label}
                  </td>
                  <td className="py-3 px-4 text-center text-[#603F26] font-inter font-bold cursor-pointer underline" onClick={() => toggleModal(order.o_id)}>
                    Detail
                  </td>
                  <td className="py-3 px-4 text-center text-[#603F26] font-inter font-bold">
                    {order.status < 4 ? <div onClick={() => selectOrder(order)} className={`py-2 px-2 rounded-2xl text-white transition-colors duration-200 ease-in-out cursor-pointer
                        ${selectedOrders.includes(order) ? 'bg-status-success' : 'bg-primary-300'}`}>READY

                    </div> : <div></div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
        <OrderDetailModal isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setOrderId("");
          }}
          orderId={orderId} />
      </div>
    </div>
  );
};

export default CustomerOrder;