import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { total_price, shipping_fee, subtotal } = req.body;
        const sessionId = req.cookies.sessionId;

        // Validate prices
        if (total_price !== subtotal + shipping_fee) {
            return res.status(400).json({ 
                message: 'Invalid total price. Must equal subtotal + shipping fee' 
            });
        }

        // Get customer ID from session
        const [sessionResult] = await query(
            'SELECT c_id FROM sessions WHERE session_id = ?',
            [sessionId]
        );

        if (!sessionResult) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const customer_id = sessionResult.c_id;

        // Set current_user_id for trigger
        await query('SET @current_user_id = ?', [customer_id]);

        // Get cart items
        const cartItems = await query(`
            SELECT 
                p.*,
                sm.mt_id,
                sm.ms_id,
                sm.total_amount as current_stock,
                sm.sm_id
            FROM cart c
            JOIN cart_product cp ON c.cart_id = cp.cart_id
            JOIN product p ON cp.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            WHERE c.c_id = ?`,
            [customer_id]
        );

        // Check stock availability
        for (const item of cartItems) {
            if (parseFloat(item.current_stock) < parseFloat(item.weight)) {
                return res.status(400).json({
                    message: `Not enough stock for material ID ${item.sm_id}`
                });
            }
        }

        // Create order with subtotal
        const orderResult = await query(
            `INSERT INTO \`order\` (
                c_id, 
                subtotal,
                o_total_price, 
                o_status_id, 
                o_date, 
                shipping_fee, 
                o_estimated_shipping_day
            )
            VALUES (?, ?, ?, 1, NOW(), ?, 3)`,
            [customer_id, subtotal, total_price, shipping_fee]
        );

        const orderId = orderResult.insertId;

        // Update stock and move products
        for (const item of cartItems) {
            // Update stock
            await query(
                `UPDATE shop_material 
                SET total_amount = total_amount - ?
                WHERE sm_id = ?`,
                [item.weight, item.sm_id]
            );

            // Link product to order
            await query(
                `INSERT INTO order_product (o_id, p_id)
                VALUES (?, ?)`,
                [orderId, item.p_id]
            );
        }

        // Clear cart
        const [cartResult] = await query(
            'SELECT cart_id FROM cart WHERE c_id = ?',
            [customer_id]
        );

        if (cartResult) {
            await query(
                'DELETE FROM cart_product WHERE cart_id = ?',
                [cartResult.cart_id]
            );
        }

        return res.status(200).json({
            success: true,
            orderId: orderId,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ 
            success: false,
            message: error.message || 'Internal server error' 
        });
    }
}
