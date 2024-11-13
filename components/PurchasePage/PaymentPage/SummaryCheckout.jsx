import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditAddress from '../EditAddress';

const SummaryCheckout = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState(null);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddress();
    if (router.query.orderId) {
      fetchOrderDetails(router.query.orderId);
    }
  }, [router.query.orderId]);

  const fetchAddress = async () => {
    try {
      const response = await fetch('/api/user/shipping-address');
      const data = await response.json();
      if (data.success) {
        setAddress(data.address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/order/${orderId}`);
      const data = await response.json();
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
      // Update order status to 5 (canceled)
      const response = await fetch(`/api/order/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: router.query.orderId,
          status: 5
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to history page
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
    try {
      // Update order status to 2 (paid/checked out)
      const response = await fetch(`/api/order/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: router.query.orderId,
          status: 2
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to status page
        router.push('/status');
      } else {
        throw new Error(data.message || 'Failed to complete checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete checkout: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between h-full p-6">
      <h2 className="text-3xl font-bold mb-4 text-left font-inter text-[#603F26]">SUMMARY</h2>

      {/* Delivery Address */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-[#603F26] font-inter">DELIVERY ADDRESS</p>
          <button 
            onClick={() => setIsEditAddressOpen(true)} 
            className="bg-[#6A462F] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg font-inter"
          >
            EDIT
          </button>
        </div>
        {address && (
          <>
            <p className="text-sm text-[#9A7B4F] font-semibold font-inter">
              {address.customer_name}
            </p>
            <p className="text-sm text-[#9A7B4F] font-inter">
              {address.address}
            </p>
            <p className="text-sm text-[#9A7B4F] font-inter">
              {address.phone}
            </p>
          </>
        )}
        <hr className="my-2 border-t border-gray-300 mb-6" />
      </div>

      {/* Order Summary */}
      {orderDetails && (
        <div className="mb-4 border-b pb-4">
          <p className="flex justify-between mb-3 text-[#603F26] font-bold font-inter">
            <span>SUBTOTAL</span> 
            <span>{(orderDetails.o_total_price - orderDetails.shipping_fee).toLocaleString()} BAHT</span>
          </p>
          <p className="flex justify-between text-[#603F26] font-bold font-inter mb-6">
            <span>ESTIMATED SHIPPING</span> 
            <span>{orderDetails.shipping_fee.toLocaleString()} BAHT</span>
          </p>
          <hr className="my-2 border-t border-gray-300 mb-6" />
          <p className="flex justify-between text-[#603F26] font-bold font-inter mb-3">
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
          className="w-[15%] fixed bottom-11 right-12 bg-[#4C4C60] text-white p-3 rounded-full shadow-lg font-bold hover:bg-[#3d3d4d] transition-colors"
        >
          CHECKOUT
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
          onClose={() => setIsEditAddressOpen(false)} 
          onUpdate={fetchAddress}
        />
      )}
    </div>
  );
};

export default SummaryCheckout;
