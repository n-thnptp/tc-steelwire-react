import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { total_price, shipping_fee } = req.body;
        const sessionId = req.cookies.sessionId;

        // Get customer ID from session
        const [sessionResult] = await query(
            'SELECT c_id FROM sessions WHERE session_id = ?',
            [sessionId]
        );

        if (!sessionResult) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const customer_id = sessionResult.c_id;

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

        // Create order
        const orderResult = await query(
            `INSERT INTO \`order\` (c_id, o_total_price, o_status_id, o_date)
            VALUES (?, ?, 1, NOW())`,
            [customer_id, total_price]
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
