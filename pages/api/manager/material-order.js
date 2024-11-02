import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const order = await query(
      `
        SELECT
            smo.smo_id,
            smo.sm_id,
            smo.order_date,
            smo.quantity,
            smo.smos_id as status,
            mt.name,
            ms.price,
            ms.size
        FROM shop_material_order smo
        JOIN shop_material sm ON smo.sm_id = sm.sm_id
        JOIN material_type mt ON sm.mt_id = mt.mt_id
        JOIN material_size ms ON sm.ms_id = ms.ms_id
        `
    );

    console.log(order);
    return res.status(200).json({ order });

  } catch (error) {
    console.error('order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}