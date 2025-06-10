import query from '../../../lib/db';
import { setCurrentUser } from '../../../lib/middleware/setCurrentUser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await setCurrentUser(req);

    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
      return res.status(400).json({ error: 'Order ID and new status are required' });
    }

    if (newStatus < 1 || newStatus > 5) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await query(
      `
            UPDATE \`order\` 
            SET o_status_id = ?
            WHERE o_id = ?
            `,
      [newStatus, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await query(
      `
            SELECT o_id, o_status_id 
            FROM \`order\` 
            WHERE o_id = ?
            `,
      [orderId]
    );

    return res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}