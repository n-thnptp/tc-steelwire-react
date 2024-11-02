// pages/api/manager/dashboard.js
import { formatNumber } from '../../../components/Utils/formatNumber';
import query from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { timeframe = 'WEEK' } = req.query;

  try {
    let salesQuery;

    switch (timeframe) {
      case 'WEEK':
        // ดึงข้อมูลรายวันของสัปดาห์นี้
        salesQuery = `
          SELECT 
            DATE(o_date) as date,
            DAYNAME(o_date) as label,
            SUM(o_total_price) as total_sales
          FROM \`order\`
          WHERE o_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          GROUP BY DATE(o_date)
          ORDER BY date ASC
        `;
        break;

      case 'MONTH':
        // ดึงข้อมูลรายสัปดาห์ของเดือนนี้
        salesQuery = `
          SELECT 
            WEEK(o_date) as week_number,
            CONCAT('Week ', WEEK(o_date) - WEEK(DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY)) + 1) as label,
            SUM(o_total_price) as total_sales
          FROM \`order\`
          WHERE o_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
          GROUP BY WEEK(o_date)
          ORDER BY week_number ASC
        `;
        break;

      case 'YEAR':
        // ดึงข้อมูลรายเดือนของปีนี้
        salesQuery = `
          SELECT 
            MONTH(o_date) as month_number,
            DATE_FORMAT(o_date, '%b') as label,
            SUM(o_total_price) as total_sales
          FROM \`order\`
          WHERE YEAR(o_date) = YEAR(CURDATE())
          GROUP BY MONTH(o_date)
          ORDER BY month_number ASC
        `;
        break;
      default:
        break;
    }

    const salesData = await query(salesQuery);

    const stockReport = await query(`
      SELECT 
        mt.name as material_type,
        ms.size as material_size,
        sm.total_amount as quantity,
        sm.min_amount,
        sm.total_amount >= sm.min_amount as is_in_stock,
        (
          SELECT order_date
          FROM shop_material_order smo
          WHERE smo.sm_id = sm.sm_id
            AND smo.smos_id = 2
          ORDER BY order_date DESC
          LIMIT 1
        ) as last_add_date
      FROM shop_material sm
      JOIN material_type mt ON mt.mt_id = sm.mt_id
      JOIN material_size ms ON ms.ms_id = sm.ms_id
      ORDER BY mt.name, ms.size
    `);

    

    const stockStatus = stockReport.map(item => ({
      material_type: item.material_type,
      material_size: `${item.material_size} MM`,
      date_added: item.last_add_date ?
        new Date(item.last_add_date).toISOString() :
        'Never add',
      stock_status: item.total_amount === 0 ? 'Out of Stock' :
        item.is_in_stock ? 'In Stock' : 'Low Stock',
      quantity: `${formatNumber(item.quantity)} KGS`
    }));


    const recentOrders = await query(`
      SELECT 
        sm.sm_id,
        mt.name as material_type,
        ms.size as material_size,
        smo.order_date as date_added,
        smo.quantity
      FROM shop_material_order smo
      JOIN shop_material sm ON smo.sm_id = sm.sm_id
      JOIN material_type mt ON mt.mt_id = sm.mt_id
      JOIN material_size ms ON ms.ms_id = sm.ms_id
      ORDER BY smo.order_date DESC
      LIMIT 5
    `);

    // Best Seller Query
    const bestSellers = await query(`
      SELECT 
        sm.sm_id, 
        mt.name as material_type,
        ms.size as material_size,
        SUM(p.weight * product_counts.order_count) AS weight_sold, 
        ms.price AS price_per_kg, 
        SUM(p.weight * ms.price * product_counts.order_count) AS total_price 
      FROM shop_material sm 
      JOIN product p ON p.sm_id = sm.sm_id 
      JOIN material_size ms ON sm.ms_id = ms.ms_id 
      JOIN material_type mt ON mt.mt_id = sm.mt_id
      JOIN (
        SELECT p_id, COUNT(*) as order_count 
        FROM order_product 
        GROUP BY p_id
      ) product_counts ON p.p_id = product_counts.p_id 
      GROUP BY sm.sm_id, ms.price 
      ORDER BY total_price DESC 
      LIMIT 5
    `);

    return res.status(200).json({
      salesData,
      stockStatus,
      recentOrders: recentOrders.map(order => ({
        ...order,
        material_size: `${order.material_size} MM`,
        quantity: `${formatNumber(order.quantity)} KGS`,
      })),
      bestSellers: bestSellers.map(seller => ({
        ...seller,
        material_size: `${seller.material_size} MM`,
        weight_sold: `${seller.weight_sold} KGS`,
        price_per_kg: `${formatNumber(seller.price_per_kg)} BAHT`,
        total_price: `${formatNumber(seller.total_price)} BAHT`,
      }))
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}