import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, productId } = req.body;

        // Check if user already has an active cart
        const existingCart = await query(
            'SELECT cart_id FROM cart WHERE c_id = ?',
            [userId]
        );

        let cartId;
        if (existingCart.length === 0) {
            // Create new cart if user doesn't have one
            const cartResult = await query(
                'INSERT INTO cart (c_id) VALUES (?)',
                [userId]
            );
            cartId = cartResult.insertId;
        } else {
            cartId = existingCart[0].cart_id;
        }

        // Add product to cart
        await query(
            'INSERT INTO cart_product (cart_id, p_id) VALUES (?, ?)',
            [cartId, productId]
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Product added to cart' 
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 