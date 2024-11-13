import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderId } = req.body;

    try {
        await query(
            'UPDATE `order` SET o_status_id = 4 WHERE o_id = ?',
            [orderId]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 