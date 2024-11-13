import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
        const result = await query(
            `SELECT 
                o_id,
                c_id,
                o_date,
                o_status_id,
                shipping_fee,
                o_total_price,
                o_estimated_shipping_day,
                courier_id
             FROM \`order\` 
             WHERE o_id = ?`,
            [id]
        );

        if (!result || result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Format the date if needed
        const order = {
            ...result[0],
            o_date: new Date(result[0].o_date).toISOString()
        };

        return res.status(200).json({ 
            success: true, 
            order: order
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Database error occurred',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
