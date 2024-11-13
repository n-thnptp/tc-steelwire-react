import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        // First get order info
        const orderInfo = await query(`
            SELECT 
                o.*,
                CASE 
                    WHEN o.o_status_id = 1 THEN 'ยืนยันยอดเรียบร้อย'
                    WHEN o.o_status_id = 2 THEN 'จ่ายเงินแล้ว'
                    WHEN o.o_status_id = 3 THEN 'กำลังดำเนินการ'
                    WHEN o.o_status_id = 4 THEN 'เสร็จสิ้น'
                    WHEN o.o_status_id = 5 THEN 'ยกเลิกออร์เดอร์'
                END AS status,
                CASE 
                    WHEN o.o_status_id = 1 THEN 25
                    WHEN o.o_status_id = 2 THEN 50
                    WHEN o.o_status_id = 3 THEN 75
                    WHEN o.o_status_id = 4 THEN 100
                    WHEN o.o_status_id = 5 THEN 0
                END AS progress
            FROM \`order\` o
            WHERE o.o_id = ?
        `, [id]);

        if (orderInfo.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Then get all products in this order
        const products = await query(`
            SELECT 
                p.*,
                mt.name AS material_type_name,
                ms.size
            FROM order_product op
            JOIN product p ON op.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_size ms ON sm.ms_id = ms.ms_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            WHERE op.o_id = ?
        `, [id]);

        return res.status(200).json({
            success: true,
            order: {
                ...orderInfo[0],
                products: products
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 