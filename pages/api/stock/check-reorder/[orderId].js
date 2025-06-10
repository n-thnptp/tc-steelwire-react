import query from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    const { orderId } = req.query;

    try {
        const products = await query(`
            SELECT 
                sm.total_amount,
                mt.name as material_name,
                ms.size,
                p.weight as order_weight
            FROM order_product op
            JOIN product p ON op.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            JOIN material_size ms ON sm.ms_id = ms.ms_id
            WHERE op.o_id = ?
        `, [orderId]);

        for (const product of products) {
            const remainingAfterOrder = product.total_amount - product.order_weight;
            const maxOrderable = Math.max(0, product.total_amount - 3800);
            
            if (remainingAfterOrder < 3800) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for PC ${product.material_name} ${product.size}MM. Maximum orderable amount: ${maxOrderable} KG`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Stock available for re-order'
        });

    } catch (error) {
        console.error('Error checking stock for reorder:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while checking stock'
        });
    }
} 