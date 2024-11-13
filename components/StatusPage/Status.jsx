import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Status = () => {
	const [sortColumn, setSortColumn] = useState(null);
	const [sortOrder, setSortOrder] = useState('asc');
	const [searchTerm, setSearchTerm] = useState('');
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showOrderByOptions, setShowOrderByOptions] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch('/api/order/get_orders');
				const data = await response.json();
				
				if (data.success) {
					const formattedOrders = data.orders.map(order => ({
						orderId: order.o_id,
						price: `${Number(order.o_total_price).toLocaleString()} BAHT`,
						progress: order.progress || 0,
						status: order.status,
					}));
					setOrders(formattedOrders);
				}
			} catch (error) {
				console.error('Error fetching orders:', error);
			} finally {
				setLoading(false);
			}
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
		setShowOrderByOptions(false);
	};

	const getSortIcon = (column) => {
		if (sortColumn === column) {
			return sortOrder === 'asc' ? '▲' : '▼';
		}
		return '▲▼';
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'ยืนยันยอดเรียบร้อย':
				return 'text-[#FFA500]';  // Orange for preparing
			case 'จ่ายเงินแล้ว':
				return 'text-[#32CD32]';  // Green for success
			case 'กำลังดำเนินการ':
				return 'text-[#FFA500]';  // Orange for in progress
			case 'เสร็จสิ้น':
				return 'text-[#32CD32]';  // Green for completed
			case 'ยกเลิกออร์เดอร์':
				return 'text-[#FF0000]';  // Red for cancelled
			default:
				return 'text-gray-500';
		}
	};

	const filteredOrders = orders.filter((order) => {
		const productString = `${order.name} ${order.size} ${order.feature} ${order.length} ${order.weight}`.toLowerCase();
		return productString.includes(searchTerm.toLowerCase());
	});

	const sortedOrders = [...filteredOrders].sort((a, b) => {
		if (!sortColumn) return 0;

		let aValue, bValue;

		switch (sortColumn) {
			case 'orderId':
				aValue = a.orderId;
				bValue = b.orderId;
				break;
			case 'price':
				aValue = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
				bValue = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
				break;
			case 'progress':
				aValue = a.progress;
				bValue = b.progress;
				break;
			default:
				return 0;
		}

		if (sortOrder === 'asc') {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});

	const handleRowClick = (order) => {
		// Using Next.js router to navigate with query parameters
		router.push({
			pathname: '/order-status-details',
			query: {
					order: JSON.stringify(order),
					active: "STATUS"
			}
		});
	};

	return (
		<div className="flex flex-col lg:flex-row p-8 h-[calc(100dvh-4rem)] justify-center bg-white items-start">
			<div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg overflow-hidden h-[95%]">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-[#603F26] font-inter">MY ORDER</h2>
					<div className="flex items-center gap-4">
						<div className="relative">
							<button 
								className="bg-[#6B7280] text-white px-4 py-2 rounded-lg flex items-center gap-2"
								onClick={() => setShowOrderByOptions(!showOrderByOptions)}
							>
								<span className="text-xs">▲▼</span>
								Order By
							</button>
							
							{showOrderByOptions && (
								<div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border">
									<button
										className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
										onClick={() => handleSort('orderId')}
									>
										Order ID
										{sortColumn === 'orderId' && (
											<span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
										)}
									</button>
									<button
										className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
										onClick={() => handleSort('price')}
									>
										Price
										{sortColumn === 'price' && (
											<span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
										)}
									</button>
									<button
										className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
										onClick={() => handleSort('progress')}
									>
										Progress
										{sortColumn === 'progress' && (
											<span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
										)}
									</button>
								</div>
							)}
						</div>

						<div className="relative">
							<input
								type="text"
								placeholder="Search Product"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="p-2 pl-10 border border-gray-300 rounded-lg w-64"
							/>
							<img
								src="/icon/search.png"
								alt="Search"
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
							/>
						</div>
					</div>
				</div>

				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-3 text-left text-gray-500">ORDER ID</th>
							<th className="px-6 py-3 text-left text-gray-500">PRICE</th>
							<th className="px-6 py-3 text-left text-gray-500">PROGRESS</th>
							<th className="px-6 py-3 text-left text-gray-500">ORDER STATUS</th>
							<th className="px-6 py-3 text-left text-gray-500">DETAIL</th>
						</tr>
					</thead>
					<tbody>
						{sortedOrders.map((order, index) => (
							<tr key={index} className="border-b">
								<td className="px-6 py-4">{order.orderId}</td>
								<td className="px-6 py-4">{order.price}</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<div className="w-48 bg-gray-200 rounded-full h-2">
											<div
												className="bg-[#6B7280] h-2 rounded-full"
												style={{ width: `${order.progress}%` }}
											></div>
										</div>
										<span>{order.progress}%</span>
									</div>
								</td>
								<td className={`px-6 py-4 ${getStatusColor(order.status)}`}>
									{order.status}
								</td>
								<td className="px-6 py-4">
									<button
										onClick={() => router.push(`/order-details/${order.orderId}`)}
										className="bg-[#6B7280] text-white px-4 py-1 rounded-lg hover:bg-[#4B5563]"
									>
										DETAIL
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Status;
