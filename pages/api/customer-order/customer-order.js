import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Get order from database
        const [order] = await query(
            'SELECT * FROM `order`'
        );
        return res.status(200).json({ order });

    } catch (error) {
        console.error('order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}