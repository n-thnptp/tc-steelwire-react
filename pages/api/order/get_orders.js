import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

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

        // Get total count first
        const [totalResult] = await query(`
            SELECT COUNT(DISTINCT o.o_id) as total
            FROM \`order\` o
            WHERE o.c_id = ? AND o.o_status_id < 4`,
            [customerId]
        );

        // Fetch orders with product details, grouped by order ID with pagination
        const orders = await query(`
            SELECT 
                o.o_id,
                o.o_total_price,
                o.o_status_id,
                o.shipping_fee,
                GROUP_CONCAT(mt.name) AS material_names,
                CASE 
                    WHEN o.o_status_id = 1 THEN 'ยืนยันยอดเรียบร้อย'
                    WHEN o.o_status_id = 2 THEN 'จ่ายเงินแล้ว'
                    WHEN o.o_status_id = 3 THEN 'กำลังดำเนินการ'
                END AS status,
                CASE 
                    WHEN o.o_status_id = 1 THEN 25
                    WHEN o.o_status_id = 2 THEN 50
                    WHEN o.o_status_id = 3 THEN 75
                END AS progress
            FROM \`order\` o
            JOIN order_product op ON o.o_id = op.o_id
            JOIN product p ON op.p_id = p.p_id
            JOIN shop_material sm ON p.sm_id = sm.sm_id
            JOIN material_type mt ON sm.mt_id = mt.mt_id
            WHERE o.c_id = ?
            AND o.o_status_id < 4
            GROUP BY o.o_id
            ORDER BY o.o_date DESC
            LIMIT ? OFFSET ?`,
            [customerId, limit, offset]
        );

        return res.status(200).json({
            success: true,
            orders: orders,
            total: totalResult.total,
            currentPage: page,
            totalPages: Math.ceil(totalResult.total / limit)
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 