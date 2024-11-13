import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_id, product_id } = req.body;

    try {
        // First, get the cart_id for this user
        const cartResult = await query(
            'SELECT cart_id FROM cart WHERE c_id = ?',
            [user_id]
        );

        if (cartResult.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cart_id = cartResult[0].cart_id;

        // Delete only from cart_product
        await query(
            'DELETE FROM cart_product WHERE cart_id = ? AND p_id = ?',
            [cart_id, product_id]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}