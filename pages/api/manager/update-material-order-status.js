import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from session cookie
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [sessionResult] = await query(
      'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
      [sessionId]
    );

    if (!sessionResult) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Set current user ID for trigger
    await query('SET @current_user_id = ?', [sessionResult.c_id]);

    const { orderId, newStatus } = req.body;

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
            SELECT smo_id, smos_id, quantity 
            FROM shop_material_order 
            WHERE smo_id = ?
            `,
      [orderId]
    );


    const materialUpdate = await query(
      `
      UPDATE shop_material SET total_amount= total_amount + ?
      WHERE sm_id = (
      SELECT sm_id
      FROM shop_material_order
      WHERE smo_id = ?
      )
    `,
      [updatedOrder[0].quantity, orderId]
    );

    if (materialUpdate.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    return res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}