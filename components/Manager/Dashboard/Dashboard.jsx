import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../Utils/formatNumber';

const ManagerDashboard = () => {
  const [timeframe, setTimeframe] = useState('WEEK');
  const [dashboardData, setDashboardData] = useState({
    salesData: [],
    stockStatus: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/manager/dashboard?timeframe=${timeframe}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const formatTooltipValue = (value, timeframe) => {
    const prefix = timeframe === 'MONTH' ? 'Week Total: ' : 'Total: ';
    return `${prefix}฿${formatNumber(value)}`;
  };

  const formatXAxis = (label) => {
    if (timeframe === 'WEEK') {
      return label.substring(0, 3);
    }
    return label;
  };

  return (
    <div className="p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className='flex justify-between items-center'>
            <h1 className="text-3xl font-bold text-primary-800 mb-4">Dashboard</h1>

            {/* Time Frame Selector */}
            <div className="flex gap-2 mb-6">
              {['WEEK', 'MONTH', 'YEAR'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-6 py-2 rounded-lg font-medium ${timeframe === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-primary-600'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">
                Sales Overview
                <span className="text-sm text-gray-500 ml-2">
                  ({timeframe.toLowerCase()})
                </span>
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatTooltipValue(value, timeframe),
                        'Sales'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_sales"
                      stroke="#8c8da4"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock Report (เหมือนเดิม) */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">Stock Report</h2>
              <div className="overflow-auto max-h-[300px]">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-primary-800 font-bold">Material Type</th>
                      <th className="px-4 py-3 text-left text-sm text-primary-800 font-bold">Material Size</th>
                      <th className="px-4 py-3 text-left text-sm text-primary-800 font-bold">Date Added</th>
                      <th className="px-4 py-3 text-left text-sm text-primary-800 font-bold">Stock Status</th>
                      <th className="px-4 py-3 text-left text-sm text-primary-800 font-bold">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.stockStatus.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-primary-500">{item.material_type}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{item.material_size}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">
                          {item.date_added === 'Never add' ? 'Never added' : new Date(item.date_added).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock_status === 'In Stock' ? 'bg-green-100 text-green-800' :
                            item.stock_status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {item.stock_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-500">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Orders Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">Recent Orders</h2>
              <div className="overflow-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Shop Mat. ID</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Material Type</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Material Size</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Date Added</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.recentOrders?.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-primary-500">{order.sm_id}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">PC {order.material_type}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{order.material_size}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">
                          {new Date(order.date_added).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-primary-500">{order.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Sellers */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">Best Seller Size</h2>
              <div className="overflow-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Shop Mat. ID</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Material Type</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-primary-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.bestSellers?.map((seller, index) => (
                      <tr key={index} className={index === 0 ? "bg-primary-100" : ""}>
                        <td className="px-4 py-3 text-sm text-primary-500">{seller.sm_id}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">PC {seller.material_type}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{seller.material_size}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{seller.weight_sold}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{seller.price_per_kg}</td>
                        <td className="px-4 py-3 text-sm text-primary-500">{seller.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;