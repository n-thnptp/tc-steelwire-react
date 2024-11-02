import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const orders = await query(
      `
        SELECT DISTINCT
            o.o_id, 
            o.c_id, 
            o.o_date,
            o.o_total_price, 
            o.o_estimated_shipping_day,
            c.name as courier_name,
            u.firstname,
            u.lastname,
            u.company,
            u.email,
            u.phone_number,
            sh.address,
            t.name_en as tambon,
            t.zip_code,
            a.name_en as aumphur,
            p.name_en as province
        FROM \`order\` o
        JOIN courier c ON o.courier_id = c.courier_id
        JOIN user u ON o.c_id = u.c_id
        JOIN shipping_address sh ON u.sh_id = sh.sh_id
        JOIN tambons t ON sh.tambon_id = t.tambon_id
        JOIN amphurs a ON t.amphur_id = a.amphur_id
        JOIN provinces p ON a.province_id = p.province_id
        WHERE o.o_id = ?
        `,
      [id]
    );

    const products = await query(
      `
        SELECT 
            o.o_id,
            p.feature,
            p.weight as quantity,
            mt.name as material_name,
            ms.size,
            ms.price
        FROM \`order\` o
        JOIN order_product op ON o.o_id = op.o_id
        JOIN product p ON op.p_id = p.p_id
        JOIN shop_material sm ON p.sm_id = sm.sm_id
        JOIN material_type mt ON sm.mt_id = mt.mt_id
        JOIN material_size ms ON sm.ms_id = ms.ms_id
        WHERE o.o_id = ?
        `,
      [id]
    );

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderWithProducts = {
      ...orders[0],
      products: products.map(product => ({
        feature: product.feature,
        material_name: product.material_name,
        size: product.size,
        price: product.price,
        quantity: product.quantity
      }))
    };

    return res.status(200).json({ order: orderWithProducts });

  } catch (error) {
    console.error('order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}