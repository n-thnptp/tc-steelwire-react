import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const materials = await query(
      `
      SELECT
        sm.sm_id,
        mt.name AS type,
        ms.size AS size,
        ms.price AS price,
        sm.total_amount,
        sm.min_amount
      FROM shop_material sm
      JOIN material_size ms ON sm.ms_id = ms.ms_id
      JOIN material_type mt ON sm.mt_id = mt.mt_id
      `
    );
    return res.status(200).json({ materials });

  } catch (error) {
    console.error('fetch materials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}