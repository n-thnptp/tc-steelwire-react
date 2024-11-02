import React, { useState, useEffect } from 'react';
import { TbArrowsSort } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { formatNumber } from '../../Utils/formatNumber';
import { IoSearchOutline } from "react-icons/io5";
import AlertModal from '../AlertModal';

const UpdateStockTable = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    price: '',
    amount: ''
  });
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
    const fetchStock = async () => {
      const data = await (await fetch('/api/manager/stock')).json();
      setMaterials(data.materials);
      console.log(data.materials);
    };
    fetchStock();
  }, []);

  useEffect(() => {
    if (selectedMaterial) {
      setEditForm({
        price: selectedMaterial.price,
        amount: selectedMaterial.total_amount
      });
    }
  }, [selectedMaterial]);

  const validateForm = () => {
    if (!editForm.price || isNaN(editForm.price)) {
      showAlert('Validation Error', 'Please enter a valid price', 'error');
      return false;
    }
    if (!editForm.amount || isNaN(editForm.amount) || editForm.amount < 0) {
      showAlert('Validation Error', 'Please enter a valid amount', 'error');
      return false;
    }
    return true;
  };

  const handleSort = (column) => {
    setIsOrderMenuOpen(false);
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedData = [...materials]
    .filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.sm_id.toString().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.size.toString().includes(searchLower) ||
        item.total_amount.toString().includes(searchLower) ||
        item.price.toString().includes(searchLower) ||
        (item.total_amount >= item.min_amount ? 'in stock' :
          item.total_amount > 0 ? 'low stock' : 'out of stock')
          .toLowerCase()
          .includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;

      let aValue, bValue;

      switch (sortColumn) {
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;

        case 'amount':
          aValue = parseFloat(a.total_amount);
          bValue = parseFloat(b.total_amount);
          break;

        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;

        case 'available':

          const getAvailableWeight = (status) => {
            if (status >= status.min_amount) return 3;
            if (status > 0) return 2;
            return 1;
          };

          aValue = getAvailableWeight(a.total_amount);
          bValue = getAvailableWeight(b.total_amount);
          break;

        default:
          aValue = a[sortColumn];
          bValue = b[sortColumn];
      }

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleEditClick = (material) => {
    setSelectedMaterial(material);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/manager/edit-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId: selectedMaterial.sm_id,
          price: parseFloat(editForm.price),
          amount: parseFloat(editForm.amount)
        }),
      });

      if (response.ok) {

        const data = await (await fetch('/api/manager/stock')).json();
        setMaterials(data.materials);

        setIsEditModalOpen(false);
        showAlert(
          'Update Successful',
          'Stock has been updated successfully'
        );
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update stock');
      }
    } catch (error) {
      showAlert(
        'Update Failed',
        `Failed to update stock: ${error.message}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto relative">
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <h2 className="text-3xl font-bold text-primary-800 mb-4 font-inter">STOCK</h2>
          {/* Order By Button */}
          <div className="mb-4 flex justify-end">
            <div className="relative">
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
                    onClick={() => handleSort('size')}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                  >
                    Size
                  </li>
                  <li
                    onClick={() => handleSort('amount')}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                  >
                    Amount
                  </li>
                  <li
                    onClick={() => handleSort('price')}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                  >
                    Price
                  </li>
                  <li
                    onClick={() => handleSort('available')}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary-500 font-semibold"
                  >
                    Available
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Search Box */}
        <div className="relative w-1/3">
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


      {/* Stock Table */}
      <div className="overflow-y-auto max-h-90">
        <table className="min-w-full bg-white rounded-lg text-primary-600 font-bold font-inter text-base">
          <thead className="bg-[#D3D3D3] rounded-t-lg">
            <tr>
              <th className="py-3 px-4 text-center font-bold rounded-tl-lg">MATERIAL ID</th>
              <th className="py-3 px-4 text-center font-bold">STEEL TYPE</th>
              <th className="py-3 px-4 text-center font-bold">STEEL SIZE</th>
              <th className="py-3 px-4 text-center font-bold">AMOUNT</th>
              <th className="py-3 px-4 text-center font-bold">PRICE</th>
              <th className="py-3 px-4 text-center font-bold">AVAILABLE</th>
              <th className="py-3 px-4 text-center font-bold rounded-tr-lg">EDIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-300 cursor-pointer h-24">
                <td className="py-3 px-4 text-center">{item.sm_id}</td>
                <td className="py-3 px-4 text-center">PC {item.type}</td>
                <td className="py-3 px-4 text-center">{item.size} MM</td>
                <td className="py-3 px-4 text-center">{formatNumber(item.total_amount)} KG</td>
                <td className="py-3 px-4 text-center">{item.price}</td>
                <td className="py-3 px-4 text-center">
                  <span className={
                    item.total_amount >= item.min_amount
                      ? 'text-status-success'
                      : item.total_amount > 0
                        ? 'text-status-warning'
                        : 'text-status-error'
                  }>
                    {item.total_amount >= item.min_amount
                      ? 'IN STOCK'
                      : item.total_amount > 0
                        ? 'LOW STOCK'
                        : 'OUT OF STOCK'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className='bg-primary-700 font-medium py-2 px-5 rounded-3xl text-white w-full'
                  >
                    EDIT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedMaterial && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white relative rounded-lg p-8 w-full max-w-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-primary-800 mb-6 text-center">UPDATE MATERIAL STOCK</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-primary-500 mb-2">MATERIAL ID</label>
                <input
                  type="text"
                  value={selectedMaterial.sm_id}
                  disabled
                  className="w-full py-3 px-5 opacity-50 border border-primary-400 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-primary-500 mb-2">PRICE/KG</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={editForm.price}
                  onChange={handleInputChange}
                  className="w-full py-3 px-5 border border-primary-400 rounded-xl bg-white"
                  placeholder="Enter price per KG"
                />
              </div>

              <div>
                <label className="block text-primary-500 mb-2">AMOUNT</label>
                <input
                  type="number"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleInputChange}
                  className="w-full py-3 px-5 border border-primary-400 rounded-xl bg-white"
                  placeholder="Enter amount in KG"
                />
              </div>

              <div className='w-full flex justify-center'>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-1/2 bg-primary-700 text-white py-4 rounded-3xl mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(false)}
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
  );
};

export default UpdateStockTable;