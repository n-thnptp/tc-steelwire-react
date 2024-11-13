import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { total_price, shipping_fee } = req.body;
    const sessionId = req.cookies.sessionId;

    try {
        // Get customer ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        try {
            // Create order record with proper backticks
            const orderResult = await query(
                'INSERT INTO `order` (c_id, o_date, o_status_id, o_total_price, o_estimated_shipping_day, shipping_fee) VALUES (?, NOW(), ?, ?, ?, ?)',
                [customerId, 3, total_price, 3, shipping_fee]
            );

            const orderId = orderResult.insertId;

            // Get cart items
            const cartItems = await query(
                'SELECT cp.p_id FROM cart c JOIN cart_product cp ON c.cart_id = cp.cart_id WHERE c.c_id = ?',
                [customerId]
            );

            // Move items to order_product
            for (const item of cartItems) {
                await query(
                    'INSERT INTO order_product (o_id, p_id) VALUES (?, ?)',
                    [orderId, item.p_id]
                );
            }

            // Clear cart_product
            const cart = await query('SELECT cart_id FROM cart WHERE c_id = ?', [customerId]);
            if (cart.length > 0) {
                await query('DELETE FROM cart_product WHERE cart_id = ?', [cart[0].cart_id]);
            }

            return res.status(200).json({ 
                success: true, 
                orderId: orderId 
            });

        } catch (error) {
            console.error('Transaction error:', error);
            throw error;
        }

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
}
