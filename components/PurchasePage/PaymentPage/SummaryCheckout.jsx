import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditAddress from '../../Profile/EditAddress';

const SummaryCheckout = ({ orderId, selectedFile, isPromptPayOpen }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState(null);
  const [shippingFee, setShippingFee] = useState(3500); // Default shipping fee
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchAddress();
    if (router.query.orderId) {
      fetchOrderDetails(router.query.orderId);
    }
  }, [router.query.orderId]);

  const fetchAddress = async () => {
    console.log("fetchAddress called");
    try {
      const response = await fetch('/api/user/shipping-address');
      const data = await response.json();
      console.log('Shipping address response:', data);

      if (data.success) {
        setAddress(data.address);
        
        // Calculate shipping fee based on province
        const isFreeShippingZone = [1, 2, 3, 4, 58, 59].includes(data.address.province_id);
        console.log('Province ID:', data.address.province_id);
        console.log('Is free shipping zone:', isFreeShippingZone);
        
        const newShippingFee = isFreeShippingZone ? 0 : 3500;
        console.log('New shipping fee:', newShippingFee);
        setShippingFee(newShippingFee);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/order/${orderId}`);
      const data = await response.json();
      console.log('Order details response:', data);
      
      if (data.success) {
        setOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/order/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/history');
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order: ' + error.message);
    }
  };

  const handleCheckout = async () => {
    if (isPromptPayOpen && !selectedFile) {
      alert('Please upload your payment slip first');
      return;
    }

    setLoading(true);
    try {
      if (isPromptPayOpen && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('orderId', orderId);
        formData.append('amount', orderDetails?.o_total_price);

        const response = await fetch('/api/payment/upload-slip', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to process payment');
        }

        const data = await response.json();
        console.log('Payment processed:', data);
        
        if (data.success) {
          router.push('/status');
        }
      } else {
        // Update order status without slip
        const response = await fetch(`/api/order/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            statusId: 2
          }),
        });

        if (response.ok) {
          router.push('/status');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    console.log("Address updated, fetching new data...");
    // Fetch immediately after save
    await fetchAddress();
    setIsEditAddressOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between h-full p-6">
      <h2 className="text-3xl font-bold mb-4 text-left font-inter text-[#4C4C60]">SUMMARY</h2>

      {/* Delivery Address */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-[#4C4C60] font-inter">DELIVERY ADDRESS</p>
          <button 
            onClick={() => setIsEditAddressOpen(true)} 
            className="bg-[#4C4C60] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg font-inter"
          >
            EDIT
          </button>
        </div>
        {address && (
          <>
            <p className="text-sm text-[#4C4C60] font-semibold font-inter">
              {address.customer_name}
            </p>
            <p className="text-sm text-[#4C4C60] font-inter">
              {address.address}
            </p>
            <p className="text-sm text-[#4C4C60] font-inter">
              {address.phone}
            </p>
          </>
        )}
        <hr className="my-2 border-t border-gray-300 mb-6" />
      </div>

      {/* Order Summary */}
      {orderDetails && (
        <div className="mb-4 border-b pb-4">
          <p className="flex justify-between mb-3 text-[#4C4C60] font-bold font-inter">
            <span>SUBTOTAL</span> 
            <span>{(orderDetails.o_total_price - shippingFee).toLocaleString()} BAHT</span>
          </p>
          <p className="flex justify-between text-[#4C4C60] font-bold font-inter mb-6">
            <span>SHIPPING FEE</span> 
            <span>{shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} BAHT`}</span>
          </p>
          <hr className="my-2 border-t border-gray-300 mb-6" />
          <p className="flex justify-between text-[#4C4C60] font-bold font-inter mb-3">
            <span>TOTAL</span> 
            <span>{orderDetails.o_total_price.toLocaleString()} BAHT</span>
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col items-center">
        {/* Checkout button */}
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-full font-bold ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#4C4C60] text-white hover:bg-[#3A3A4A]'
          }`}
        >
          {loading ? 'Processing...' : 'CHECKOUT'}
        </button>

        {/* Cancel button */}
        <button 
          onClick={handleCancel}
          className="w-[15%] fixed bottom-11 left-12 bg-transparent text-red-500 border-2 border-red-500 p-3 rounded-full font-bold hover:bg-red-50 transition-colors"
        >
          CANCEL
        </button>
      </div>

      {isEditAddressOpen && (
        <EditAddress 
          userData={address}
          onClose={() => setIsEditAddressOpen(false)}
          onSave={handleAddressUpdate}
        />
      )}
    </div>
  );
};

export default SummaryCheckout;
