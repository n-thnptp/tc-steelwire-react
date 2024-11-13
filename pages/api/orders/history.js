import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get user ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        // Fetch completed or canceled orders with product details
        const orders = await query(`
            SELECT 
                o.o_id,
                o.o_total_price,
                o.o_status_id,
                o.o_date,
                GROUP_CONCAT(mt.name) AS material_names,
                CASE 
                    WHEN o.o_status_id = 4 THEN 'เสร็จสิ้น'
                    WHEN o.o_status_id = 5 THEN 'ยกเลิกออร์เดอร์'
                END AS status
            FROM \`order\` o
            JOIN order_product op ON o.o_id = op.o_id
            JOIN product p ON op.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            WHERE o.c_id = ? 
            AND o.o_status_id IN (4, 5)  -- Only completed or canceled orders
            GROUP BY o.o_id
            ORDER BY o.o_date DESC`,
            [customerId]
        );

        return res.status(200).json({
            success: true,
            result: orders
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 