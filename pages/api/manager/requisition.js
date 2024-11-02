import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { materialId, quantity } = req.body;

    if (!materialId || !quantity) {
      return res.status(400).json({ error: 'Material ID and quantity are required' });
    }

    const requisition = await query(
      `
      INSERT INTO shop_material_order
      (sm_id, order_date, quantity, smos_id) VALUES (?, ?, ?, ?)
      `,
      [materialId, new Date(), quantity, 1]
    );

    return res.status(200).json({
      message: 'Send requsition successfully',
      requisition: requisition
    });

  } catch (error) {
    console.error('Error send requisition:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}