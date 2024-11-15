import query from '../../../lib/db';
import { parse } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get customer ID from query params or headers
        const customerId = req.query.userId || req.headers['user-id'];
        
        if (!customerId) {
            return res.status(401).json({ error: 'User ID not provided' });
        }

        // Fix the SQL query syntax
        const retrieveItems = await query(
            `SELECT 
                p.*,
                ms.size, 
                ms.price,
                mt.mt_id,
                mt.name AS material_type_name,
                (p.weight * ms.price) AS total_price
            FROM cart_product cp
            JOIN cart c ON cp.cart_id = c.cart_id
            JOIN product p ON cp.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_size ms ON sm.ms_id = ms.ms_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            WHERE c.c_id = ?`,
            [customerId]
        );

        console.log('Retrieved items:', retrieveItems); // Debug log

        return res.status(200).json({
            success: true,
            items: retrieveItems
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}