import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, newStatus } = req.body;

    console.log(orderId, newStatus);

    if (!orderId || !newStatus) {
      return res.status(400).json({ error: 'Order ID and new status are required' });
    }

    if (newStatus !== 2) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await query(
      `
            UPDATE shop_material_order 
            SET smos_id = ?
            WHERE smo_id = ?
            `,
      [newStatus, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await query(
      `
            SELECT smo_id, smos_id 
            FROM shop_material_order 
            WHERE smo_id = ?
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