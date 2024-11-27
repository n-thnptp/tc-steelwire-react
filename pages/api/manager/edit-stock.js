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

    const { materialId, amount, price } = req.body;

    const updateAmount = await query(
      `
      UPDATE shop_material 
      SET total_amount = ? 
      WHERE sm_id = ?
      `,
      [amount, materialId]
    );

    const updatePrice = await query (
      `
      UPDATE material_size 
      SET price = ?
      WHERE ms_id = (
          SELECT ms_id
          FROM shop_material
          WHERE sm_id = ?
      )
      `,
      [price, materialId]
    )

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      updates: {
        amount: updateAmount,
        price: updatePrice
      }
    });

  } catch (error) {
    console.error('Error send requisition:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}