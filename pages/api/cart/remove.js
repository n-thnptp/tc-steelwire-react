import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cartProductId } = req.body;

        await query(
            'DELETE FROM cart_product WHERE cart_product_id = ?',
            [cartProductId]
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Product removed from cart' 
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 