import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId, courierId } = req.body;

    if (!orderId || !courierId) {
      return res.status(400).json({ message: 'Order ID and courier ID are required' });
    }

    // Update order with courier
    await query(
      'UPDATE `order` SET courier_id = ? WHERE o_id = ?',
      [courierId, orderId]
    );

    // Get courier name
    const [courier] = await query(
      'SELECT name FROM courier WHERE courier_id = ?',
      [courierId]
    );

    return res.status(200).json({
      success: true,
      message: 'Courier assigned successfully',
      courierName: courier.name
    });

  } catch (error) {
    console.error('Error assigning courier:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 