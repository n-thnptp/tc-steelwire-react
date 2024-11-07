import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        const cartItems = await query(`
            SELECT 
                cp.cart_product_id,
                p.p_id,
                p.feature,
                p.weight,
                p.length,
                mt.name as material_type,
                ms.size,
                ms.price
            FROM cart c
            JOIN cart_product cp ON c.cart_id = cp.cart_id
            JOIN product p ON cp.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            JOIN material_size ms ON sm.ms_id = ms.ms_id
            WHERE c.c_id = ?
        `, [userId]);

        return res.status(200).json({ cartItems });

    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 