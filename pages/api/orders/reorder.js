import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderId } = req.body;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get user ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (!sessions || sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        // Check if customer already has a cart
        let existingCart = await query(
            'SELECT cart_id FROM cart WHERE c_id = ?',
            [customerId]
        );

        let cartId;
        
        if (existingCart.length === 0) {
            // Create new cart if none exists
            await query(
                'INSERT INTO cart (c_id) VALUES (?)',
                [customerId]
            );
            
            // Get the new cart ID
            const newCart = await query(
                'SELECT cart_id FROM cart WHERE c_id = ?',
                [customerId]
            );
            cartId = newCart[0].cart_id;
        } else {
            cartId = existingCart[0].cart_id;
        }

        // Get products from the original order
        const orderProducts = await query(`
            SELECT p_id 
            FROM order_product 
            WHERE o_id = ?`,
            [orderId]
        );

        // Add products to cart_product
        for (const product of orderProducts) {
            await query(
                'INSERT INTO cart_product (cart_id, p_id) VALUES (?, ?)',
                [cartId, product.p_id]
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Products added to cart successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error adding products to cart' 
        });
    }
} 