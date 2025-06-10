import { db } from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        // Get order items
        const orderItems = await db.query(`
            SELECT * FROM order_items 
            WHERE order_id = ?
        `, [id]);

        // Add items to cart (you'll need to implement this based on your cart system)
        // ...

        res.status(200).json({ message: 'Items added to cart' });
    } catch (error) {
        console.error('Error re-ordering:', error);
        res.status(500).json({ message: 'Error re-ordering' });
    }
} 