// When creating new order
await query(
    'INSERT INTO `order` (c_id, o_total_price, o_status_id, shipping_fee) VALUES (?, ?, 1, ?)',
    [customerId, totalPrice, shippingFee]
); 