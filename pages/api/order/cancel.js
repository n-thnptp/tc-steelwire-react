import query from '../../../lib/db';

export default async function handler(req, res) {
    // Change to accept both POST and DELETE methods
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderId } = req.body;

    try {
        // Get order products and their weights
        const orderProducts = await query(`
            SELECT 
                p.p_id,
                p.weight,
                p.sm_id
            FROM order_product op
            JOIN product p ON op.p_id = p.p_id
            WHERE op.o_id = ?`,
            [orderId]
        );

        // Restore stock for each product
        for (const product of orderProducts) {
            await query(
                `UPDATE shop_material 
                SET total_amount = total_amount + ?
                WHERE sm_id = ?`,
                [product.weight, product.sm_id]
            );
        }

        // Update order status to cancelled (5)
        await query(
            `UPDATE \`order\` 
            SET o_status_id = 5
            WHERE o_id = ?`,
            [orderId]
        );

        return res.status(200).json({
            success: true,
            message: 'Order cancelled and stock restored'
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 