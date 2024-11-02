import React, { useState, useEffect } from 'react';
import OrderDetailModal from './OrderDetailModal';
import { getOrderStatus } from '../../Utils/getOrderStatus';
import { formatDate } from '../../Utils/formatDate';
import { formatNumber } from '../../Utils/formatNumber';
import { TbArrowsSort } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import AlertModal from '../AlertModal';

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
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
    setIsOrderMenuOpen(false);
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
    return searchString.includes(searchQuery.toLowerCase());
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
    <div className="flex flex-col p-8 justify-center bg-white items-center h-full pb-60">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-800 font-inter w-1/4">CUSTOMER ORDER</h2>
          <div className='flex items-center w-full justify-end'>

            <div className="relative flex items-center space-x-4 mr-4">
              <div className="relative space-x-5">
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
                        onClick={() => handleSort('orderId')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Order ID
                      </li>
                      <li
                        onClick={() => handleSort('customerId')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Customer ID
                      </li>
                      <li
                        onClick={() => handleSort('date')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Order date
                      </li>
                      <li
                        onClick={() => handleSort('price')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Total price
                      </li>
                      <li
                        onClick={() => handleSort('status')}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                      >
                        Status
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
                <th className="py-3 px-4 text-center rounded-tl-lg font-bold text-primary-800 font-inter">ORDER ID</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">CUSTOMER_ID</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">ORDER DATE</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">TOTAL PRICE</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">ORDER STATUS</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter">DETAIL</th>
                <th className="py-3 px-4 text-center font-bold text-primary-800 font-inter rounded-tr-lg">Edit status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-b h-32">
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{order.o_id}</td>
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{order.c_id}</td>
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{formatDate(order.o_date)}</td>
                  <td className="py-3 px-4 text-primary-800 font-inter text-center font-bold">{formatNumber(order.o_total_price)} BAHT</td>
                  <td className={`py-3 px-4 text-center font-bold ${getOrderStatus(order.status).color}`}>
                    {getOrderStatus(order.status).label}
                  </td>
                  <td className="py-3 px-4 text-center text-primary-800 font-inter font-bold cursor-pointer underline" onClick={() => toggleModal(order.o_id)}>
                    Detail
                  </td>
                  <td className="py-3 px-4 text-center text-primary-800 font-inter font-bold">
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