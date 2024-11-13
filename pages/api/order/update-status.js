import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderId, status } = req.body;
    const sessionId = req.cookies.sessionId;

    try {
        // Get customer ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (!sessions || sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        // Update order status
        await query(
            'UPDATE `order` SET o_status_id = ? WHERE o_id = ? AND c_id = ?',
            [status, orderId, customerId]
        );

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
} 